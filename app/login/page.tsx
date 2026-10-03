'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import type { AuthResponse } from '@/app/lib/auth-types';

export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage('');
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = (await response.json()) as AuthResponse;

      setMessage(data.message);

      if (response.ok) {
        router.push('/account');
      }
    } catch {
      setMessage(
        'Unable to sign in right now. Please try again later.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Sign In</h1>

      <p className="mt-2 text-slate-600">
        Sign in to your Community Volunteer Hub account.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block font-medium text-slate-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block font-medium text-slate-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </button>

        {message && (
          <p
            className="text-sm text-slate-600"
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        )}
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-semibold text-emerald-700 hover:text-emerald-800"
        >
          Create Account
        </Link>
      </p>

      <p className="mt-3 text-center text-sm">
        <Link
          href="/"
          className="text-slate-600 hover:text-emerald-700"
        >
          Back to Home
        </Link>
      </p>
    </main>
  );
}