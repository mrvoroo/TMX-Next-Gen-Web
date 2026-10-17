/**
 * /impressum  —  Impressum (Legal Notice)
 *
 * Server Component, static. Text comes from content/legal/impressum.json
 * (Keystatic singleton "legalImpressum", one block per locale, legally
 * binding — do not rephrase). Company values come from
 * content/settings/company.json. Only the current locale is rendered.
 *
 * Placeholders in the texts use {{key}}; "[[PENDING]]" values render as-is.
 */

import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { localizedMetadata, resolveLocale } from '@/lib/seo';
import { getCompany, getImpressum } from '@/lib/content';

type Company = NonNullable<Awaited<ReturnType<typeof getCompany>>>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'meta' });
  const impressum = await getImpressum(locale);

  return {
    ...localizedMetadata({
      locale,
      href: '/impressum',
      title: t('impressumTitle'),
      description: impressum?.metaDescription,
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

const isFilled = (value: string | undefined) => !!value && value.trim() !== '';
const isPending = (value: string) => value.startsWith('[[');

function ContactValue({
  value,
  scheme,
}: {
  value: string;
  scheme: 'tel' | 'mailto';
}) {
  if (isPending(value)) return <>{value}</>;
  return (
    <a href={`${scheme}:${value}`} className="hover:text-white transition-colors">
      {value}
    </a>
  );
}

export default async function ImpressumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  setRequestLocale(rawLocale);
  const locale = resolveLocale(rawLocale);

  const [impressum, company] = await Promise.all([getImpressum(locale), getCompany()]);
  if (!impressum || !company) return null;

  const isEn = locale === 'en';
  const c = impressum;
  const f = (text: string) => fill(text, company);

  const phone = company.phone;
  const email = company.email;

  return (
    <article className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
      {isEn && (
        <p className="mb-8 text-sm italic text-white/50">{c.disclaimer}</p>
      )}

      <header className="mb-12">
        <h1 className="text-4xl font-black text-white sm:text-5xl">{c.title}</h1>
        <p className="mt-3 text-white/50 text-sm">{c.intro}</p>
      </header>

      <div className="space-y-6 text-sm leading-relaxed text-white/70">
        <div className="space-y-1">
          {isEn ? (
            <p>{f(c.addressBlock)}</p>
          ) : (
            f(c.addressBlock)
              .split('\n')
              .map((line, i) => <p key={i}>{line}</p>)
          )}
        </div>

        {isFilled(company.representative) && <p>{f(c.representedBy)}</p>}

        {isEn ? (
          <p>
            {c.contactHeading} — {c.phoneLabel}{' '}
            <ContactValue value={phone} scheme="tel" /> · {c.emailLabel}{' '}
            <ContactValue value={email} scheme="mailto" />
          </p>
        ) : (
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">{c.contactHeading}</h2>
            <p>
              {c.phoneLabel} <ContactValue value={phone} scheme="tel" />
            </p>
            <p>
              {c.emailLabel} <ContactValue value={email} scheme="mailto" />
            </p>
          </div>
        )}

        {isFilled(company.registerCourt) &&
          isFilled(company.registerNumber) && <p>{f(c.registerLine)}</p>}

        {isFilled(company.vatId) && <p>{f(c.vatLine)}</p>}

        {company.showMstvResponsible && <p>{f(c.mstvLine)}</p>}

        {company.showConsumerDispute && <p>{f(c.consumerDispute)}</p>}

        <p>{f(c.externalLinks)}</p>

        <p>{f(c.copyright)}</p>
      </div>
    </article>
  );
}
