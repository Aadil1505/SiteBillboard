// app/dashboard/editor/page.tsx
import { requireAuth } from '@/auth/session';
import { EditorInterface } from '@/components/subdomain/editor';
import { getUserActiveRentals } from '@/lib/rental';

export default async function EditorPage() {
  const session = await requireAuth();
  const activeRentals = await getUserActiveRentals(session.user.id);

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Content Editor</h1>
        <p className="text-muted-foreground">
          Edit the content for your active subdomain rentals
        </p>
      </div>

      {activeRentals.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No Active Rentals</h2>
          <p className="text-muted-foreground mb-4">
            You don't have any active subdomain rentals to edit.
          </p>
          <a 
            href="/dashboard/rent" 
            className="text-primary hover:underline"
          >
            Rent a subdomain →
          </a>
        </div>
      ) : (
        <EditorInterface rentals={activeRentals} />
      )}
    </div>
  );
}