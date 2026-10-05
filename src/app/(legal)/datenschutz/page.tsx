/**
 * /datenschutz  —  Datenschutzerklärung / Privacy Policy
 *
 * Server Component — purely static, no JS bundle overhead.
 * All company-specific data comes from src/config/company.ts.
 *
 * DE is primary; EN follows after a separator.
 */

import type { Metadata } from 'next';
import {
  COMPANY_FULL_NAME,
  COMPANY_STREET,
  COMPANY_CITY,
  COMPANY_EMAIL,
  COMPANY_WEBSITE,
  COMPANY_DPO_NAME,
  COMPANY_DPO_EMAIL,
} from '@/config/company';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung – TMX',
  description: 'Datenschutzerklärung und Informationen zur Datenverarbeitung bei TMX.',
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
      <div className="space-y-3 text-sm leading-relaxed text-white/70">
        {children}
      </div>
    </section>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function DatenschutzPage() {
  return (
    <article className="mx-auto max-w-4xl px-5 py-16 sm:px-8">

      {/* ── DEUTSCH ────────────────────────────────────────────────────── */}
      <header className="mb-12">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-violet-400">
          Rechtliches
        </p>
        <h1 className="text-4xl font-black text-white sm:text-5xl">
          Datenschutzerklärung
        </h1>
        <p className="mt-3 text-white/50 text-sm">
          Zuletzt aktualisiert: Oktober 2025
        </p>
      </header>

      <Section id="verantwortlicher" title="1. Verantwortlicher">
        <p>Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO):</p>
        <p>
          {COMPANY_FULL_NAME}<br />
          {COMPANY_STREET}<br />
          {COMPANY_CITY}
        </p>
        <p>
          E-Mail:{' '}
          <a href={`mailto:${COMPANY_EMAIL}`} className="hover:text-white transition-colors">
            {COMPANY_EMAIL}
          </a>
        </p>
        <p>
          Website:{' '}
          <a href={COMPANY_WEBSITE} className="hover:text-white transition-colors">
            {COMPANY_WEBSITE}
          </a>
        </p>
      </Section>

      {COMPANY_DPO_NAME && (
        <Section id="datenschutzbeauftragter" title="2. Datenschutzbeauftragter">
          <p>
            Unser Datenschutzbeauftragter ist:{' '}
            <strong className="text-white">{COMPANY_DPO_NAME}</strong>
          </p>
          <p>
            Sie können unseren Datenschutzbeauftragten unter folgender E-Mail-Adresse
            kontaktieren:{' '}
            <a href={`mailto:${COMPANY_DPO_EMAIL}`} className="hover:text-white transition-colors">
              {COMPANY_DPO_EMAIL}
            </a>
          </p>
        </Section>
      )}

      <Section id="datenerhebung" title="2. Erhebung und Speicherung personenbezogener Daten">
        <p>
          Wenn Sie unsere Website besuchen, werden automatisch Informationen allgemeiner
          Natur erfasst. Diese Informationen (Server-Logfiles) beinhalten etwa die Art des
          Webbrowsers, das verwendete Betriebssystem, den Domainnamen Ihres
          Internet-Service-Providers, Ihre IP-Adresse und ähnliches.
        </p>
        <p>
          Dies dient insbesondere der Sicherstellung eines problemlosen Verbindungsaufbaus der
          Website, der Gewährleistung einer reibungslosen Nutzung unserer Website sowie der
          Auswertung der Systemsicherheit und -stabilität und zu weiteren administrativen
          Zwecken.
        </p>
        <p>
          Wir verwenden Ihre persönlichen Daten nicht, um Rückschlüsse auf Ihre Person zu
          ziehen. Informationen dieser Art werden von uns ggf. statistisch ausgewertet, um
          unseren Internetauftritt und die dahinterstehende Technik zu optimieren.
        </p>
      </Section>

      <Section id="kontaktformular" title="3. Kontaktformular">
        <p>
          Wenn Sie uns über unser Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben
          aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks
          Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
          Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
        </p>
        <p>
          Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO,
          sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur
          Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen
          beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven
          Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf
          Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), sofern diese abgefragt wurde.
        </p>
        <p>
          Die von Ihnen im Kontaktformular eingegebenen Daten verbleiben bei uns, bis Sie uns
          zur Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck
          für die Datenspeicherung entfällt (z. B. nach abgeschlossener Bearbeitung Ihrer
          Anfrage). Zwingende gesetzliche Bestimmungen – insbesondere Aufbewahrungsfristen –
          bleiben unberührt.
        </p>
      </Section>

      <Section id="cookies" title="4. Cookies">
        <p>
          Unsere Website verwendet Cookies. Dabei handelt es sich um kleine Dateien, die Ihr
          Browser automatisch erstellt und die auf Ihrem Gerät gespeichert werden, wenn Sie
          unsere Seite besuchen.
        </p>
        <p>
          Cookies richten auf Ihrem Endgerät keinen Schaden an, enthalten keine Viren,
          Trojaner oder sonstige Schadsoftware. In dem Cookie werden Informationen abgelegt,
          die sich jeweils im Zusammenhang mit dem spezifisch eingesetzten Endgerät ergeben.
          Dies bedeutet jedoch nicht, dass wir dadurch unmittelbar Kenntnis von Ihrer
          Identität erhalten.
        </p>
        <p>
          Wir setzen ausschließlich technisch notwendige Cookies ein, die für den Betrieb der
          Website erforderlich sind (z. B. zur Speicherung Ihrer Sprachpräferenz). Der Einsatz
          dieser Cookies erfolgt auf der Rechtsgrundlage des Art. 6 Abs. 1 lit. f DSGVO
          (berechtigtes Interesse).
        </p>
      </Section>

      <Section id="rechte" title="5. Ihre Rechte als betroffene Person">
        <p>Sie haben gegenüber uns folgende Rechte hinsichtlich Ihrer personenbezogenen Daten:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
          <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
          <li>Recht auf Löschung (Art. 17 DSGVO)</li>
          <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Recht auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
          <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
        </ul>
        <p>
          Zur Ausübung dieser Rechte wenden Sie sich bitte an:{' '}
          <a href={`mailto:${COMPANY_EMAIL}`} className="hover:text-white transition-colors">
            {COMPANY_EMAIL}
          </a>
        </p>
        <p>
          Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die
          Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren.
        </p>
      </Section>

      <Section id="datensicherheit" title="6. Datensicherheit">
        <p>
          Wir verwenden innerhalb des Website-Besuchs das verbreitete SSL- bzw.
          TLS-Verfahren (Secure Socket Layer / Transport Layer Security), erkennbar an dem
          Schloss-Symbol in der Adressleiste Ihres Browsers. Eine SSL- bzw.
          TLS-verschlüsselte Verbindung ist, wenn das Schloss-Symbol geschlossen angezeigt
          wird.
        </p>
        <p>
          Mit Aktivierung der SSL- bzw. TLS-Verschlüsselung können die Daten, die Sie an uns
          übermitteln, nicht von Dritten mitgelesen werden.
        </p>
      </Section>

      <Section id="aktualitaet" title="7. Aktualität und Änderung dieser Datenschutzerklärung">
        <p>
          Diese Datenschutzerklärung ist aktuell gültig. Durch die Weiterentwicklung unserer
          Website und Angebote darüber oder aufgrund geänderter gesetzlicher beziehungsweise
          behördlicher Vorgaben kann es notwendig werden, diese Datenschutzerklärung zu
          ändern. Die jeweils aktuelle Datenschutzerklärung kann jederzeit auf dieser Seite
          abgerufen und ausgedruckt werden.
        </p>
      </Section>

      {/* ── Separator ──────────────────────────────────────────────────── */}
      <div className="my-16 h-px bg-white/10" />

      {/* ── ENGLISH ────────────────────────────────────────────────────── */}
      <header className="mb-12">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-cyan-400">
          Legal
        </p>
        <h2 className="text-3xl font-black text-white sm:text-4xl">Privacy Policy</h2>
        <p className="mt-3 text-white/50 text-sm">Last updated: October 2025</p>
      </header>

      <Section id="controller-en" title="1. Controller">
        <p>
          The controller within the meaning of the General Data Protection Regulation (GDPR)
          is:
        </p>
        <p>
          {COMPANY_FULL_NAME}<br />
          {COMPANY_STREET}<br />
          {COMPANY_CITY}
        </p>
        <p>
          Email:{' '}
          <a href={`mailto:${COMPANY_EMAIL}`} className="hover:text-white transition-colors">
            {COMPANY_EMAIL}
          </a>
        </p>
      </Section>

      {COMPANY_DPO_NAME && (
        <Section id="dpo-en" title="2. Data Protection Officer">
          <p>
            Our Data Protection Officer is:{' '}
            <strong className="text-white">{COMPANY_DPO_NAME}</strong>
          </p>
          <p>
            You can contact our Data Protection Officer at:{' '}
            <a href={`mailto:${COMPANY_DPO_EMAIL}`} className="hover:text-white transition-colors">
              {COMPANY_DPO_EMAIL}
            </a>
          </p>
        </Section>
      )}

      <Section id="data-collection-en" title="2. Data Collection and Storage">
        <p>
          When you visit our website, general information is automatically collected. This
          information (server log files) includes the type of web browser, the operating
          system used, the domain name of your internet service provider, your IP address,
          and similar data.
        </p>
        <p>
          This serves in particular to ensure a smooth connection to the website, to ensure
          smooth use of our website, to evaluate system security and stability, and for
          other administrative purposes.
        </p>
        <p>
          We do not use your personal data to draw conclusions about you personally.
          Information of this nature may be statistically evaluated by us to optimise our
          website and the technology behind it.
        </p>
      </Section>

      <Section id="contact-form-en" title="3. Contact Form">
        <p>
          If you send us enquiries via our contact form, your details from the enquiry form,
          including the contact details you provided there, will be stored by us for the
          purpose of processing the enquiry and in the event of follow-up questions. We do
          not pass on this data without your consent.
        </p>
        <p>
          The processing of this data is based on Art. 6 Para. 1 lit. b GDPR if your
          enquiry is related to the fulfilment of a contract or is necessary for the
          implementation of pre-contractual measures. In all other cases, the processing is
          based on our legitimate interest in the effective processing of enquiries directed
          at us (Art. 6 Para. 1 lit. f GDPR) or on your consent (Art. 6 Para. 1 lit. a
          GDPR) if this was requested.
        </p>
        <p>
          The data you enter in the contact form will remain with us until you request us to
          delete it, revoke your consent to storage, or the purpose for storing the data no
          longer applies. Mandatory statutory provisions — in particular retention periods —
          remain unaffected.
        </p>
      </Section>

      <Section id="cookies-en" title="4. Cookies">
        <p>
          Our website uses cookies. These are small files that your browser automatically
          creates and that are stored on your device when you visit our site.
        </p>
        <p>
          Cookies do not damage your device and do not contain viruses, Trojans or other
          malware. The cookie stores information that arises in connection with the specific
          device used. This does not mean, however, that we gain direct knowledge of your
          identity as a result.
        </p>
        <p>
          We use only technically necessary cookies that are required for the operation of
          the website (e.g. to store your language preference). The use of these cookies is
          based on the legal basis of Art. 6 Para. 1 lit. f GDPR (legitimate interest).
        </p>
      </Section>

      <Section id="rights-en" title="5. Your Rights as a Data Subject">
        <p>
          You have the following rights with regard to your personal data:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Right of access (Art. 15 GDPR)</li>
          <li>Right to rectification (Art. 16 GDPR)</li>
          <li>Right to erasure (Art. 17 GDPR)</li>
          <li>Right to restriction of processing (Art. 18 GDPR)</li>
          <li>Right to object to processing (Art. 21 GDPR)</li>
          <li>Right to data portability (Art. 20 GDPR)</li>
        </ul>
        <p>
          To exercise these rights, please contact:{' '}
          <a href={`mailto:${COMPANY_EMAIL}`} className="hover:text-white transition-colors">
            {COMPANY_EMAIL}
          </a>
        </p>
        <p>
          You also have the right to lodge a complaint with a data protection supervisory
          authority regarding the processing of your personal data by us.
        </p>
      </Section>

      <Section id="security-en" title="6. Data Security">
        <p>
          We use SSL or TLS encryption (Secure Socket Layer / Transport Layer Security)
          within the website visit, recognisable by the padlock symbol in your browser&apos;s
          address bar. When SSL or TLS encryption is activated, the data you transmit to us
          cannot be read by third parties.
        </p>
      </Section>

      <Section id="updates-en" title="7. Updates to this Privacy Policy">
        <p>
          This privacy policy is currently valid. Due to the further development of our
          website and offers or due to changed legal or regulatory requirements, it may
          become necessary to change this privacy policy. The current privacy policy can
          always be accessed and printed on this page.
        </p>
      </Section>

    </article>
  );
}
