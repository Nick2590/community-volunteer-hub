'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

import type { AuthResponse, UserRole } from '@/app/lib/auth-types';

export default function RegisterPage() {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage('');
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const role = String(formData.get('role') ?? '') as UserRole;

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = (await response.json()) as AuthResponse;

      setMessage(data.message);

      if (response.ok) {
        form.reset();
      }
    } catch {
      setMessage(
        'Unable to create the account right now. Please try again later.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-md flex-1 bg-slate-50 px-4 py-12 text-slate-900 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">
        Create Account
      </h1>

      <p className="mt-2 text-slate-600">
        Create an account to get started with Community Volunteer Hub.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block font-medium text-slate-700"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          />
        </div>

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
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
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
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          />
        </div>

        <div>
          <label
            htmlFor="role"
            className="mb-2 block font-medium text-slate-700"
          >
            Account Type
          </label>
          <select
            id="role"
            name="role"
            required
            defaultValue=""
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            <option value="" disabled>
              Select an account type
            </option>
            <option value="VOLUNTEER">Volunteer</option>
            <option value="ORGANIZATION">Organization</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-emerald-800 px-4 py-2 font-semibold text-white hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
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
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-emerald-700 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          Sign In
        </Link>
      </p>

      <p className="mt-3 text-center text-sm">
        <Link href="/" className="text-slate-600 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
          Back to Home
        </Link>
      </p>
    </main>
  );
}