/**
 * UI texts of the interactive marketing charts on the "Digitales Marketing"
 * pillar page (DE + EN). Every figure is fictional sample data – nothing here
 * describes a real campaign, client or result.
 */
import { useLocale } from 'next-intl';
import type { Locale } from './translations';

/** Fixed platform order – colours follow the platform, never its rank. */
export const PLATFORMS = ['instagram', 'facebook', 'tiktok', 'snapchat', 'pinterest', 'linkedin'] as const;
export type Platform = (typeof PLATFORMS)[number];

export const PLATFORM_NAMES: Record<Platform, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  snapchat: 'Snapchat',
  pinterest: 'Pinterest',
  linkedin: 'LinkedIn',
};

export interface MarketingExamplesText {
  common: {
    fictional: string;
    showTable: string;
    hideTable: string;
  };
  budget: {
    title: string;
    budget: string;
    perMonth: string;
    goal: string;
    goals: { reach: string; leads: string; sales: string };
    audience: string;
    audiences: { b2c: string; b2b: string };
    share: string;
    platform: string;
    amount: string;
    note: string;
  };
  funnel: {
    title: string;
    filter: string;
    all: string;
    stages: [string, string, string, string];
    rates: [string, string, string];
    ofPrevious: string;
    stage: string;
    value: string;
    rate: string;
    note: string;
  };
  scheduler: {
    title: string;
    queue: string;
    autoPlan: string;
    reset: string;
    planned: string;
    of: string;
    days: [string, string, string, string, string, string, string];
    slots: [string, string, string];
    posts: string[];
    emptyQueue: string;
    note: string;
  };
  insights: {
    title: string;
    metric: string;
    metrics: { leads: string; revenue: string };
    week: string;
    weekShort: string;
    insightsLabel: string;
    items: { title: string; text: string }[];
    note: string;
  };
}

