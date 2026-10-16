/**
 * /datenschutz  —  Datenschutzerklärung / Privacy Policy
 *
 * Server Component, static. Text comes from content/legal/datenschutz.json
 * (Keystatic singleton "legalDatenschutz", one block per locale, legally
 * binding — do not rephrase). Company values come from
 * content/settings/company.json. Only the current locale is rendered.
 *
 * Placeholders in the texts use {{key}}. Any literal "[[...]]" text is an open
 * to-do and renders visibly as-is.
 */

import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { localizedMetadata, resolveLocale } from '@/lib/seo';
import { getCompany, getDatenschutz } from '@/lib/content';

type Company = NonNullable<Awaited<ReturnType<typeof getCompany>>>;

/** Section positions (0-based) with special rendering. Order is part of the legal text. */
const SOCIAL_SECTION_INDEX = 7; // section 8: only if company.hasSocialProfiles
const OBJECTION_SECTION_INDEX = 10; // section 11: highlighted box

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'meta' });
  const datenschutz = await getDatenschutz();

  return {
    ...localizedMetadata({
      locale,
      href: '/datenschutz',
      title: t('datenschutzTitle'),
      description: datenschutz?.[locale].metaDescription,
    }),
    robots: { index: false, follow: false },
  };
}

function fill(text: string, company: Company): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    const value = (company as Record<string, unknown>)[key];
    return typeof value === 'string' ? value : match;
  });
}

function Body({ text }: { text: string }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-white/70">
      {text
        .split('\n')
        .filter((line) => line.trim() !== '')
        .map((line, i) => (
          <p key={i}>{line}</p>
        ))}
    </div>
  );
}

export default async function DatenschutzPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  setRequestLocale(rawLocale);
  const locale = resolveLocale(rawLocale);

  const [datenschutz, company] = await Promise.all([
    getDatenschutz(),
    getCompany(),
  ]);
  if (!datenschutz || !company) return null;

  const c = datenschutz[locale];

  const visible = c.sections
    .map((section, index) => ({ section, index }))
    .filter(
      ({ index }) =>
        index !== SOCIAL_SECTION_INDEX || company.hasSocialProfiles,
    );

  return (
    <article className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
      {locale === 'en' && (
        <p className="mb-8 text-sm italic text-white/50">
          {datenschutz.en.disclaimer}
        </p>
      )}

      <header className="mb-12">
        <h1 className="text-4xl font-black text-white sm:text-5xl">{c.title}</h1>
        <p className="mt-3 text-white/50 text-sm">
          {fill(c.lastUpdatedLine, company)}
        </p>
      </header>

      {visible.map(({ section, index }, position) => {
        const isObjection = index === OBJECTION_SECTION_INDEX;
        return (
          <section
            key={index}
            className={
              isObjection
                ? 'mb-10 rounded-xl border border-violet-400/50 bg-violet-500/10 p-6'
                : 'mb-10'
            }
          >
            <h2 className="mb-3 text-xl font-bold text-white">
              {position + 1}. {section.title}
            </h2>
            <Body text={fill(section.body, company)} />
          </section>
        );
      })}
    </article>
  );
}
