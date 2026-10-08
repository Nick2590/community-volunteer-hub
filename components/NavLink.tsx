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
                        href="/signin"
                        className={pathname === "/signin" ? "text-emerald-700" : ""}
                        aria-current={pathname === "/signin" ? "page" : undefined}
                    >
                    Sign in
                    </Link>
                </li>
            </ul>
        </nav>
    );
}