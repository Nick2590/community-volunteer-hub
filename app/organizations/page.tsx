import type { Metadata } from 'next';
import OrganizationCard from '@/components/OrganizationCard';
import { organizations } from '@/data/projects';

export const metadata: Metadata = {
  title: 'Organizations',
  description:
    'Browse the community organizations that offer volunteer opportunities on Community Volunteer Hub.',
};

export default function OrganizationsPage() {
  return (
    <main className="min-h-full flex-1 bg-slate-50 px-6 py-12 text-slate-900 sm:py-16">
      <div className="mx-auto w-full max-w-6xl">
        <header>
          <h1 className="text-3xl font-bold sm:text-4xl">Organizations</h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            These organizations offer volunteer opportunities in our community.
          </p>
        </header>

        {organizations.length > 0 ? (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {organizations.map((organization) => (
              <li key={organization.id}>
                <OrganizationCard organization={organization} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 rounded-md border border-slate-200 bg-white p-6 text-slate-700">
            No organizations are available.
          </p>
        )}
      </div>
    </main>
  );
}