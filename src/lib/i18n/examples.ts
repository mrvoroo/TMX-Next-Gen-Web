/**
 * UI texts of the interactive examples on the pillar pages (DE + EN).
 * All brands, products, prices and figures are fictional sample content.
 */
import { useLocale } from 'next-intl';
import type { Locale } from './translations';

export interface ExamplesText {
  heroBuilder: {
    controlsLabel: string;
    style: string;
    styles: { minimal: string; bold: string; gradient: string };
    accent: string;
    accents: { violet: string; cyan: string; amber: string; rose: string };
    layout: string;
    layouts: { centered: string; split: string };
    device: string;
    devices: { desktop: string; mobile: string };
    hint: string;
    brand: string;
    nav: [string, string, string];
    eyebrow: string;
    headline: string;
    sub: string;
    cta: string;
    secondary: string;
  };
  shop: {
    brand: string;
    products: { name: string; detail: string; price: number }[];
    add: string;
    added: string;
    cart: string;
    openCart: string;
    close: string;
    empty: string;
    subtotal: string;
    checkout: string;
    checkoutNote: string;
    priceNote: string;
    qtyDec: string;
    qtyInc: string;
    remove: string;
    itemsInCart: string;
  };
  dashboard: {
    title: string;
    ranges: { week: string; month: string };
    rangeLabel: string;
    kpis: { visitors: string; leads: string; conversion: string };
    vsPrevious: string;
    live: string;
    pause: string;
    resume: string;
    chartLabel: string;
    sources: string;
    sourceNames: [string, string, string, string];
  };
  chat: {
    brand: string;
    status: string;
    greeting: string;
    suggestions: { q: string; a: string }[];
    placeholder: string;
    send: string;
    fallback: string;
    typing: string;
    scriptedNote: string;
    reset: string;
  };
}

