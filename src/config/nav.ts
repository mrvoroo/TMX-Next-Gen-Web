export interface NavLink {
  key: 'nav.home' | 'nav.about' | 'nav.services' | 'nav.portfolio' | 'nav.contact';
  href: string;
}

/**
 * Single shared source of truth for navigation links.
 * Used by both desktop navigation and mobile hamburger overlay in Header.tsx.
 *
 * Order matches the actual homepage section order:
 * 1. Home      (/#hero)
 * 2. About     (/#about)
 * 3. Services  (/#services)
 * 4. Portfolio (/#portfolio)
 * 5. Contact   (/kontakt - dedicated page)
 */
export const navLinks: NavLink[] = [
  { key: 'nav.home', href: '/#hero' },
  { key: 'nav.about', href: '/#about' },
  { key: 'nav.services', href: '/#services' },
  { key: 'nav.portfolio', href: '/#portfolio' },
  { key: 'nav.contact', href: '/kontakt' },
];
