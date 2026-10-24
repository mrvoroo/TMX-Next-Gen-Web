/**
 * Concept demo sites (Phase 5). Fictional brands built by TMX to show what a
 * finished website can look like – never presented as client work.
 *
 *   /demo/de/<slug>   German
 *   /demo/en/<slug>   English
 *
 * Outside the next-intl [locale] tree (own root layout, no TMX header/footer,
 * fixed TMX concept bar instead) and always noindex.
 * Names only here (no React) so keystatic.config.ts can import the list.
 */
export const DEMO_SLUGS = ['nordwind', 'feldgruen', 'lindenhof', 'kernwerk', 'volta'] as const;
export type DemoSlug = (typeof DEMO_SLUGS)[number];
export const DEMO_LANGS = ['de', 'en'] as const;
export type DemoLang = (typeof DEMO_LANGS)[number];

export interface DemoMeta {
  /** Fictional brand name. */
  brand: string;
  /** Service slug pre-selected on the contact form from the demo's CTA. */
  service: string;
  /** Browser tab title suffix / short description per language. */
  kind: Record<DemoLang, string>;
}

export const DEMOS: Record<DemoSlug, DemoMeta> = {
  nordwind: {
    brand: 'Nordwind Kaffeerösterei',
    service: 'webentwicklung-webdesign',
    kind: { de: 'Website für ein Café mit Rösterei', en: 'Website for a café & roastery' },
  },
  feldgruen: {
    brand: 'Feldgrün',
    service: 'e-commerce-shops',
    kind: { de: 'Onlineshop für Pflanzen', en: 'Online shop for plants' },
  },
  lindenhof: {
    brand: 'Physio Lindenhof',
    service: 'webentwicklung-webdesign',
    kind: { de: 'Website mit Online-Terminbuchung für eine Praxis', en: 'Practice website with online booking' },
  },
  kernwerk: {
    brand: 'Kernwerk Immobilien',
    service: 'digitale-systeme-dashboards',
    kind: { de: 'Immobilien-Website mit Suche und Rechner', en: 'Real-estate website with search and calculator' },
  },
  volta: {
    brand: 'VOLTA',
    service: 'webentwicklung-webdesign',
    kind: { de: '3D-Produktseite für ein E-Bike', en: '3D product page for an e-bike' },
  },
};

export const isDemoSlug = (v: unknown): v is DemoSlug =>
  typeof v === 'string' && (DEMO_SLUGS as readonly string[]).includes(v);
export const isDemoLang = (v: unknown): v is DemoLang =>
  typeof v === 'string' && (DEMO_LANGS as readonly string[]).includes(v);

/** Public path of a demo. */
export const demoPath = (lang: DemoLang, slug: DemoSlug) => `/demo/${lang}/${slug}`;

/** TMX site links from inside a demo (localized pathnames, see i18n/routing.ts). */
export const TMX_LINKS: Record<DemoLang, { portfolio: string; impressum: string; datenschutz: string; contact: string }> = {
  de: { portfolio: '/portfolio', impressum: '/impressum', datenschutz: '/datenschutz', contact: '/kontakt' },
  en: { portfolio: '/en/portfolio', impressum: '/en/legal-notice', datenschutz: '/en/privacy-policy', contact: '/en/contact' },
};
