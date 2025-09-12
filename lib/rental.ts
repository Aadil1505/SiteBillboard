import { db } from '@/db/drizzle';
import { rental, rentalDate } from '@/db/schema';
import { eq, and, inArray } from 'drizzle-orm';

/**
 * Check if subdomain is available (not already rented by someone else)
 */
export async function isSubdomainAvailable(subdomain: string): Promise<boolean> {
  const existing = await db
    .select()
    .from(rental)
    .where(eq(rental.subdomain, subdomain))
    .limit(1);
    
  return existing.length === 0;
}

/**
 * Get all booked dates for a subdomain
 */
export async function getBookedDates(subdomain: string): Promise<Date[]> {
  const result = await db
    .select({
      date: rentalDate.date,
    })
    .from(rental)
    .innerJoin(rentalDate, eq(rental.id, rentalDate.rentalId))
    .where(eq(rental.subdomain, subdomain));

  return result.map(r => new Date(r.date));
}

/**
 * Check if specific dates are available for a subdomain
 */
export async function areDatesAvailable(
  subdomain: string, 
  dates: Date[]
): Promise<boolean> {
  // Convert dates to YYYY-MM-DD format for comparison
  const dateStrings = dates.map(d => d.toISOString().split('T')[0]);
  
  // Check if any of these dates are already booked
  const bookedDates = await db
    .select({
      date: rentalDate.date,
    })
    .from(rental)
    .innerJoin(rentalDate, eq(rental.id, rentalDate.rentalId))
    .where(
      and(
        eq(rental.subdomain, subdomain),
        inArray(rentalDate.date, dateStrings)
      )
    );

  // If any dates are found, they're not available
  return bookedDates.length === 0;
}

/**
 * Create a rental with multiple individual dates
 */
export async function createRental(
  subdomain: string,
  emoji: string,
  userId: string,
  dates: Date[]
): Promise<void> {
  // Generate rental ID
  const rentalId = crypto.randomUUID();
  
  // Create the main rental record
  await db.insert(rental).values({
    id: rentalId,
    subdomain,
    emoji,
    userId,
  });

  // Create individual date records for each selected date
  const dateRecords = dates.map(date => ({
    id: crypto.randomUUID(),
    rentalId,
    date: date.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
  }));

  if (dateRecords.length > 0) {
    await db.insert(rentalDate).values(dateRecords);
  }
}

/**
 * Get user's rentals with their dates
 */
export async function getUserRentals(userId: string) {
  const result = await db
    .select({
      rentalId: rental.id,
      subdomain: rental.subdomain,
      emoji: rental.emoji,
      createdAt: rental.createdAt,
      date: rentalDate.date,
    })
    .from(rental)
    .leftJoin(rentalDate, eq(rental.id, rentalDate.rentalId))
    .where(eq(rental.userId, userId));

  // Group dates by rental
  const rentalsMap = new Map();
  
  result.forEach(row => {
    if (!rentalsMap.has(row.rentalId)) {
      rentalsMap.set(row.rentalId, {
        id: row.rentalId,
        subdomain: row.subdomain,
        emoji: row.emoji,
        createdAt: row.createdAt,
        dates: []
      });
    }
    
    if (row.date) {
      rentalsMap.get(row.rentalId).dates.push(new Date(row.date));
    }
  });

  return Array.from(rentalsMap.values());
}

/**
 * Get rental info for a subdomain (for displaying on the subdomain page)
 */
export async function getSubdomainRental(subdomain: string) {
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
    .leftJoin(rentalDate, eq(rental.id, rentalDate.rentalId))
    .where(eq(rental.subdomain, subdomain));

  if (result.length === 0) return null;

  const first = result[0];
  return {
    id: first.rentalId,
    subdomain: first.subdomain,
    emoji: first.emoji,
    userId: first.userId,
    createdAt: first.createdAt,
    dates: result.filter(r => r.date).map(r => new Date(r.date))
  };
}

/**
 * Delete a rental and all its dates
 */
export async function deleteRental(rentalId: string): Promise<void> {
  // Delete rental dates first (due to foreign key constraint)
  await db.delete(rentalDate).where(eq(rentalDate.rentalId, rentalId));
  
  // Then delete the rental
  await db.delete(rental).where(eq(rental.id, rentalId));
}