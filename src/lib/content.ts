import 'server-only';
import path from 'node:path';
import { cache } from 'react';
import sharp from 'sharp';
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';
import { PILLARS, type PillarKey } from '@/config/pillars';
import {
  isServiceExample,
  type ServiceExampleName,
} from '@/config/service-examples';
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

/* ── Pillar pages ────────────────────────────────────────────────────── */

export interface PillarServiceData {
  slug: string;
  /** Verbatim German name on DE; English name on EN (falls back to German). */
  name: string;
  icon: string;
  /** Empty string / empty arrays = block not rendered. */
  intro: string;
  benefits: string[];
  steps: string[];
  /** Interactive demo under the service; 'none' = not rendered. */
  example: ServiceExampleName;
}

export interface PillarPageData {
  key: PillarKey;
  heroTitle: string;
  /** Empty string = not rendered. */
  heroSub: string;
  metaTitle: string;
  metaDescription: string;
  ctaLabel: string;
  benefitsHeading: string;
  stepsHeading: string;
  exampleLabel: string;
  exampleNote: string;
  services: PillarServiceData[];
}

export interface PillarLinkData {
  key: PillarKey;
  /** Localized URL slug of the pillar page. */
  slug: string;
  title: string;
}

const nonEmpty = (values: string[]) => values.filter((v) => v.trim() !== '');

/** Visible services (by order, then slug) of the collection. */
const getVisibleServices = cache(async () => {
  const entries = await reader.collections.services.all();
  return entries
    .filter((e) => e.entry.visible)
    .sort(
      (a, b) =>
        (a.entry.order ?? 0) - (b.entry.order ?? 0) ||
        a.slug.localeCompare(b.slug),
    );
});

/** Pillars with at least one visible service (page + links exist only for these). */
export async function getVisiblePillarKeys(): Promise<PillarKey[]> {
  const visible = await getVisibleServices();
  return PILLARS.filter((p) => visible.some((e) => e.entry.pillar === p.key)).map(
    (p) => p.key,
  );
}

/** Links to every pillar page that has ≥1 visible service, for `locale`. */
export async function getPillarLinks(locale: Locale): Promise<PillarLinkData[]> {
  const [section, keys] = await Promise.all([
    reader.singletons.servicesSection.read(),
    getVisiblePillarKeys(),
  ]);
  if (!section) return [];
  return PILLARS.filter((p) => keys.includes(p.key)).map((p) => ({
    key: p.key,
    slug: p.slugs[locale],
    title: pick(section[p.section].title, locale),
  }));
}

/** Pillar page content for `locale`; null when the pillar has no visible service. */
export async function getPillarPage(
  locale: Locale,
  key: PillarKey,
): Promise<PillarPageData | null> {
  const pillar = PILLARS.find((p) => p.key === key);
  if (!pillar) return null;

  const [pages, section, visible] = await Promise.all([
    reader.singletons.pillarPages.read(),
    reader.singletons.servicesSection.read(),
    getVisibleServices(),
  ]);
  const services = visible.filter((e) => e.entry.pillar === key);
  if (!pages || !section || services.length === 0) return null;

  const c = pickAll(pages, locale);
  const own = c[pillar.section];
  const homeTitle = pick(section[pillar.section].title, locale);

  return {
    key,
    heroTitle: own.heroTitle.trim() || homeTitle,
    heroSub: own.heroSub.trim(),
    metaTitle: own.metaTitle.trim(),
    metaDescription: own.metaDescription.trim(),
    ctaLabel: c.ctaLabel,
    benefitsHeading: c.benefitsHeading.trim(),
    stepsHeading: c.stepsHeading.trim(),
    exampleLabel: c.exampleLabel.trim(),
    exampleNote: c.exampleNote.trim(),
    services: services.map(({ slug, entry }) => ({
      slug,
      name: pick(entry.name, locale, true),
      icon: entry.icon,
      intro: pick(entry.intro, locale).trim(),
      benefits: nonEmpty(entry.benefits.map((b) => pick(b, locale))),
      steps: nonEmpty(entry.steps.map((s) => pick(s, locale))),
      example: isServiceExample(entry.example) ? entry.example : 'none',
    })),
  };
}

/* ── Home · Hero ─────────────────────────────────────────────────────── */

export interface HeroSectionData {
  eyebrow: string;
  headlineLine1: string;
  headlineLine2: string;
  sub: string;
  ctaLabel: string;
  scrollLabel: string;
}

/** Hero texts for `locale`. */
export async function getHeroSection(
  locale: Locale,
): Promise<HeroSectionData | null> {
  const raw = await reader.singletons.heroSection.read();
  return raw ? pickAll(raw, locale) : null;
}

/* ── Home · About / How I work / Why TMX ─────────────────────────────── */

export interface AboutSectionData {
  heading: string;
  sub: string;
  paragraphs: string[];
  /** Empty string = not rendered. */
  personName: string;
  ctaLabel: string;
}

