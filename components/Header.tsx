import Link from 'next/link';

import NavLinks from './NavLink';

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
        <Link
          href="/"
          className="text-lg font-bold text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          Community Volunteer Hub
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}