export const examplesText: Record<Locale, ExamplesText> = {
  de: {
    heroBuilder: {
      controlsLabel: 'Vorschau anpassen',
      style: 'Stil',
      styles: { minimal: 'Minimal', bold: 'Kräftig', gradient: 'Verlauf' },
      accent: 'Akzentfarbe',
      accents: { violet: 'Violett', cyan: 'Cyan', amber: 'Bernstein', rose: 'Rosé' },
      layout: 'Layout',
      layouts: { centered: 'Zentriert', split: 'Geteilt' },
      device: 'Ansicht',
      devices: { desktop: 'Desktop', mobile: 'Mobil' },
      hint: 'Ändern Sie Stil, Farbe und Layout – die Vorschau passt sich sofort an.',
      brand: 'Nordwind',
      nav: ['Sortiment', 'Rösterei', 'Kontakt'],
      eyebrow: 'Café & Rösterei',
      headline: 'Kaffee, frisch geröstet.',
      sub: 'Bohnen aus kleinen Röstereien – jede Woche neu für Sie ausgewählt.',
      cta: 'Sortiment ansehen',
      secondary: 'Mehr erfahren',
    },
    shop: {
      brand: 'Grünraum',
      products: [
        { name: 'Monstera', detail: 'Topf Ø 17 cm', price: 29.9 },
        { name: 'Olivenbaum', detail: 'Höhe ca. 80 cm', price: 54.0 },
        { name: 'Bogenhanf', detail: 'pflegeleicht', price: 19.5 },
      ],
      add: 'In den Warenkorb',
      added: 'Hinzugefügt',
      cart: 'Warenkorb',
      openCart: 'Warenkorb öffnen',
      close: 'Schließen',
      empty: 'Ihr Warenkorb ist leer.',
      subtotal: 'Zwischensumme',
      checkout: 'Zur Kasse',
      checkoutNote: 'Demo – es findet kein echter Kauf statt.',
      priceNote: 'Beispielpreise',
      qtyDec: 'Menge verringern',
      qtyInc: 'Menge erhöhen',
      remove: 'Entfernen',
      itemsInCart: 'Artikel im Warenkorb',
    },
    dashboard: {
      title: 'Übersicht',
      ranges: { week: '7 Tage', month: '30 Tage' },
      rangeLabel: 'Zeitraum',
      kpis: { visitors: 'Besucher', leads: 'Anfragen', conversion: 'Konversionsrate' },
      vsPrevious: 'ggü. Vorzeitraum',
      live: 'Live',
      pause: 'Pausieren',
      resume: 'Fortsetzen',
      chartLabel: 'Besucher im Zeitverlauf',
      sources: 'Herkunft der Besucher',
      sourceNames: ['Suche', 'Social Media', 'Direkt', 'Empfehlung'],
    },
    chat: {
      brand: 'Grünraum Support',
      status: 'Antwortet meist sofort',
      greeting: 'Hallo! Wie kann ich Ihnen helfen?',
      suggestions: [
        {
          q: 'Wie lange dauert der Versand?',
          a: 'In der Regel 2–3 Werktage. Sie erhalten die Sendungsnummer per E-Mail.',
        },
        {
          q: 'Kann ich eine Pflanze zurückgeben?',
          a: 'Ja, innerhalb von 30 Tagen. Ich schicke Ihnen gern den Rücksendelink.',
        },
        {
          q: 'Mit einem Menschen sprechen',
          a: 'Gern – ich leite Sie an das Team weiter. Sie bekommen meist innerhalb eines Werktags eine Antwort.',
        },
      ],
      placeholder: 'Nachricht schreiben …',
      send: 'Senden',
      fallback: 'Danke für Ihre Nachricht! In dieser Demo antworte ich nur auf die Vorschläge oben.',
      typing: 'schreibt …',
      scriptedNote: 'Vorgefertigte Antworten – keine KI, es werden keine Daten gesendet.',
      reset: 'Neu starten',
    },
  },
  en: {
    heroBuilder: {
      controlsLabel: 'Customise the preview',
      style: 'Style',
      styles: { minimal: 'Minimal', bold: 'Bold', gradient: 'Gradient' },
      accent: 'Accent colour',
      accents: { violet: 'Violet', cyan: 'Cyan', amber: 'Amber', rose: 'Rose' },
      layout: 'Layout',
      layouts: { centered: 'Centred', split: 'Split' },
      device: 'View',
      devices: { desktop: 'Desktop', mobile: 'Mobile' },
      hint: 'Change style, colour and layout – the preview updates instantly.',
      brand: 'Nordwind',
      nav: ['Shop', 'Roastery', 'Contact'],
      eyebrow: 'Café & roastery',
      headline: 'Coffee, freshly roasted.',
      sub: 'Beans from small roasters – a new selection every week.',
      cta: 'Browse the range',
      secondary: 'Learn more',
    },
    shop: {
      brand: 'Grünraum',
      products: [
        { name: 'Monstera', detail: 'Pot Ø 17 cm', price: 29.9 },
        { name: 'Olive tree', detail: 'Approx. 80 cm tall', price: 54.0 },
        { name: 'Snake plant', detail: 'Easy care', price: 19.5 },
      ],
      add: 'Add to cart',
      added: 'Added',
      cart: 'Cart',
      openCart: 'Open cart',
      close: 'Close',
      empty: 'Your cart is empty.',
      subtotal: 'Subtotal',
      checkout: 'Checkout',
      checkoutNote: 'Demo – no real purchase takes place.',
      priceNote: 'Sample prices',
      qtyDec: 'Decrease quantity',
      qtyInc: 'Increase quantity',
      remove: 'Remove',
      itemsInCart: 'items in cart',
    },
    dashboard: {
      title: 'Overview',
      ranges: { week: '7 days', month: '30 days' },
      rangeLabel: 'Period',
      kpis: { visitors: 'Visitors', leads: 'Enquiries', conversion: 'Conversion rate' },
      vsPrevious: 'vs. previous period',
      live: 'Live',
      pause: 'Pause',
      resume: 'Resume',
      chartLabel: 'Visitors over time',
      sources: 'Traffic sources',
      sourceNames: ['Search', 'Social media', 'Direct', 'Referral'],
    },
    chat: {
      brand: 'Grünraum Support',
      status: 'Usually replies instantly',
      greeting: 'Hi! How can I help you?',
      suggestions: [
        {
          q: 'How long does shipping take?',
          a: 'Usually 2–3 working days. You will get the tracking number by email.',
        },
        {
          q: 'Can I return a plant?',
          a: 'Yes, within 30 days. I am happy to send you the return link.',
        },
        {
          q: 'Talk to a person',
          a: 'Of course – I am passing you on to the team. You will usually hear back within one working day.',
        },
      ],
      placeholder: 'Write a message …',
      send: 'Send',
      fallback: 'Thanks for your message! In this demo I only answer the suggestions above.',
      typing: 'typing …',
      scriptedNote: 'Pre-written replies – no AI, no data is sent.',
      reset: 'Start over',
    },
  },
};

/** Example texts for the current URL locale. */
export function useExamplesText(): ExamplesText {
  const locale = useLocale() as Locale;
  return examplesText[locale] ?? examplesText.de;
}

export const currencyFormatter = (locale: Locale) =>
  new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-IE', {
    style: 'currency',
    currency: 'EUR',
  });
