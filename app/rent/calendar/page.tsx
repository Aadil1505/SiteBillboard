import { CalendarRentalForm } from '@/components/subdomain/calendar-rental-form';
import { getBookedDates } from '@/lib/new-actions';
import { Suspense } from 'react';


interface CalendarRentalPageProps {
  searchParams: {
    subdomain?: string;
    icon?: string;
  };
}

export default async function CalendarRentalPage({ 
  searchParams 
}: CalendarRentalPageProps) {
  const { subdomain, icon } = searchParams;

  if (!subdomain || !icon) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Missing Information</h1>
          <p className="text-gray-600 mb-4">
            Subdomain and icon information is required to proceed.
          </p>
          <a 
            href="/rent" 
            className="text-blue-600 hover:underline"
          >
            Go back to subdomain selection
          </a>
        </div>
      </div>
    );
  }

  // Fetch booked dates for this subdomain
  const bookedDates = await getBookedDates(subdomain);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-3xl">{decodeURIComponent(icon)}</span>
          <h1 className="text-2xl font-bold">
            {decodeURIComponent(subdomain)}.{process.env.ROOT_DOMAIN || 'localhost'}
          </h1>
        </div>
        <p className="text-gray-600">
          Select the dates you want to rent this subdomain
        </p>
      </div>

      <Suspense fallback={
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      }>
        <CalendarRentalForm 
          subdomain={decodeURIComponent(subdomain)}
          icon={decodeURIComponent(icon)}
          bookedDates={bookedDates}
        />
      </Suspense>
    </div>
  );
}