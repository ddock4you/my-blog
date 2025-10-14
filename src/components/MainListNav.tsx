'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export function MainListNav() {
  const pathname = usePathname();
  const isSeries = pathname.startsWith('/series');

  return (
    <nav aria-label="목록 전환" className="mb-4 border-b md:mb-6">
      <ul className="flex gap-4">
        <li>
          <Link
            href="/"
            aria-current={!isSeries ? 'page' : undefined}
            className={clsx(
              'inline-block py-2',
              !isSeries ? 'border-b-2 font-semibold' : 'text-muted-foreground'
            )}
          >
            블로그 글
          </Link>
        </li>
        <li>
          <Link
            href="/series"
            aria-current={isSeries ? 'page' : undefined}
            className={clsx(
              'inline-block py-2',
              isSeries ? 'border-b-2 font-semibold' : 'text-muted-foreground'
            )}
          >
            시리즈
          </Link>
        </li>
      </ul>
    </nav>
  );
}
