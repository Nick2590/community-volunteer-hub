'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinks() {
    const pathname = usePathname();

    return (
        <nav aria-label="Main navigation">
            <ul className="flex items-center gap-5 text-sm font-medium text-slate-700">
                <li>
                    <Link
                        href="/"
                        className={pathname === "/" ? "text-emerald-700" : ""}
                        aria-current={pathname === "/" ? "page" : undefined}
                    >
                    Home
                    </Link>
                </li>
                <li>
                    <Link
                        href="/projects"
                        className={pathname === "/projects" ? "text-emerald-700" : ""}
                        aria-current={pathname === "/projects" ? "page" : undefined}
                    >
                    Opportunities
                    </Link>
                </li>
                <li>
                    <Link
                        href="/projects/new"
                        className={pathname === "/projects/new" ? "text-emerald-700" : ""}
                        aria-current={pathname === "/projects/new" ? "page" : undefined}
                    >
                    Post an Opportunity
                    </Link>
                </li>
                <li>
                    <Link
                        href="/dashboard"
                        className={pathname === "/dashboard" ? "text-emerald-700" : ""}
                        aria-current={pathname === "/dashboard" ? "page" : undefined}
                    >
                    Dashboard
                    </Link>
                </li>
                <li>
                    <Link
                        href="/organizations"
                        className={pathname.startsWith("/organizations") ? "text-emerald-700" : ""}
                        aria-current={pathname.startsWith("/organizations") ? "page" : undefined}
                    >
                    Organizations
                    </Link>
                </li>
                <li>
                    <Link
                        href="/login"
                        className={pathname === "/login" ? "text-emerald-700" : ""}
                        aria-current={pathname === "/login" ? "page" : undefined}
                    >
                    Sign in
                    </Link>
                </li>
            </ul>
        </nav>
    );
}