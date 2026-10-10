import type { Metadata } from 'next';
import Link from 'next/link';

import { getCurrentUser } from '@/app/lib/auth';
import ProjectForm from '@/components/ProjectForm';

export const metadata: Metadata = {
  title: 'Create a Project',
  description: 'Create a volunteer project for your organization.',
};

export default async function NewProjectPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="min-h-full flex-1 bg-slate-50 px-6 py-12 text-slate-900 sm:py-16">
        <section className="mx-auto max-w-2xl rounded-md border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Organization sign-in required
          </h1>
          <p className="mt-4 text-slate-700">
            Sign in with an organization account to create a volunteer project.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-flex rounded-md bg-emerald-800 px-4 py-2 font-semibold text-white hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            Sign in
          </Link>
        </section>
      </main>
    );
  }

  if (user.role !== 'ORGANIZATION') {
    return (
      <main className="min-h-full flex-1 bg-slate-50 px-6 py-12 text-slate-900 sm:py-16">
        <p
          className="mx-auto max-w-2xl rounded-md border border-amber-300 bg-amber-50 p-5 text-amber-950"
          role="alert"
        >
          Project creation is only available to organization accounts.
        </p>
      </main>
    );
  }

  return <ProjectForm mode="create" />;
}
