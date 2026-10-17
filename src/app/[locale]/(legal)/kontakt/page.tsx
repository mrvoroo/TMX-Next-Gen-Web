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
import { getCompany, getContactPage } from '@/lib/content';
import { ContactForm } from './ContactForm';

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

  const [c, company] = await Promise.all([getContactPage(locale), getCompany()]);
  if (!c || !company) return null;

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
        texts={{
          fieldName: c.fieldName,
          fieldEmail: c.fieldEmail,
          fieldService: c.fieldService,
          serviceDefault: c.serviceDefault,
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