export const marketingExamplesText: Record<Locale, MarketingExamplesText> = {
  de: {
    common: {
      fictional: 'Beispielhafte Darstellung mit fiktiven Daten',
      showTable: 'Als Tabelle anzeigen',
      hideTable: 'Tabelle ausblenden',
    },
    budget: {
      title: 'Budget-Verteilung nach Plattform',
      budget: 'Monatsbudget',
      perMonth: 'pro Monat',
      goal: 'Ziel',
      goals: { reach: 'Reichweite', leads: 'Anfragen', sales: 'Verkäufe' },
      audience: 'Zielgruppe',
      audiences: { b2c: 'Privatkunden', b2b: 'Unternehmen' },
      share: 'Anteil',
      platform: 'Plattform',
      amount: 'Betrag',
      note: 'Beispielhafte Verteilung. Die echte Planung hängt von Angebot, Zielgruppe und Tests ab – kein Angebot und keine Garantie.',
    },
    funnel: {
      title: 'Vom Kontakt zur Anfrage',
      filter: 'Plattform',
      all: 'Alle',
      stages: ['Impressionen', 'Klicks', 'Seitenbesuche', 'Anfragen'],
      rates: ['Klickrate', 'Ladequote', 'Anfragequote'],
      ofPrevious: 'der vorherigen Stufe',
      stage: 'Stufe',
      value: 'Anzahl',
      rate: 'Quote',
      note: 'Fiktive Werte über 30 Tage. Bei der Betreuung schaue ich auf jede Stufe – dort, wo am meisten verloren geht, setze ich zuerst an.',
    },
    scheduler: {
      title: 'Wochenplan für Beiträge',
      queue: 'Warteschlange',
      autoPlan: 'Automatisch einplanen',
      reset: 'Zurücksetzen',
      planned: 'eingeplant',
      of: 'von',
      days: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
      slots: ['Morgens', 'Mittags', 'Abends'],
      posts: [
        'Neues Produkt',
        'Blick hinter die Kulissen',
        'Kundenfrage beantwortet',
        'Tipp der Woche',
        'Kurzvideo',
        'Umfrage',
        'Angebot am Wochenende',
        'Team vorgestellt',
      ],
      emptyQueue: 'Alle Beiträge sind eingeplant.',
      note: 'Simulation im Browser. In echten Projekten richtet sich der Plan nach Ihren Daten und wird vor der Veröffentlichung von Menschen geprüft.',
    },
    insights: {
      title: 'Auswertung der letzten 12 Wochen',
      metric: 'Kennzahl',
      metrics: { leads: 'Anfragen', revenue: 'Umsatz' },
      week: 'Woche',
      weekShort: 'KW',
      insightsLabel: 'Erkenntnisse',
      items: [
        { title: 'Einbruch in Woche 7', text: 'Deutlich weniger als in den Wochen davor – im Beispiel war die Kampagne pausiert.' },
        { title: 'Stärkster Monat zum Schluss', text: 'Die letzten vier Wochen liegen klar über dem Durchschnitt.' },
        { title: 'Ausreißer in Woche 3', text: 'Ein einzelner Spitzenwert – im Beispiel durch eine Aktion am Wochenende.' },
      ],
      note: 'Vorformulierte Beispiel-Erkenntnisse – keine Live-KI, keine echten Daten.',
    },
  },
  en: {
    common: {
      fictional: 'Illustrative view with fictional data',
      showTable: 'Show as table',
      hideTable: 'Hide table',
    },
    budget: {
      title: 'Budget split by platform',
      budget: 'Monthly budget',
      perMonth: 'per month',
      goal: 'Goal',
      goals: { reach: 'Reach', leads: 'Enquiries', sales: 'Sales' },
      audience: 'Audience',
      audiences: { b2c: 'Consumers', b2b: 'Businesses' },
      share: 'Share',
      platform: 'Platform',
      amount: 'Amount',
      note: 'Illustrative split. Real planning depends on your offer, audience and tests – not a quote and no guarantee.',
    },
    funnel: {
      title: 'From first contact to enquiry',
      filter: 'Platform',
      all: 'All',
      stages: ['Impressions', 'Clicks', 'Page visits', 'Enquiries'],
      rates: ['Click rate', 'Load rate', 'Enquiry rate'],
      ofPrevious: 'of the previous stage',
      stage: 'Stage',
      value: 'Count',
      rate: 'Rate',
      note: 'Fictional values over 30 days. When I manage campaigns I look at every stage – and start where the most is lost.',
    },
    scheduler: {
      title: 'Weekly post schedule',
      queue: 'Queue',
      autoPlan: 'Schedule automatically',
      reset: 'Reset',
      planned: 'scheduled',
      of: 'of',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      slots: ['Morning', 'Midday', 'Evening'],
      posts: [
        'New product',
        'Behind the scenes',
        'Customer question',
        'Tip of the week',
        'Short video',
        'Poll',
        'Weekend offer',
        'Meet the team',
      ],
      emptyQueue: 'All posts are scheduled.',
      note: 'Simulated in your browser. In real projects the plan follows your data and is reviewed by a person before anything is published.',
    },
    insights: {
      title: 'Review of the last 12 weeks',
      metric: 'Metric',
      metrics: { leads: 'Enquiries', revenue: 'Revenue' },
      week: 'Week',
      weekShort: 'W',
      insightsLabel: 'Insights',
      items: [
        { title: 'Drop in week 7', text: 'Clearly lower than the weeks before – in this example the campaign was paused.' },
        { title: 'Strongest month at the end', text: 'The last four weeks are clearly above average.' },
        { title: 'Outlier in week 3', text: 'A single peak – in this example caused by a weekend promotion.' },
      ],
      note: 'Pre-written sample insights – no live AI, no real data.',
    },
  },
};

export function useMarketingText(): MarketingExamplesText {
  const locale = useLocale() as Locale;
  return marketingExamplesText[locale] ?? marketingExamplesText.de;
}
