import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['de', 'en'],
  defaultLocale: 'de',
  localePrefix: 'as-needed',
  localeDetection: false,
  localeCookie: false,
  // hreflang comes from <link> tags in metadata (Link header would use the request host).
  alternateLinks: false,
  // Folders under src/app/[locale] stay German; next-intl rewrites EN paths.
  pathnames: {
    '/': '/',
    '/impressum': { de: '/impressum', en: '/legal-notice' },
    '/datenschutz': { de: '/datenschutz', en: '/privacy-policy' },
    '/kontakt': { de: '/kontakt', en: '/contact' },
    '/portfolio': { de: '/portfolio', en: '/portfolio' },
    '/leistungen/[pillar]': {
      de: '/leistungen/[pillar]',
      en: '/services/[pillar]',
    },
  },
});
