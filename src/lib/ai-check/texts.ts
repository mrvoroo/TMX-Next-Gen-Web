/**
 * KI-Potenzial-Check – UI texts and the pre-written demo building blocks
 * (DE + EN). No hooks here so the API route can import it too.
 *
 * The consent / privacy / AI-notice strings are DRAFTS for legal review
 * (see docs/legal/drafts/ki-potenzial-check.md) – change them only together
 * with that file.
 */
import type { AiEffort, AiIndustry, AiLevel, AiLocale, AiSize, AiTask } from './schema';

export interface AiCheckTexts {
  badgeDemo: string;
  badgeLive: string;
  title: string;
  intro: string;
  industry: string;
  industries: Record<AiIndustry, string>;
  size: string;
  sizes: Record<AiSize, string>;
  tasks: string;
  tasksHint: string;
  taskNames: Record<AiTask, string>;
  note: string;
  noteHint: string;
  consent: string;
  privacyLink: string;
  noticeDemo: string;
  noticeLive: string;
  submit: string;
  loading: string;
  errorGeneric: string;
  errorRate: string;
  resultDemo: string;
  resultLive: string;
  potential: string;
  levels: Record<AiLevel, string>;
  effort: string;
  efforts: Record<AiEffort, string>;
  idea: string;
  firstStep: string;
  cta: string;
  restart: string;
  selected: string;
}

export const aiCheckTexts: Record<AiLocale, AiCheckTexts> = {
  de: {
    badgeDemo: 'KI-Potenzial-Check · Demo',
    badgeLive: 'KI-Potenzial-Check',
    title: 'Wo kann KI Ihnen Arbeit abnehmen?',
    intro: 'Drei kurze Fragen – danach erhalten Sie eine erste Einschätzung mit konkreten Ideen und einem ersten Schritt.',
    industry: 'Ihre Branche',
    industries: {
      trades: 'Handwerk',
      retail: 'Handel & E-Commerce',
      hospitality: 'Gastronomie & Hotel',
      services: 'Dienstleistung & Beratung',
      health: 'Gesundheit & Praxis',
      realestate: 'Immobilien',
      manufacturing: 'Produktion',
      other: 'Sonstiges',
    },
    size: 'Größe Ihres Unternehmens',
    sizes: { solo: 'Nur ich', small: '2–9 Personen', medium: '10–49 Personen', large: '50+ Personen' },
    tasks: 'Was kostet Sie am meisten Zeit?',
    tasksHint: 'Bis zu 5 auswählen',
    taskNames: {
      emails: 'E-Mails & Anfragen beantworten',
      quotes: 'Angebote & Rechnungen',
      scheduling: 'Termine planen',
      social: 'Social-Media-Beiträge',
      texts: 'Texte & Produktbeschreibungen',
      reports: 'Daten & Berichte auswerten',
      documents: 'Dokumente sortieren & ablegen',
      support: 'Kundenservice & häufige Fragen',
      knowledge: 'Wissen im Team finden',
    },
    note: 'Möchten Sie noch etwas ergänzen? (optional)',
    noteHint: 'Bitte keine Namen, Kontaktdaten, Kundendaten oder Geschäftsgeheimnisse eingeben.',
    consent:
      'Ich bin damit einverstanden, dass meine Angaben zur Erstellung der Einschätzung an einen KI-Anbieter übermittelt und dort verarbeitet werden. Es wird nichts gespeichert.',
    privacyLink: 'Mehr dazu in der Datenschutzerklärung',
    noticeDemo:
      'Demo-Modus: Die Einschätzung wird aus vorformulierten Bausteinen zusammengestellt. Es wird keine KI genutzt, und Ihre Auswahl wird nicht gespeichert.',
    noticeLive:
      'Hinweis: Die Einschätzung wird von einem KI-System erstellt. Sie kann Fehler enthalten und ersetzt keine persönliche Beratung.',
    submit: 'Einschätzung erstellen',
    loading: 'Einschätzung wird erstellt …',
    errorGeneric: 'Das hat leider nicht geklappt. Bitte versuchen Sie es gleich noch einmal.',
    errorRate: 'Zu viele Anfragen in kurzer Zeit. Bitte versuchen Sie es in ein paar Minuten erneut.',
    resultDemo: 'Beispiel-Einschätzung aus vorformulierten Bausteinen – keine KI-Auswertung',
    resultLive: 'Von einer KI erstellt – bitte kritisch prüfen',
    potential: 'Potenzial',
    levels: { low: 'Guter Einstieg', medium: 'Spürbares Potenzial', high: 'Großes Potenzial' },
    effort: 'Aufwand',
    efforts: { low: 'gering', medium: 'mittel', high: 'höher' },
    idea: 'Idee',
    firstStep: 'Erster Schritt',
    cta: 'Ergebnis im Gespräch vertiefen',
    restart: 'Neu starten',
    selected: 'ausgewählt',
  },
  en: {
    badgeDemo: 'AI potential check · Demo',
    badgeLive: 'AI potential check',
    title: 'Where can AI take work off your hands?',
    intro: 'Three short questions – then you get a first assessment with concrete ideas and a first step.',
    industry: 'Your industry',
    industries: {
      trades: 'Trades & crafts',
      retail: 'Retail & e-commerce',
      hospitality: 'Hospitality',
      services: 'Services & consulting',
      health: 'Health & practices',
      realestate: 'Real estate',
      manufacturing: 'Manufacturing',
      other: 'Other',
    },
    size: 'Size of your business',
    sizes: { solo: 'Just me', small: '2–9 people', medium: '10–49 people', large: '50+ people' },
    tasks: 'What takes you the most time?',
    tasksHint: 'Choose up to 5',
    taskNames: {
      emails: 'Answering emails & enquiries',
      quotes: 'Quotes & invoices',
      scheduling: 'Scheduling appointments',
      social: 'Social media posts',
      texts: 'Texts & product descriptions',
      reports: 'Analysing data & reports',
      documents: 'Sorting & filing documents',
      support: 'Customer service & FAQs',
      knowledge: 'Finding knowledge in the team',
    },
    note: 'Anything you would like to add? (optional)',
    noteHint: 'Please do not enter names, contact details, customer data or trade secrets.',
    consent:
      'I agree that my answers are sent to an AI provider and processed there to create the assessment. Nothing is stored.',
    privacyLink: 'More in the privacy policy',
    noticeDemo:
      'Demo mode: the assessment is put together from pre-written building blocks. No AI is used and your selection is not stored.',
    noticeLive:
      'Note: the assessment is created by an AI system. It may contain errors and does not replace personal advice.',
    submit: 'Create assessment',
    loading: 'Creating assessment …',
    errorGeneric: 'Sorry, that did not work. Please try again in a moment.',
    errorRate: 'Too many requests in a short time. Please try again in a few minutes.',
    resultDemo: 'Sample assessment from pre-written building blocks – no AI analysis',
    resultLive: 'Created by AI – please review critically',
    potential: 'Potential',
    levels: { low: 'Good starting point', medium: 'Noticeable potential', high: 'High potential' },
    effort: 'Effort',
    efforts: { low: 'low', medium: 'medium', high: 'higher' },
    idea: 'Idea',
    firstStep: 'First step',
    cta: 'Discuss the result with me',
    restart: 'Start over',
    selected: 'selected',
  },
};

