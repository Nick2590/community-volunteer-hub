import Link from 'next/link';

import PageMessage from '@/components/PageMessage';

export default function NotFound() {
  return (
    <PageMessage
      eyebrow="Error 404"
      title="Page not found"
      actions={
        <>
          <Link
            href="/projects"
            className="rounded-md bg-emerald-800 px-5 py-3 font-semibold text-white hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            Browse Opportunities
          </Link>
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
        We couldn&apos;t find the page you were looking for. It may have been
        moved, or the project may have been removed by its organization.
      </p>
    </PageMessage>
  );
}
