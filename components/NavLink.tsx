'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

interface NavItem {
  href: string;
  label: string;
  matchPrefix?: boolean;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Opportunities' },
  { href: '/projects/new', label: 'Post an Opportunity' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/organizations', label: 'Organizations', matchPrefix: true },
];

const linkClassName =
  'inline-block rounded-sm py-1 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700';

export default function NavLinks() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const authChecked = status !== 'loading';
  const user = session?.user ?? null;

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await signOut({ redirect: false });
    } finally {
      setIsSigningOut(false);
      router.push('/login');
      router.refresh();
    }
  }

  function isActive(item: NavItem): boolean {
    return item.matchPrefix ? pathname.startsWith(item.href) : pathname === item.href;
  }

  function itemClassName(active: boolean): string {
    return `${linkClassName} ${active ? 'text-emerald-800 underline underline-offset-4' : ''}`;
  }

  return (
    <nav aria-label="Main navigation">
      <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm font-medium text-slate-700">
        {navItems.map((item) => {
          const active = isActive(item);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={itemClassName(active)}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
        {authChecked && user && (
          <>
            <li>
              <Link
                href="/account"
                className={itemClassName(pathname === '/account')}
                aria-current={pathname === '/account' ? 'page' : undefined}
              >
                My Account
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className={`${linkClassName} font-medium disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {isSigningOut ? 'Signing out...' : 'Sign Out'}
              </button>
            </li>
          </>
        )}
        {authChecked && !user && (
          <li>
            <Link
              href="/login"
              className={itemClassName(pathname === '/login')}
              aria-current={pathname === '/login' ? 'page' : undefined}
            >
              Sign In
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