export interface ProcessStepData {
  title: string;
  text: string;
}

export interface ProcessSectionData {
  heading: string;
  sub: string;
  steps: ProcessStepData[];
}

export interface WhyUsCardData {
  title: string;
  text: string;
  icon: string;
  wide: boolean;
}

export interface WhyUsSectionData {
  heading: string;
  sub: string;
  cards: WhyUsCardData[];
}

/** About texts for `locale`; null when the section is hidden. */
export async function getAboutSection(
  locale: Locale,
): Promise<AboutSectionData | null> {
  const raw = await reader.singletons.aboutSection.read();
  if (!raw || !raw.visible) return null;
  const c = pickAll(raw, locale);
  return {
    heading: c.heading,
    sub: c.sub,
    paragraphs: c.paragraphs.filter((p) => p.trim() !== ''),
    personName: c.personName.trim(),
    ctaLabel: c.ctaLabel,
  };
}

/** Visible process steps for `locale`; null when hidden or no step is visible. */
export async function getProcessSection(
  locale: Locale,
): Promise<ProcessSectionData | null> {
  const raw = await reader.singletons.processSection.read();
  if (!raw || !raw.visible) return null;
  const c = pickAll(raw, locale);
  const steps = c.steps
    .filter((s) => s.visible)
    .map(({ title, text }) => ({ title, text }));
  if (steps.length === 0) return null;
  return { heading: c.heading, sub: c.sub, steps };
}

/** Visible "Why TMX" cards for `locale`; null when hidden or no card is visible. */
export async function getWhyUsSection(
  locale: Locale,
): Promise<WhyUsSectionData | null> {
  const raw = await reader.singletons.whyUsSection.read();
  if (!raw || !raw.visible) return null;
  const c = pickAll(raw, locale);
  const cards = c.cards
    .filter((card) => card.visible)
    .map(({ title, text, icon, size }) => ({
      title,
      text,
      icon,
      wide: size === 'wide',
    }));
  if (cards.length === 0) return null;
  return { heading: c.heading, sub: c.sub, cards };
}

/* ── Portfolio page ──────────────────────────────────────────────────── */

export interface PortfolioProjectData {
  slug: string;
  title: string;
  description: string;
  image: { src: string; width: number; height: number };
  imageAlt: string;
  url: string | null;
  techTags: string[];
  founder: boolean;
  year: number | null;
  accent: 'violet' | 'cyan' | 'mixed';
}

export interface PortfolioPageData {
  eyebrow: string;
  heading: string;
  sub: string;
  ctaHeading: string;
  ctaButton: string;
  linkLabel: string;
  founderBadge: string;
  metaTitle: string;
  metaDescription: string;
  projects: PortfolioProjectData[];
}

/** Projects that may be shown: visible AND client permission, by order. */
const getShownProjects = cache(async () => {
  const entries = await reader.collections.projects.all();
  return entries
    .filter((e) => e.entry.visible && e.entry.clientPermission && e.entry.image)
    .sort(
      (a, b) =>
        (a.entry.order ?? 0) - (b.entry.order ?? 0) ||
        a.slug.localeCompare(b.slug),
    );
});

/** True when at least one project is shown (drives section + nav link). */
export async function hasPortfolio(): Promise<boolean> {
  return (await getShownProjects()).length > 0;
}

async function imageSize(src: string) {
  try {
    const file = path.join(process.cwd(), 'public', src);
    const { width, height } = await sharp(file).metadata();
    if (width && height) return { src, width, height };
  } catch {
    /* fall through to the default 16:10 frame */
  }
  return { src, width: 1600, height: 1000 };
}

/** Portfolio page texts + shown projects for `locale`; null while none is shown. */
export async function getPortfolioPage(
  locale: Locale,
): Promise<PortfolioPageData | null> {
  const [section, shown] = await Promise.all([
    reader.singletons.portfolioPage.read(),
    getShownProjects(),
  ]);
  if (!section || shown.length === 0) return null;

  const c = pickAll(section, locale);
  const projects = await Promise.all(
    shown.map(async ({ slug, entry }): Promise<PortfolioProjectData> => ({
      slug,
      title: pick(entry.title, locale, true),
      description: pick(entry.description, locale, true),
      image: await imageSize(entry.image as string),
      imageAlt: pick(entry.imageAlt, locale, true),
      url: entry.url.trim().startsWith('https://') ? entry.url.trim() : null,
      techTags: entry.techTags.filter((tag) => tag.trim() !== ''),
      founder: entry.origin === 'founder',
      year: entry.year,
      accent: entry.accent,
    })),
  );
  return { ...c, projects };
}

export async function getContactPage(locale: Locale) {
  const data = await reader.singletons.contactPage.read();
  return data ? pickAll(data, locale) : null;
}
