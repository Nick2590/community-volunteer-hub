import Link from 'next/link';
import type { Organization } from '@/types/project';

interface OrganizationCardProps {
  organization: Organization;
}

export default function OrganizationCard({ organization }: OrganizationCardProps) {
  return (
    <Link
      href={`/organizations/${organization.id}`}
      className="group block h-full rounded-md border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-700 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
    >
      <article className="flex h-full flex-col">
        <h2 className="text-xl font-semibold text-emerald-900 group-hover:text-emerald-700">
          {organization.name}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{organization.description}</p>
        <dl className="mt-5 grid gap-3 border-t border-slate-100 pt-4 text-sm">
          <div>
            <dt className="font-medium text-slate-600">Email</dt>
            <dd className="mt-1 text-slate-800">{organization.contactEmail}</dd>
          </div>
          {organization.phoneNumber && (
            <div>
              <dt className="font-medium text-slate-600">Phone</dt>
              <dd className="mt-1 text-slate-800">{organization.phoneNumber}</dd>
            </div>
          )}
        </dl>
      </article>
    </Link>
  );
}