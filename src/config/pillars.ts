/**
 * The four service pillars: collection value (`services.pillar`), the key used
 * in the Keystatic singletons (servicesSection / pillarPages) and the
 * localized URL slug of the pillar page.
 *
 * Client-safe (no server imports).
 */

export type PillarKey = 'entwicklung' | 'ki' | 'digitales-marketing' | 'it-beratung';
export type PillarSection = 'dev' | 'ai' | 'marketing' | 'it';
type PillarLocale = 'de' | 'en';

export interface PillarConfig {
  /** Value of `services.pillar` in the collection. */
  key: PillarKey;
  /** Key in the singletons "servicesSection" and "pillarPages". */
  section: PillarSection;
  /** URL slug per locale. */
  slugs: Record<PillarLocale, string>;
}

/** Order = order on the home page. */
export const PILLARS: readonly PillarConfig[] = [
  { key: 'entwicklung', section: 'dev', slugs: { de: 'entwicklung', en: 'development' } },
  { key: 'ki', section: 'ai', slugs: { de: 'ki', en: 'ai' } },
  {
    key: 'digitales-marketing',
    section: 'marketing',
    slugs: { de: 'digitales-marketing', en: 'digital-marketing' },
  },
  { key: 'it-beratung', section: 'it', slugs: { de: 'it-beratung', en: 'it-consulting' } },
];

/** Internal (German) pathname template of the pillar pages. */
export const PILLAR_PATHNAME = '/leistungen/[pillar]' as const;

export function pillarBySlug(locale: PillarLocale, slug: string): PillarConfig | null {
  return PILLARS.find((p) => p.slugs[locale] === slug) ?? null;
}

export function pillarByKey(key: string): PillarConfig | null {
  return PILLARS.find((p) => p.key === key) ?? null;
}

/** Slug of `key` in `locale`; null for an unknown key. */
export function pillarSlug(locale: PillarLocale, key: string): string | null {
  return pillarByKey(key)?.slugs[locale] ?? null;
}

/** Slug of the same pillar in the other language (for the language toggle). */
export function translatePillarSlug(
  slug: string,
  from: PillarLocale,
  to: PillarLocale,
): string | null {
  const pillar = pillarBySlug(from, slug);
  return pillar ? pillar.slugs[to] : null;
}
