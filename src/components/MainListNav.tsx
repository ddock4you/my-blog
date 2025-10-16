'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export type NavItem = {
  label: string;
  href: string;
};

// 메인 목록 전환(포스팅/시리즈) 메뉴 항목
export const MAIN_LIST_ITEMS: NavItem[] = [
  { label: '포스팅', href: '/' },
  { label: '시리즈', href: '/series' },
];

export function MainListNav() {
  const pathname = usePathname();
  const isSeries = pathname.startsWith('/series');
  const isItemActive = (href: string) => {
    if (href === '/') return !isSeries;
    if (href === '/series') return isSeries;
    return pathname.startsWith(href);
  };

  return (
    <nav aria-label="목록 전환">
      <ul className="flex gap-4 md:gap-5">
        {MAIN_LIST_ITEMS.map(item => {
          const isActive = isItemActive(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={clsx(
                  'text-text-primary inline-block text-xl md:text-2xl',
                  isActive ? 'font-bold' : 'text-text-secondary'
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