/** Pre-written demo building blocks per task. */
export const demoBlocks: Record<AiLocale, Record<AiTask, { idea: string; effort: AiEffort; firstStep: string }>> = {
  de: {
    emails: {
      idea: 'Ein KI-Assistent schlägt Antwortentwürfe für wiederkehrende Anfragen vor – Sie prüfen und senden selbst.',
      effort: 'low',
      firstStep: 'Sammeln Sie die zehn häufigsten Anfragen und Ihre bisherigen Antworten.',
    },
    quotes: {
      idea: 'Angebote aus Vorlagen und Ihren Preislisten vorbereiten lassen und Daten für Rechnungen automatisch übernehmen.',
      effort: 'medium',
      firstStep: 'Prüfen Sie, welche Angaben in jedem Angebot gleich bleiben.',
    },
    scheduling: {
      idea: 'Online-Terminbuchung mit automatischen Erinnerungen; Anfragen werden dem passenden Termin-Typ zugeordnet.',
      effort: 'low',
      firstStep: 'Legen Sie fest, welche Termin-Arten und Zeiten buchbar sein sollen.',
    },
    social: {
      idea: 'Beitragsideen und Textentwürfe mit KI, geplant in einem Redaktionskalender – die Freigabe bleibt bei Ihnen.',
      effort: 'low',
      firstStep: 'Definieren Sie drei bis vier Themen, über die Sie regelmäßig posten möchten.',
    },
    texts: {
      idea: 'Entwürfe für Website-Texte oder Produktbeschreibungen in Ihrem Tonfall, die Sie anschließend überarbeiten.',
      effort: 'low',
      firstStep: 'Wählen Sie zwei bis drei Texte aus, die Ihren Stil gut zeigen.',
    },
    reports: {
      idea: 'Zahlen aus Tabellen oder Tools zusammenführen und als verständliche Übersicht aufbereiten lassen.',
      effort: 'medium',
      firstStep: 'Notieren Sie, welche Kennzahlen Sie jede Woche wirklich brauchen.',
    },
    documents: {
      idea: 'Eingehende Dokumente erkennen, sinnvoll benennen und in die richtige Ablage verschieben lassen.',
      effort: 'medium',
      firstStep: 'Schreiben Sie Ihre Ordnerstruktur und die häufigsten Dokumentarten auf.',
    },
    support: {
      idea: 'Ein Chat-Assistent beantwortet Standardfragen auf Basis Ihrer Inhalte und übergibt alles andere an Sie.',
      effort: 'medium',
      firstStep: 'Stellen Sie eine Liste häufiger Fragen mit geprüften Antworten zusammen.',
    },
    knowledge: {
      idea: 'Ein interner Assistent durchsucht Ihre Dokumente und beantwortet Fragen mit Verweis auf die Quelle.',
      effort: 'high',
      firstStep: 'Klären Sie, welche Dokumente durchsucht werden dürfen – und welche nicht.',
    },
  },
  en: {
    emails: {
      idea: 'An AI assistant suggests reply drafts for recurring enquiries – you review and send them yourself.',
      effort: 'low',
      firstStep: 'Collect your ten most common enquiries and the answers you gave so far.',
    },
    quotes: {
      idea: 'Prepare quotes from templates and your price lists, and carry data over to invoices automatically.',
      effort: 'medium',
      firstStep: 'Check which details stay the same in every quote.',
    },
    scheduling: {
      idea: 'Online booking with automatic reminders; enquiries are matched to the right appointment type.',
      effort: 'low',
      firstStep: 'Decide which appointment types and times should be bookable.',
    },
    social: {
      idea: 'Post ideas and text drafts with AI, planned in a content calendar – you keep the final approval.',
      effort: 'low',
      firstStep: 'Define three to four topics you want to post about regularly.',
    },
    texts: {
      idea: 'Drafts for website texts or product descriptions in your tone of voice, which you then refine.',
      effort: 'low',
      firstStep: 'Pick two or three texts that show your style well.',
    },
    reports: {
      idea: 'Bring together figures from spreadsheets or tools and turn them into a clear overview.',
      effort: 'medium',
      firstStep: 'Write down which figures you really need every week.',
    },
    documents: {
      idea: 'Recognise incoming documents, name them sensibly and move them to the right folder.',
      effort: 'medium',
      firstStep: 'Write down your folder structure and the most common document types.',
    },
    support: {
      idea: 'A chat assistant answers standard questions based on your content and hands everything else to you.',
      effort: 'medium',
      firstStep: 'Put together a list of common questions with reviewed answers.',
    },
    knowledge: {
      idea: 'An internal assistant searches your documents and answers questions with a link to the source.',
      effort: 'high',
      firstStep: 'Clarify which documents may be searched – and which may not.',
    },
  },
};

