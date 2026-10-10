'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { AuthResponse, AuthUser } from '@/app/lib/auth-types';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [message, setMessage] = useState('Checking your session...');
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch('/api/auth/me');
        const data = (await response.json()) as AuthResponse;

        if (!response.ok || !data.user) {
          setMessage(data.message);
          return;
        }

        setUser(data.user);
        setMessage('');
      } catch {
        setMessage(
          'Unable to check your account right now. Please try again later.',
        );
      }
    }

    void loadUser();
  }, []);

  async function handleSignOut() {
    setIsSigningOut(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      const data = (await response.json()) as AuthResponse;

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      router.push('/login');
      router.refresh();
    } catch {
      setMessage(
        'Unable to sign out right now. Please try again later.',
      );
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 bg-slate-50 px-4 py-12 text-slate-900 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">My Account</h1>

      {message && (
        <p
          className="mt-6 rounded-md border border-slate-200 bg-slate-50 p-4 text-slate-700"
          role="status"
          aria-live="polite"
        >
          {message}
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
                {user.role === 'VOLUNTEER'
                  ? 'Volunteer'
                  : 'Organization'}
              </dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="mt-6 rounded-md bg-emerald-800 px-4 py-2 font-semibold text-white hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSigningOut ? 'Signing Out...' : 'Sign Out'}
          </button>
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