import Link from 'next/link';

import { getCurrentUser } from '@/app/lib/auth';
import SignOutButton from '@/components/SignOutButton';

export const metadata = { title: 'My Account' };

export default async function AccountPage() {
  const user = await getCurrentUser();

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 bg-slate-50 px-4 py-12 text-slate-900 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">My Account</h1>

      {!user && (
        <p
          className="mt-6 rounded-md border border-slate-200 bg-slate-50 p-4 text-slate-700"
          role="status"
        >
          You are not signed in.{' '}
          <Link
            href="/login"
            className="font-semibold text-emerald-700 underline hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            Sign in
          </Link>
        </p>
      )}

      {user && (
        <section className="mt-8 rounded-md border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-emerald-800">
            Welcome, {user.name}
          </h2>

          <dl className="mt-5 space-y-3 text-slate-700">
            <div>
              <dt className="font-semibold">Email</dt>
              <dd>{user.email}</dd>
            </div>

            <div>
              <dt className="font-semibold">Account Type</dt>
              <dd>
                {user.role === 'VOLUNTEER' ? 'Volunteer' : 'Organization'}
              </dd>
            </div>
          </dl>

          <SignOutButton />
        </section>
      )}

      <p className="mt-6">
        <Link
          href="/"
          className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          Back to Home
        </Link>
      </p>
    </main>
  );
}
