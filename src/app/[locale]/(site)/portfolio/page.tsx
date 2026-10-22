/**
 * /portfolio  —  Portfolio
 *
 * Server Component, static. Texts come from the Keystatic singleton
 * "portfolioPage" (content/pages/portfolio.json), projects from the "projects"
 * collection (shown = visible AND clientPermission). With no shown project the
 * page is a static 404. Lives in the (site) group so Lenis/ScrollTrigger run.
 *
 * PortfolioStage renders hero → projects → CTA: on desktop one page-level
 * crystal/corridor canvas behind the server-rendered hero text, the 3D
 * corridor and the CTA outro; otherwise hero, vertical cards and CTA.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { localizedMetadata, resolveLocale } from '@/lib/seo';
import { getPortfolioPage } from '@/lib/content';
import { PortfolioStage } from '@/components/sections/PortfolioStage';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const page = await getPortfolioPage(locale);
  if (!page) return {};

  return localizedMetadata({
    locale,
    href: '/portfolio',
    title: page.metaTitle,
    description: page.metaDescription,
  });
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  setRequestLocale(rawLocale);
  const locale = resolveLocale(rawLocale);

  const page = await getPortfolioPage(locale);
  if (!page) notFound();

  const heroText = (
    <>
      <p
        data-hero-text
        className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-violet-400/70"
      >
        {page.eyebrow}
      </p>
      <h1
        id="portfolio-heading"
        data-hero-text
        className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl"
      >
        {page.heading.split(' ').map((word, i, arr) =>
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
      <p
        data-hero-text
        className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg"
      >
        {page.sub}
      </p>
    </>
  );

  return <PortfolioStage data={page} heroText={heroText} />;
}
