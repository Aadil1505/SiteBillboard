'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { rootDomain, protocol } from '@/lib/utils';
import { isValidIcon } from '@/lib/subdomains';
import { requireAuth } from '@/auth/session';
import { 
  isSubdomainAvailable, 
  createRental,
  deleteRental
} from '@/lib/rental';
import { db } from '@/db/drizzle';
import { rental } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Create subdomain action (for simple creation without rental dates)
export async function createSubdomainAction(
  prevState: any,
  formData: FormData
) {
  const session = await requireAuth();
  const userId = session.user.id;

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

  const available = await isSubdomainAvailable(sanitizedSubdomain);
  if (!available) {
    return {
      subdomain,
      icon,
      success: false,
      error: 'This subdomain is  taken'
    };
  }

  // Create rental with no specific dates (for simple subdomain creation)
  await createRental(sanitizedSubdomain, icon, userId, []);

  redirect(`${protocol}://${sanitizedSubdomain}.${rootDomain}`);
}

// Delete subdomain action (for admin)
export async function deleteSubdomainAction(
  prevState: any,
  formData: FormData
) {
  try {
    // TODO: Add proper admin auth check
    const subdomainName = formData.get('subdomain') as string;
    
    if (!subdomainName) {
      return { success: false, error: 'Subdomain name is required' };
    }

    // Find the rental to delete
    const rentalToDelete = await db
      .select()
      .from(rental)
      .where(eq(rental.subdomain, subdomainName))
      .limit(1);

    if (rentalToDelete.length > 0) {
      await deleteRental(rentalToDelete[0].id);
    }

    revalidatePath('/admin');
    return { success: true, message: 'Domain deleted successfully' };
  } catch (error) {
    console.error('Error deleting subdomain:', error);
    return { success: false, error: 'Failed to delete domain' };
  }
}