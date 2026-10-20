/**
 * /portfolio  —  Portfolio
 *
 * Server Component, static. Texts come from the Keystatic singleton
 * "portfolioPage" (content/pages/portfolio.json), projects from the "projects"
 * collection (shown = visible AND clientPermission). With no shown project the
 * page is a static 404. Lives in the (site) group so Lenis/ScrollTrigger run.
 *
 * #portfolio-hero and #portfolio-showcase are the mount points for the 3D
 * layers added in the next steps.
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { localizedMetadata, resolveLocale } from '@/lib/seo';
import { getPortfolioPage } from '@/lib/content';
import { PortfolioSection } from '@/components/sections/PortfolioSection';

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

  return (
    <>
      <div id="portfolio-hero" className="relative bg-[#050508]">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-32 sm:px-8 sm:pb-16 sm:pt-40">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-violet-400/70">
            {page.eyebrow}
          </p>
          <h1
            id="portfolio-heading"
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
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
            {page.sub}
          </p>
        </div>
      </div>

      <div id="portfolio-showcase">
        <PortfolioSection data={page} />
      </div>

      <section className="relative bg-[#050508]">
        <div className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32">
          <div className="flex flex-col items-start gap-6 rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-12">
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              {page.ctaHeading}
            </h2>
            <Link
              href="/kontakt"
              className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-3.5 text-sm font-semibold text-white transition-opacity duration-300 hover:opacity-90"
            >
              {page.ctaButton}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
