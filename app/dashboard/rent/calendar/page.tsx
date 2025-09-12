import { CalendarRentalForm } from '@/components/subdomain/calendar-rental-form';
import { getBookedDatesAction } from '@/lib/new-actions';
import { Suspense } from 'react';
import { requireAuth } from '@/auth/session';
import { rootDomain } from '@/lib/utils';

interface CalendarRentalPageProps {
  searchParams: Promise<{
    subdomain?: string;
    icon?: string;
  }>;
}

export default async function CalendarRentalPage({ 
  searchParams 
}: CalendarRentalPageProps) {
  // Ensure user is authenticated
  await requireAuth();
  
  const { subdomain, icon } = await searchParams;

  if (!subdomain || !icon) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto mt-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-2">Missing Information</h1>
            <p className="text-muted-foreground mb-4">
              Subdomain and icon information is required to proceed.
            </p>
            <a 
              href="/dashboard/rent" 
              className="text-primary hover:underline"
            >
              Go back to subdomain selection
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Fetch booked dates for this subdomain
  const bookedDates = await getBookedDatesAction(subdomain);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl">{decodeURIComponent(icon)}</span>
            <h1 className="text-2xl font-bold">
              {decodeURIComponent(subdomain)}.{rootDomain}
            </h1>
          </div>
          <p className="text-muted-foreground">
            Select the dates you want to rent this subdomain
          </p>
        </div>

        <Suspense fallback={
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }>
          <CalendarRentalForm 
            subdomain={decodeURIComponent(subdomain)}
            icon={decodeURIComponent(icon)}
            bookedDates={bookedDates}
          />
        </Suspense>
      </div>
    </div>
  );
}