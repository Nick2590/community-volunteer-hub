'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { AuthResponse, AuthUser } from '@/app/lib/auth-types';

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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Re-check the session on every navigation so the nav reflects sign-in and sign-out.
  useEffect(() => {
    let isCurrent = true;

    async function loadUser() {
      try {
        const response = await fetch('/api/auth/me');
        const data = (await response.json()) as AuthResponse;

        if (isCurrent) {
          setUser(response.ok && data.user ? data.user : null);
        }
      } catch {
        if (isCurrent) {
          setUser(null);
        }
      } finally {
        if (isCurrent) {
          setAuthChecked(true);
        }
      }
    }

    void loadUser();

    return () => {
      isCurrent = false;
    };
  }, [pathname]);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
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
