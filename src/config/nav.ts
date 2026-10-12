import type { routing } from '@/i18n/routing';

type AppPathname = keyof typeof routing.pathnames;

export interface NavLink {
  key: 'nav.home' | 'nav.about' | 'nav.services' | 'nav.portfolio' | 'nav.contact';
  pathname: AppPathname;
  hash?: string;
}

/**
 * Single shared source of truth for navigation links.
 * Used by both desktop navigation and mobile hamburger overlay in Header.tsx.
 * Rendered with Link from '@/i18n/navigation' (locale prefix + localized pathnames).
 *
 * Order matches the actual homepage section order:
 * 1. Home      (/#hero)
 * 2. About     (/#about)
 * 3. Services  (/#services)
 * 4. Portfolio (/#portfolio)
 * 5. Contact   (/kontakt - dedicated page)
 */
export const navLinks: NavLink[] = [
  { key: 'nav.home', pathname: '/', hash: 'hero' },
  { key: 'nav.about', pathname: '/', hash: 'about' },
  { key: 'nav.services', pathname: '/', hash: 'services' },
  { key: 'nav.portfolio', pathname: '/', hash: 'portfolio' },
  { key: 'nav.contact', pathname: '/kontakt' },
];
