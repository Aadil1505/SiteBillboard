'use server';

import { redis } from '@/lib/redis';
import { isValidIcon } from '@/lib/subdomains';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { rootDomain, protocol } from '@/lib/utils';

// Check subdomain availability (for page 1)
export async function checkSubdomainAvailabilityAction(
  prevState: any,
  formData: FormData
) {
  const subdomain = formData.get('subdomain') as string;
  const icon = formData.get('icon') as string;

  if (!subdomain || !icon) {
    return { success: false, error: 'Subdomain and icon are required' };
  }

  if (!isValidIcon(icon)) {
    return {
      subdomain,
      icon,
      success: false,
      error: 'Please enter a valid emoji (maximum 10 characters)'
    };
  }

  const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');

  if (sanitizedSubdomain !== subdomain) {
    return {
      subdomain,
      icon,
      success: false,
      error:
        'Subdomain can only have lowercase letters, numbers, and hyphens. Please try again.'
    };
  }

  const subdomainAlreadyExists = await redis.get(
    `subdomain:${sanitizedSubdomain}`
  );
  
  if (subdomainAlreadyExists) {
    return {
      subdomain,
      icon,
      success: false,
      error: 'This subdomain is already taken'
    };
  }

  // If available, return success
  return {
    subdomain: sanitizedSubdomain,
    icon,
    success: true,
    available: true
  };
}

// Create subdomain rental (for page 2 - after date selection)
export async function createSubdomainRentalAction(
  prevState: any,
  formData: FormData
) {
  const subdomain = formData.get('subdomain') as string;
  const icon = formData.get('icon') as string;
  
  // Get selected dates
  const dateEntries = Array.from(formData.entries())
    .filter(([key]) => key.startsWith('dates['))
    .map(([, value]) => new Date(value as string));

  if (!subdomain || !icon || dateEntries.length === 0) {
    return { 
      success: false, 
      error: 'Subdomain, icon, and at least one date are required' 
    };
  }

  // Double-check subdomain is still available
  const subdomainAlreadyExists = await redis.get(`subdomain:${subdomain}`);
  if (subdomainAlreadyExists) {
    return {
      success: false,
      error: 'This subdomain is no longer available'
    };
  }

  // Check if any selected dates are already booked
  const bookedDatesKey = `subdomain:${subdomain}:booked`;
  const existingBookedDates = await redis.smembers(bookedDatesKey);
  
  const conflictingDates = dateEntries.filter(date => 
    existingBookedDates.includes(date.toDateString())
  );

  if (conflictingDates.length > 0) {
    return {
      success: false,
      error: `Some selected dates are no longer available: ${conflictingDates.map(d => d.toLocaleDateString()).join(', ')}`
    };
  }

  try {
    // Create the subdomain
    await redis.set(`subdomain:${subdomain}`, {
      emoji: icon,
      createdAt: Date.now(),
      rentedDates: dateEntries.map(d => d.toISOString())
    });

    // Store booked dates in a separate set for easy querying
    if (dateEntries.length > 0) {
      await redis.sadd(
        bookedDatesKey,
        ...dateEntries.map(date => date.toDateString())
      );
    }

    // You might also want to store rental details for billing/tracking
    await redis.set(`rental:${subdomain}:${Date.now()}`, {
      subdomain,
      icon,
      dates: dateEntries.map(d => d.toISOString()),
      totalCost: dateEntries.length * 10, // $10 per day
      createdAt: Date.now()
    });

    // Redirect to the rented subdomain
    redirect(`${protocol}://${subdomain}.${rootDomain}`);
  } catch (error) {
    console.error('Error creating subdomain rental:', error);
    return {
      success: false,
      error: 'Failed to create rental. Please try again.'
    };
  }
}

// Helper function to get booked dates for a subdomain
export async function getBookedDates(subdomain: string): Promise<Date[]> {
  try {
    const bookedDatesKey = `subdomain:${subdomain}:booked`;
    const bookedDateStrings = await redis.smembers(bookedDatesKey);
    
    return bookedDateStrings.map(dateString => new Date(dateString));
  } catch (error) {
    console.error('Error fetching booked dates:', error);
    return [];
  }
}

export async function deleteSubdomainAction(
  prevState: any,
  formData: FormData
) {
  const subdomain = formData.get('subdomain');
  await redis.del(`subdomain:${subdomain}`);
  await redis.del(`subdomain:${subdomain}:booked`);
  revalidatePath('/admin');
  return { success: 'Domain deleted successfully' };
}