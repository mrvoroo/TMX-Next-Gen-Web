/**
 * /leistungen/[pillar]  (EN: /services/[pillar])  —  Pillar page
 *
 * Server Component, static. One page per pillar with a full section per
 * visible service. Texts: Keystatic singleton "pillarPages" + the "services"
 * collection. A pillar without visible services is not generated and
 * renders a static 404. Lives in (site) so Lenis/ScrollTrigger run.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { localizedMetadata, resolveLocale } from '@/lib/seo';
import { getPillarPage, getVisiblePillarKeys } from '@/lib/content';
import {
  PILLAR_PATHNAME,
  PILLARS,
  pillarBySlug,
  type PillarConfig,
} from '@/config/pillars';
import { COMPANY_BRAND } from '@/config/company';
import { PillarReveal } from '@/components/sections/pillar/PillarReveal';
import { PillarServiceSection } from '@/components/sections/pillar/PillarServiceSection';

/** Only the slugs returned by generateStaticParams exist; anything else is a 404. */
export const dynamicParams = false;

export async function generateStaticParams() {
  const keys = await getVisiblePillarKeys();
  return routing.locales.flatMap((locale) =>
    PILLARS.filter((p) => keys.includes(p.key)).map((p) => ({
      locale,
      pillar: p.slugs[locale],
    })),
  );
}

/** Localized slug of the same pillar for each locale (canonical + hreflang). */
const slugParams = (pillar: PillarConfig) => (l: 'de' | 'en') => ({
  pillar: pillar.slugs[l],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; pillar: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, pillar: slug } = await params;
  const locale = resolveLocale(rawLocale);
  const pillar = pillarBySlug(locale, slug);
  if (!pillar) return {};
  const page = await getPillarPage(locale, pillar.key);
  if (!page) return {};

  return localizedMetadata({
    locale,
    href: PILLAR_PATHNAME,
    params: slugParams(pillar),
    title: page.metaTitle || `${page.heroTitle} – ${COMPANY_BRAND}`,
    description: page.metaDescription || page.heroSub || undefined,
  });
}

export default async function PillarPage({
  params,
}: {
  params: Promise<{ locale: string; pillar: string }>;
}) {
  const { locale: rawLocale, pillar: slug } = await params;
  setRequestLocale(rawLocale);
  const locale = resolveLocale(rawLocale);

  const pillar = pillarBySlug(locale, slug);
  if (!pillar) notFound();
  const page = await getPillarPage(locale, pillar.key);
  if (!page) notFound();

  return (
    <PillarReveal>
      <header className="relative overflow-hidden bg-[#050508] pb-12 pt-32 sm:pb-16 sm:pt-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[40rem] max-w-full -translate-x-1/2 rounded-full bg-violet-600/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <h1
            data-reveal
            className="max-w-4xl text-4xl font-black tracking-tight [hyphens:auto] [overflow-wrap:anywhere] sm:text-5xl lg:text-6xl"
          >
            {page.heroTitle.split(' ').map((word, i, arr) =>
              i === arr.length - 1 ? (
                <span key={i} className="gradient-text">
                  {word}
                </span>
              ) : (
                <span key={i} className="text-white">
                  {word}{' '}
                </span>
              ),
            )}
          </h1>
          {page.heroSub ? (
            <p
              data-reveal
              className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg"
            >
              {page.heroSub}
            </p>
          ) : null}
        </div>
      </header>

      {page.services.map((service, i) => (
        <PillarServiceSection key={service.slug} service={service} page={page} index={i} />
      ))}
    </PillarReveal>
  );
}
