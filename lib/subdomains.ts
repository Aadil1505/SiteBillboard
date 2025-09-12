import { db } from '@/db/drizzle';
import { rental, rentalDate } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSubdomainRental } from './rental';

export function isValidIcon(str: string) {
  if (str.length > 10) {
    return false;
  }

  try {
    // Primary validation: Check if the string contains at least one emoji character
    // This regex pattern matches most emoji Unicode ranges
    const emojiPattern = /[\p{Emoji}]/u;
    if (emojiPattern.test(str)) {
      return true;
    }
  } catch (error) {
    // If the regex fails (e.g., in environments that don't support Unicode property escapes),
    // fall back to a simpler validation
    console.warn(
      'Emoji regex validation failed, using fallback validation',
      error
    );
  }

  // Fallback validation: Check if the string is within a reasonable length
  // This is less secure but better than no validation
  return str.length >= 1 && str.length <= 10;
}

export async function getSubdomainData(subdomain: string) {
  const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
  return await getSubdomainRental(sanitizedSubdomain);
}

export async function getAllSubdomains() {
  const result = await db
    .select({
      rentalId: rental.id,
      subdomain: rental.subdomain,
      emoji: rental.emoji,
      userId: rental.userId,
      createdAt: rental.createdAt,
      date: rentalDate.date,
    })
    .from(rental)
    .leftJoin(rentalDate, eq(rental.id, rentalDate.rentalId));

  // Group dates by rental
  const rentalsMap = new Map();
  
  result.forEach(row => {
    if (!rentalsMap.has(row.rentalId)) {
      rentalsMap.set(row.rentalId, {
        subdomain: row.subdomain,
        emoji: row.emoji,
        createdAt: row.createdAt.getTime(),
        ownerId: row.userId,
        dates: []
      });
    }
    
    if (row.date) {
      rentalsMap.get(row.rentalId).dates.push(row.date);
    }
  });

  return Array.from(rentalsMap.values());
}