export const demoSummaries: Record<AiLocale, Record<AiLevel, string>> = {
  de: {
    low: 'Für Ihren Bereich ({industry}) sehe ich einen guten Einstieg: Mit einem gezielten ersten Schritt lässt sich KI ausprobieren, ohne viel umzustellen.',
    medium: 'Für Ihren Bereich ({industry}) gibt es mehrere Aufgaben, bei denen KI spürbar entlasten kann. Sinnvoll ist ein schrittweiser Start mit der einfachsten Aufgabe.',
    high: 'Bei Ihren Angaben ({industry}, mehrere zeitintensive Aufgaben) ist das Potenzial groß. Ein kurzer Plan mit klaren Prioritäten hilft, die richtigen Aufgaben zuerst anzugehen.',
  },
  en: {
    low: 'For your field ({industry}) I see a good starting point: one focused first step lets you try AI without changing much.',
    medium: 'For your field ({industry}) there are several tasks where AI can noticeably take work off your hands. A step-by-step start with the simplest task makes sense.',
    high: 'Based on your answers ({industry}, several time-consuming tasks) the potential is high. A short plan with clear priorities helps you tackle the right tasks first.',
  },
};

export const demoNextStep: Record<AiLocale, string> = {
  de: 'In einem Gespräch schauen wir gemeinsam, welche Aufgabe sich als Erstes lohnt – und was dafür nötig ist.',
  en: 'In a conversation we can look together at which task is worth starting with – and what it takes.',
};
