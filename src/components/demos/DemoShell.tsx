/**
 * Frame around every concept demo: a fixed TMX bar on top (concept label,
 * language switch, Portfolio / Impressum / Datenschutz, CTA) and a TMX outro
 * at the end that turns the demo into an enquiry. Server component, plain
 * <a> links (the demo lives outside the next-intl tree).
 */
import type { ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { DEMOS, TMX_LINKS, demoPath, type DemoLang, type DemoSlug } from '@/config/demos';

const T = {
  de: {
    concept: 'Konzeptprojekt',
    conceptLong: 'Konzeptprojekt von TMX – fiktive Marke, keine echte Firma',
    portfolio: 'Portfolio',
    impressum: 'Impressum',
    datenschutz: 'Datenschutz',
    cta: 'So eine Website anfragen',
    otherLang: 'EN',
    otherLangLabel: 'EN – English version',
    outroEyebrow: 'Konzeptprojekt von TMX',
    outroTitle: 'Gefällt Ihnen, was Sie sehen?',
    outroText:
      'Diese Website habe ich als Konzept für eine fiktive Marke gebaut – um zu zeigen, was für Ihr Unternehmen möglich ist. Ich setze so etwas individuell für Sie um: schnell, für Smartphones optimiert und mit Blick auf die rechtlichen Anforderungen in Deutschland.',
    included: 'Was in dieser Demo steckt',
    outroCta: 'Projekt anfragen',
    outroBack: 'Weitere Projekte ansehen',
    disclaimer: 'Marke, Inhalte, Preise und Angebote sind frei erfunden. Es gibt keine echte Firma dahinter und nichts kann wirklich gekauft oder gebucht werden.',
  },
  en: {
    concept: 'Concept project',
    conceptLong: 'Concept project by TMX – fictional brand, not a real company',
    portfolio: 'Portfolio',
    impressum: 'Legal notice',
    datenschutz: 'Privacy',
    cta: 'Get a website like this',
    otherLang: 'DE',
    otherLangLabel: 'DE – Deutsche Version',
    outroEyebrow: 'Concept project by TMX',
    outroTitle: 'Like what you see?',
    outroText:
      'I built this website as a concept for a fictional brand – to show what is possible for your business. I build something like this tailored to you: fast, optimised for smartphones and with German legal requirements in mind.',
    included: 'What this demo includes',
    outroCta: 'Start a project',
    outroBack: 'See more projects',
    disclaimer: 'Brand, content, prices and offers are made up. There is no real company behind it and nothing can actually be bought or booked.',
  },
} as const;

export const DEMO_FEATURES: Record<DemoSlug, Record<DemoLang, string[]>> = {
  nordwind: {
    de: ['Speisekarte mit Kategorien', 'Live-Anzeige „Heute geöffnet“', 'Tischreservierung in wenigen Klicks', 'Anfahrt & Kontakt'],
    en: ['Menu with categories', 'Live “open today” status', 'Table booking in a few clicks', 'Directions & contact'],
  },
  feldgruen: {
    de: ['Filter & Sortierung', 'Warenkorb mit Versand-Fortschritt', 'Schnellansicht für Produkte', 'Für Smartphones optimiert'],
    en: ['Filters & sorting', 'Cart with free-shipping progress', 'Product quick view', 'Optimised for smartphones'],
  },
  lindenhof: {
    de: ['Online-Terminbuchung in 3 Schritten', 'Leistungen mit Dauer & Preis', 'Häufige Fragen', 'Ruhiges, barrierearmes Design'],
    en: ['Online booking in 3 steps', 'Treatments with duration & price', 'FAQ', 'Calm, accessible design'],
  },
  kernwerk: {
    de: ['Objektsuche mit Filtern', 'Finanzierungsrechner', 'Merkliste', 'Exposé-Anfrage'],
    en: ['Property search with filters', 'Mortgage calculator', 'Shortlist', 'Brochure request'],
  },
  volta: {
    de: ['Interaktives 3D-Modell', 'Farbkonfigurator in Echtzeit', 'Scroll-Animationen', 'Vorbestellung mit Modellwahl'],
    en: ['Interactive 3D model', 'Real-time colour configurator', 'Scroll animations', 'Pre-order with model choice'],
  },
};

export function DemoShell({ lang, slug, children }: { lang: DemoLang; slug: DemoSlug; children: ReactNode }) {
  const t = T[lang];
  const links = TMX_LINKS[lang];
  const other: DemoLang = lang === 'de' ? 'en' : 'de';
  const contact = `${links.contact}?service=${encodeURIComponent(DEMOS[slug].service)}`;

  return (
    <>
      <div
        data-demo-bar
        role="region"
        aria-label={t.conceptLong}
        className="fixed inset-x-0 top-0 z-[100] border-b border-white/10 bg-[#07070c]/95 text-white backdrop-blur-md"
      >
        <div className="mx-auto flex h-10 max-w-7xl items-center gap-3 px-3 text-[11px] sm:px-5 sm:text-xs">
          <a href={links.portfolio} className="flex shrink-0 items-center gap-1.5 font-black tracking-tight" aria-label={`TMX – ${t.portfolio}`}>
            <ArrowLeft size={13} aria-hidden="true" className="text-white/50" />
            <span className="gradient-text text-sm">TMX</span>
          </a>
          <span className="shrink-0 rounded-full border border-amber-300/40 bg-amber-300/10 px-2 py-0.5 font-semibold text-amber-200" title={t.conceptLong}>
            {t.concept}
          </span>
          <nav aria-label="TMX" className="ml-auto flex min-w-0 items-center gap-3 text-white/60 sm:gap-4">
            <a href={links.portfolio} className="hidden hover:text-white md:inline">
              {t.portfolio}
            </a>
            <a href={links.impressum} className="hover:text-white">
              {t.impressum}
            </a>
            <a href={links.datenschutz} className="hover:text-white">
              {t.datenschutz}
            </a>
            <a href={demoPath(other, slug)} hrefLang={other} lang={other} aria-label={t.otherLangLabel} className="font-semibold hover:text-white">
              {t.otherLang}
            </a>
            <a
              href={contact}
              className="hidden rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-3 py-1 font-semibold text-white hover:opacity-90 md:inline-flex"
            >
              {t.cta}
            </a>
          </nav>
        </div>
      </div>

      <div data-demo-body className="pt-10">
        {children}
      </div>

      <section aria-labelledby="tmx-outro" className="relative overflow-hidden bg-[#050508] px-5 py-20 text-white sm:px-8 sm:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-300/80">{t.outroEyebrow}</p>
            <h2 id="tmx-outro" className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              {t.outroTitle}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65">{t.outroText}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={contact}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition-opacity hover:opacity-90"
              >
                {t.outroCta}
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a href={links.portfolio} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-semibold text-white/80 hover:text-white">
                {t.outroBack}
              </a>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <p className="text-sm font-semibold text-white">{t.included}</p>
            <ul className="mt-4 space-y-3">
              {DEMO_FEATURES[slug][lang].map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-white/70">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-300">
                    <Check size={12} aria-hidden="true" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="relative mx-auto mt-16 flex max-w-6xl flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl">{t.disclaimer}</p>
          <p className="flex shrink-0 gap-4">
            <a href={links.impressum} className="hover:text-white">
              {t.impressum}
            </a>
            <a href={links.datenschutz} className="hover:text-white">
              {t.datenschutz}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
