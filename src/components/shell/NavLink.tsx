'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/** A link that marks itself as the current page (aria-current) when its section is open. */
export function NavLink({ href, className, children, exact = false }: { href: string; className: string; children: ReactNode; exact?: boolean }) {
  const path = usePathname();
  const active = exact || href === '/' ? path === href : path === href || path.startsWith(`${href}/`);
  return (
    <Link href={href} className={className} aria-current={active ? 'page' : undefined}>
      {children}
    </Link>
  );
}
