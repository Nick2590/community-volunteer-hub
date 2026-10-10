'use client';

import Link from 'next/link';

import PageMessage from '@/components/PageMessage';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <PageMessage
      eyebrow="Something went wrong"
      title="We couldn't load this page"
      actions={
        <>
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-emerald-800 px-5 py-3 font-semibold text-white hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-md border border-emerald-800 px-5 py-3 font-semibold text-emerald-800 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            Back to Home
          </Link>
        </>
      }
    >
      <p>
        An unexpected error occurred. Please try again, or return to the home
        page.
      </p>
    </PageMessage>
  );
}
