import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrganizationById } from '@/data/projects';

interface OrganizationDetailPageProps {
  params: Promise<{ id: string }>;
}

const linkClassName =
  'font-semibold text-emerald-800 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700';

export async function generateMetadata({
  params,
}: OrganizationDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const organization = getOrganizationById(id);

  if (!organization) {
    return { title: 'Organization not found' };
  }

  return {
    title: `${organization.name}`,
    description: organization.description,
  };
}

export default async function OrganizationDetailPage({ params }: OrganizationDetailPageProps) {
  const { id } = await params;
  const organization = getOrganizationById(id);

  if (!organization) {
    notFound();
  }

  return (
    <main className="min-h-full flex-1 bg-slate-50 px-6 py-12 text-slate-900 sm:py-16">
      <article className="mx-auto w-full max-w-3xl">
        <Link href="/organizations" className={`text-sm ${linkClassName}`}>
          &larr; Back to organizations
        </Link>

        <div className="mt-8 rounded-md border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-bold sm:text-4xl">{organization.name}</h1>

          <section className="mt-6" aria-labelledby="organization-description-heading">
            <h2
              id="organization-description-heading"
              className="text-lg font-semibold text-slate-900"
            >
              About this organization
            </h2>
            <p className="mt-3 leading-7 text-slate-700">{organization.description}</p>
          </section>

          <section
            className="mt-6 border-t border-slate-200 pt-6"
            aria-labelledby="organization-contact-heading"
          >
            <h2 id="organization-contact-heading" className="text-lg font-semibold text-slate-900">
              Contact Information
            </h2>
            <dl className="mt-4 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-slate-500">Email</dt>
                <dd className="mt-1 text-slate-900">
                  <a href={`mailto:${organization.contactEmail}`} className={linkClassName}>
                    {organization.contactEmail}
                  </a>
                </dd>
              </div>
              {organization.phoneNumber && (
                <div>
                  <dt className="text-sm font-medium text-slate-500">Phone</dt>
                  <dd className="mt-1 text-slate-900">
                    <a href={`tel:${organization.phoneNumber}`} className={linkClassName}>
                      {organization.phoneNumber}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </section>
        </div>
      </article>
    </main>
  );
}