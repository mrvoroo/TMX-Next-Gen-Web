/**
 * /kontakt  —  Kontakt / Contact
 *
 * Server Component, static. Text comes from content/pages/contact.json
 * (Keystatic singleton "contactPage", every field stored as { en, de }). Company values
 * come from content/settings/company.json. Only the current locale is
 * rendered; the interactive form is the small client component ContactForm.
 *
 * "[[PENDING]]" company values render visibly as-is.
 */

import { setRequestLocale } from 'next-intl/server';
import { resolveLocale } from '@/lib/seo';
import { getCompany, getContactPage, reader } from '@/lib/content';
import { pick, type Locale } from '@/lib/localized';
import { ContactForm, type ContactServiceGroup } from './ContactForm';

/** Pillar order = order on the home page: collection pillar value → singleton key. */
const PILLARS = [
  { pillar: 'entwicklung', key: 'dev' },
  { pillar: 'ki', key: 'ai' },
  { pillar: 'digitales-marketing', key: 'marketing' },
  { pillar: 'it-beratung', key: 'it' },
] as const;

/** Visible services grouped by pillar. Pillars without visible services are dropped. */
async function getServiceGroups(locale: Locale): Promise<ContactServiceGroup[]> {
  const [section, entries] = await Promise.all([
    reader.singletons.servicesSection.read(),
    reader.collections.services.all(),
  ]);
  if (!section) return [];

  return PILLARS.map(({ pillar, key }) => ({
    id: pillar,
    title: pick(section[key].title, locale),
    items: entries
      .filter((e) => e.entry.pillar === pillar && e.entry.visible)
      .sort(
        (a, b) =>
          (a.entry.order ?? 0) - (b.entry.order ?? 0) ||
          a.slug.localeCompare(b.slug),
      )
      .map((e) => ({
        slug: e.slug,
        label: pick(e.entry.name, locale, true),
        nameDe: e.entry.name.de,
      })),
  })).filter((group) => group.items.length > 0);
}

const isPending = (value: string) => value.startsWith('[[');

function ContactValue({
  value,
  scheme,
}: {
  value: string;
  scheme: 'tel' | 'mailto';
}) {
  if (isPending(value)) return <>{value}</>;
  const target = scheme === 'tel' ? value.replace(/\s+/g, '') : value;
  return (
    <a href={`${scheme}:${target}`} className="transition-colors hover:text-white">
      {value}
    </a>
  );
}

export default async function KontaktPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  setRequestLocale(rawLocale);
  const locale = resolveLocale(rawLocale);

  const [c, company, cDe, groups] = await Promise.all([
    getContactPage(locale),
    getCompany(),
    getContactPage('de'),
    getServiceGroups(locale),
  ]);
  if (!c || !company || !cDe) return null;

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-white sm:text-5xl">{c.title}</h1>
        <p className="mt-3 text-white/60">{c.intro}</p>
      </header>

      <dl className="mb-10 grid gap-6 text-sm text-white/70 sm:grid-cols-3">
        <div>
          <dt className="mb-1 text-xs font-semibold uppercase tracking-widest text-violet-400">
            {c.labelEmail}
          </dt>
          <dd className="break-words">
            <ContactValue value={company.email} scheme="mailto" />
          </dd>
        </div>
        <div>
          <dt className="mb-1 text-xs font-semibold uppercase tracking-widest text-violet-400">
            {c.labelPhone}
          </dt>
          <dd>
            <ContactValue value={company.phone} scheme="tel" />
          </dd>
        </div>
        <div>
          <dt className="mb-1 text-xs font-semibold uppercase tracking-widest text-violet-400">
            {c.labelAddress}
          </dt>
          <dd>
            <span className="block">{company.street}</span>
            <span className="block">
              {company.zip} {company.city}
            </span>
          </dd>
        </div>
      </dl>

      <p className="mb-6 text-sm text-white/50">{c.requiredNote}</p>

      <ContactForm
        locale={locale}
        groups={groups}
        generalNameDe={cDe.serviceGeneral}
        texts={{
          fieldName: c.fieldName,
          fieldEmail: c.fieldEmail,
          fieldService: c.fieldService,
          serviceGeneral: c.serviceGeneral,
          fieldMessage: c.fieldMessage,
          checkbox: c.checkbox,
          privacyLinkText: c.privacyLinkText,
          hint: c.hint,
          button: c.button,
          sending: c.sending,
          success: c.success,
          error: c.error.replaceAll('{{email}}', company.email),
          valRequired: c.valRequired,
          valEmail: c.valEmail,
          valCheckbox: c.valCheckbox,
        }}
      />
    </div>
  );
}
