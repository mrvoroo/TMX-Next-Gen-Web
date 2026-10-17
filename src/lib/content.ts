import 'server-only';
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';
import { pick, pickAll, type Locale } from './localized';

export const reader = createReader(process.cwd(), keystaticConfig);

export async function getCompany() {
  return reader.singletons.company.read();
}

export async function getImpressum(locale: Locale) {
  const data = await reader.singletons.legalImpressum.read();
  return data ? pickAll(data, locale) : null;
}

export async function getDatenschutz(locale: Locale) {
  const data = await reader.singletons.legalDatenschutz.read();
  return data ? pickAll(data, locale) : null;
}

export async function getConsentBanner(locale: Locale) {
  const data = await reader.singletons.consentBanner.read();
  return data ? pickAll(data, locale) : null;
}

/* ── Home · Services ─────────────────────────────────────────────────── */

export interface ServiceItemData {
  slug: string;
  name: string;
  icon: string;
}

export interface ServicePillarData {
  title: string;
  sub: string;
  items: ServiceItemData[];
}

export interface ServicesSectionData {
  heading: string;
  sub: string;
  dev: ServicePillarData;
  ai: ServicePillarData;
  marketing: ServicePillarData;
  it: ServicePillarData;
}

/**
 * Home services: singleton texts for `locale` + visible services of the
 * collection (sorted by order, then slug) grouped into the 4 pillars.
 * Returns plain, serialisable data for client components.
 */
export async function getServicesSection(
  locale: Locale,
): Promise<ServicesSectionData | null> {
  const [section, entries] = await Promise.all([
    reader.singletons.servicesSection.read(),
    reader.collections.services.all(),
  ]);
  if (!section) return null;

  const pillarOf = (pillar: string): ServiceItemData[] =>
    entries
      .filter((e) => e.entry.pillar === pillar && e.entry.visible)
      .sort(
        (a, b) =>
          (a.entry.order ?? 0) - (b.entry.order ?? 0) ||
          a.slug.localeCompare(b.slug),
      )
      .map((e) => ({
        slug: e.slug,
        // EN falls back to the German official name when EN is empty.
        name: pick(e.entry.name, locale, true),
        icon: e.entry.icon,
      }));

  const c = pickAll(section, locale);
  return {
    heading: c.heading,
    sub: c.sub,
    dev: { ...c.dev, items: pillarOf('entwicklung') },
    ai: { ...c.ai, items: pillarOf('ki') },
    marketing: { ...c.marketing, items: pillarOf('digitales-marketing') },
    it: { ...c.it, items: pillarOf('it-beratung') },
  };
}

export async function getContactPage() {
  return reader.singletons.contactPage.read();
}
