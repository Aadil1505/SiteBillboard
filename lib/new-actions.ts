'use server';

import { redirect } from 'next/navigation';
import { rootDomain, protocol } from '@/lib/utils';
import { isValidIcon } from '@/lib/subdomains';
import { requireAuth } from '@/auth/session';
import { 
  isSubdomainAvailable, 
  getBookedDates,
  areDatesAvailable,
  createRental
} from '@/lib/rental';

// Check subdomain availability (for page 1)
export async function checkSubdomainAvailabilityAction(
  prevState: any,
  formData: FormData
) {
  const subdomainName = formData.get('subdomain') as string;
  const icon = formData.get('icon') as string;

  if (!subdomainName || !icon) {
    return { success: false, error: 'Subdomain and icon are required' };
  }

  if (!isValidIcon(icon)) {
    return {
      subdomain: subdomainName,
      icon,
      success: false,
      error: 'Please enter a valid emoji (maximum 10 characters)'
    };
  }

  const sanitized = subdomainName.toLowerCase().replace(/[^a-z0-9-]/g, '');

  if (sanitized !== subdomainName.toLowerCase()) {
    return {
      subdomain: subdomainName,
      icon,
      success: false,
      error: 'Subdomain can only have lowercase letters, numbers, and hyphens. Please try again.'
    };
  }

  // Check availability in database
  // const available = await isSubdomainAvailable(sanitized);
  
  // if (!available) {
  //   return {
  //     subdomain: subdomainName,
  //     icon,
  //     success: false,
  //     error: 'This subdomain is already taken'
  //   };
  // }

  return {
    subdomain: sanitized,
    icon,
    success: true,
    available: true
  };
}

// Create subdomain rental (for page 2)
export async function createSubdomainRentalAction(
  prevState: any,
  formData: FormData
) {
  const session = await requireAuth();
  const userId = session.user.id;

  const subdomainName = formData.get('subdomain') as string;
  const icon = formData.get('icon') as string;
  
  // Get selected dates from form data
  const dateEntries = Array.from(formData.entries())
    .filter(([key]) => key.startsWith('dates['))
    .map(([, value]) => new Date(value as string));

  if (!subdomainName || !icon || dateEntries.length === 0) {
    return { 
      success: false, 
      error: 'Subdomain, icon, and at least one date are required' 
    };
  }

  // Check if dates are still available
  const available = await areDatesAvailable(subdomainName, dateEntries);
  if (!available) {
    return {
      success: false,
      error: 'Some selected dates are no longer available'
    };
  }

  // Create the rental with all selected dates
  await createRental(subdomainName, icon, userId, dateEntries);

  // Redirect to the rented subdomain (outside of any try/catch)
  redirect(`${protocol}://${subdomainName}.${rootDomain}`);
}

// Get booked dates for a subdomain
export async function getBookedDatesAction(subdomainName: string): Promise<Date[]> {
  return await getBookedDates(subdomainName);
}