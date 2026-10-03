import Link from 'next/link';
import { notFound } from 'next/navigation';
import { organizations } from '@/data/organizations';

export default async function OrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const organization = organizations.find((org) => org.id === id);

  if (!organization) {
    notFound();
  }

  return (
    <main className="min-h-full flex-1 bg-slate-50 px-6 py-12 text-slate-900 sm:py-16">
      <article className="mx-auto w-full max-w-3xl">
        <Link
          href="/organizations"
          className="text-sm font-semibold text-emerald-800 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          &larr; Back to organizations
        </Link>

        <div className="mt-8 rounded-md border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{organization.title}</h1>

          <section className="mt-6" aria-labelledby="organization-description-heading">
            <h2
              id="organization-description-heading"
              className="text-lg font-semibold text-slate-900"
            >
              About this organization
            </h2>
            <p className="mt-3 leading-7 text-slate-700">{organization.description}</p>
          </section>

          <dl className="mt-6 grid gap-5 border-y border-slate-200 py-5">
            <h2
              id="organization-contact-heading"
              className="text-lg font-semibold text-slate-900"
            >
              Contact Information
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-slate-500">Email</dt>
                <dd className="mt-1 text-slate-900">{organization.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Phone</dt>
                <dd className="mt-1 text-slate-900">{organization.phoneNumber}</dd>
              </div>
            </div>
          </dl>
        </div>
      </article>
    </main>
  );
}