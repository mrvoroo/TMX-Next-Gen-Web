/**
 * /impressum  —  Impressum (Legal Notice)
 *
 * Rendered as a Server Component (no "use client") — purely static content.
 * All company data comes from src/config/company.ts.
 * Search that file for [[PENDING]] to find what still needs real values.
 *
 * DE content is primary; EN is shown below under a separator.
 */

import type { Metadata } from 'next';
import {
  COMPANY_FULL_NAME,
  COMPANY_STREET,
  COMPANY_CITY,
  COMPANY_COUNTRY,
  COMPANY_COUNTRY_EN,
  COMPANY_EMAIL,
  COMPANY_PHONE,
  COMPANY_WEBSITE,
  COMPANY_REGISTER_ENTRY,
  COMPANY_REGISTER_COURT,
  COMPANY_MANAGING_DIRECTOR,
  COMPANY_VAT_ID,
  COMPANY_DPO_NAME,
  COMPANY_DPO_EMAIL,
} from '@/config/company';

export const metadata: Metadata = {
  title: 'Impressum – TMX',
  description: 'Impressum und rechtliche Angaben der TMX Digitalagentur.',
  robots: { index: false, follow: false },
};

/* ── Reusable prose section ─────────────────────────────────────────────── */
function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-10">
      <h2 className="mb-3 text-xl font-bold text-white">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-white/70">
        {children}
      </div>
    </section>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function ImpressumPage() {
  return (
    <article className="mx-auto max-w-4xl px-5 py-16 sm:px-8">

      {/* ── GERMAN ─────────────────────────────────────────────────────── */}
      <header className="mb-12">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-violet-400">
          Rechtliches
        </p>
        <h1 className="text-4xl font-black text-white sm:text-5xl">Impressum</h1>
        <p className="mt-3 text-white/50 text-sm">
          Angaben gemäß § 5 TMG
        </p>
      </header>

      <Section id="anbieter" title="Anbieter">
        <p>{COMPANY_FULL_NAME}</p>
        <p>{COMPANY_STREET}</p>
        <p>{COMPANY_CITY}</p>
        <p>{COMPANY_COUNTRY}</p>
      </Section>

      <Section id="kontakt" title="Kontakt">
        <p>
          <span className="text-white/40">Telefon:</span>{' '}
          <a href={`tel:${COMPANY_PHONE}`} className="hover:text-white transition-colors">
            {COMPANY_PHONE}
          </a>
        </p>
        <p>
          <span className="text-white/40">E-Mail:</span>{' '}
          <a href={`mailto:${COMPANY_EMAIL}`} className="hover:text-white transition-colors">
            {COMPANY_EMAIL}
          </a>
        </p>
        <p>
          <span className="text-white/40">Website:</span>{' '}
          <a href={COMPANY_WEBSITE} className="hover:text-white transition-colors">
            {COMPANY_WEBSITE}
          </a>
        </p>
      </Section>

      <Section id="register" title="Handelsregister">
        <p>
          <span className="text-white/40">Eingetragen im:</span>{' '}
          {COMPANY_REGISTER_COURT}
        </p>
        <p>
          <span className="text-white/40">Registernummer:</span>{' '}
          {COMPANY_REGISTER_ENTRY}
        </p>
      </Section>

      <Section id="geschaeftsfuehrung" title="Geschäftsführung">
        <p>{COMPANY_MANAGING_DIRECTOR}</p>
      </Section>

      <Section id="umsatzsteuer" title="Umsatzsteuer-Identifikationsnummer">
        <p>
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
        </p>
        <p>{COMPANY_VAT_ID}</p>
      </Section>

      {COMPANY_DPO_NAME && (
        <Section id="datenschutzbeauftragter" title="Datenschutzbeauftragter">
          <p>{COMPANY_DPO_NAME}</p>
          <p>
            <a href={`mailto:${COMPANY_DPO_EMAIL}`} className="hover:text-white transition-colors">
              {COMPANY_DPO_EMAIL}
            </a>
          </p>
        </Section>
      )}

      <Section id="haftung-inhalte" title="Haftung für Inhalte">
        <p>
          Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten
          nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
          Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
          Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
          Tätigkeit hinweisen.
        </p>
        <p>
          Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den
          allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch
          erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei
          Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend
          entfernen.
        </p>
      </Section>

      <Section id="haftung-links" title="Haftung für Links">
        <p>
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
          Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
          Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
          Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf
          mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
          Verlinkung nicht erkennbar.
        </p>
        <p>
          Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete
          Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
          Rechtsverletzungen werden wir derartige Links umgehend entfernen.
        </p>
      </Section>

      <Section id="urheberrecht" title="Urheberrecht">
        <p>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
          dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
          der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
          Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind
          nur für den privaten, nicht kommerziellen Gebrauch gestattet.
        </p>
        <p>
          Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die
          Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche
          gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden,
          bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen
          werden wir derartige Inhalte umgehend entfernen.
        </p>
      </Section>

      {/* ── Separator ──────────────────────────────────────────────────── */}
      <div className="my-16 h-px bg-white/10" />

      {/* ── ENGLISH ────────────────────────────────────────────────────── */}
      <header className="mb-12">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-cyan-400">
          Legal
        </p>
        <h2 className="text-3xl font-black text-white sm:text-4xl">Legal Notice</h2>
        <p className="mt-3 text-white/50 text-sm">
          Information pursuant to § 5 German Telemedia Act (TMG)
        </p>
      </header>

      <Section id="provider-en" title="Service Provider">
        <p>{COMPANY_FULL_NAME}</p>
        <p>{COMPANY_STREET}</p>
        <p>{COMPANY_CITY}</p>
        <p>{COMPANY_COUNTRY_EN}</p>
      </Section>

      <Section id="contact-en" title="Contact">
        <p>
          <span className="text-white/40">Phone:</span>{' '}
          <a href={`tel:${COMPANY_PHONE}`} className="hover:text-white transition-colors">
            {COMPANY_PHONE}
          </a>
        </p>
        <p>
          <span className="text-white/40">Email:</span>{' '}
          <a href={`mailto:${COMPANY_EMAIL}`} className="hover:text-white transition-colors">
            {COMPANY_EMAIL}
          </a>
        </p>
        <p>
          <span className="text-white/40">Website:</span>{' '}
          <a href={COMPANY_WEBSITE} className="hover:text-white transition-colors">
            {COMPANY_WEBSITE}
          </a>
        </p>
      </Section>

      <Section id="register-en" title="Commercial Register">
        <p>
          <span className="text-white/40">Registered at:</span>{' '}
          {COMPANY_REGISTER_COURT}
        </p>
        <p>
          <span className="text-white/40">Register number:</span>{' '}
          {COMPANY_REGISTER_ENTRY}
        </p>
      </Section>

      <Section id="management-en" title="Management">
        <p>{COMPANY_MANAGING_DIRECTOR}</p>
      </Section>

      <Section id="vat-en" title="VAT Identification Number">
        <p>
          VAT identification number pursuant to § 27 a German Value Added Tax Act:
        </p>
        <p>{COMPANY_VAT_ID}</p>
      </Section>

      {COMPANY_DPO_NAME && (
        <Section id="dpo-en" title="Data Protection Officer">
          <p>{COMPANY_DPO_NAME}</p>
          <p>
            <a href={`mailto:${COMPANY_DPO_EMAIL}`} className="hover:text-white transition-colors">
              {COMPANY_DPO_EMAIL}
            </a>
          </p>
        </Section>
      )}

      <Section id="liability-content-en" title="Liability for Content">
        <p>
          As a service provider we are responsible for our own content on these pages in
          accordance with general laws pursuant to § 7 Para. 1 TMG. However, pursuant to
          §§ 8 to 10 TMG, we are not obligated to monitor transmitted or stored third-party
          information or to investigate circumstances that indicate illegal activity.
        </p>
        <p>
          Obligations to remove or block the use of information in accordance with general
          laws remain unaffected. However, liability in this regard is only possible from the
          time of knowledge of a specific legal violation. Upon becoming aware of such legal
          violations, we will remove this content immediately.
        </p>
      </Section>

      <Section id="liability-links-en" title="Liability for Links">
        <p>
          Our website contains links to external third-party websites over whose content we
          have no control. Therefore, we cannot accept any liability for these external
          contents. The respective provider or operator of the pages is always responsible
          for the content of the linked pages. The linked pages were checked for possible
          legal violations at the time of linking. Illegal content was not apparent at the
          time of linking.
        </p>
        <p>
          However, permanent monitoring of the content of the linked pages is not reasonable
          without specific indications of a legal violation. Upon becoming aware of legal
          violations, we will remove such links immediately.
        </p>
      </Section>

      <Section id="copyright-en" title="Copyright">
        <p>
          The content and works on these pages created by the site operators are subject to
          German copyright law. The reproduction, processing, distribution and any kind of
          exploitation outside the limits of copyright law require the written consent of
          the respective author or creator. Downloads and copies of this site are only
          permitted for private, non-commercial use.
        </p>
        <p>
          Insofar as the content on this site was not created by the operator, the copyrights
          of third parties are respected. Should you nevertheless become aware of a copyright
          infringement, please inform us accordingly. Upon becoming aware of legal violations,
          we will remove such content immediately.
        </p>
      </Section>

    </article>
  );
}
