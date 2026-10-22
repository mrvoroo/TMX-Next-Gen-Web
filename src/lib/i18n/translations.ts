export type Locale = 'de' | 'en';

export interface TranslationSchema {
  nav: {
    home: string;
    about: string;
    services: string;
    portfolio: string;
    contact: string;
  };
  toggle: {
    de: string;
    en: string;
    ariaLabel: string;
  };
  hero: {
    eyebrow: string;
    tagline: string;
    sub: string;
    cta: string;
    scroll: string;
  };
  stats: {
    projects: string;
    projectsLabel: string;
    clients: string;
    clientsLabel: string;
    years: string;
    yearsLabel: string;
    satisfaction: string;
    satisfactionLabel: string;
  };
  contact: {
    heading: string;
    sub: string;
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    subject: string;
    subjectPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    gdpr: string;
    gdprLink: string;
    submit: string;
    successHeading: string;
    successBody: string;
  };
  footer: {
    tagline: string;
    legal: string;
    impressum: string;
    datenschutz: string;
    cookieSettings: string;
    backToTop: string;
    rightsReserved: string;
    socialAriaLinkedIn: string;
    socialAriaInstagram: string;
    socialAriaXing: string;
  };
  meta: {
    title: string;
    description: string;
    impressumTitle: string;
    datenschutzTitle: string;
    kontaktTitle: string;
  };
}

export const translations: Record<Locale, TranslationSchema> = {
  de: {
    nav: {
      home: 'Start',
      about: 'Über mich',
      services: 'Leistungen',
      portfolio: 'Portfolio',
      contact: 'Kontakt',
    },
    toggle: {
      de: 'DE',
      en: 'EN',
      ariaLabel: 'Sprache wechseln',
    },
    hero: {
      eyebrow: 'TMX — Freelancer für Web, Werbung & KI',
      tagline: 'Digitale Exzellenz. Messbare Ergebnisse.',
      sub: 'Ich entwickle maßgeschneiderte digitale Lösungen — von der Webentwicklung über Künstliche Intelligenz bis hin zu digitalem Marketing und IT-Beratung.',
      cta: 'Projekt starten',
      scroll: 'Scrollen',
    },
    stats: {
      projects: '150+',
      projectsLabel: 'Abgeschlossene Projekte',
      clients: '80+',
      clientsLabel: 'Zufriedene Kunden',
      years: '8+',
      yearsLabel: 'Jahre Erfahrung',
      satisfaction: '99%',
      satisfactionLabel: 'Kundenzufriedenheit',
    },
    contact: {
      heading: 'Kontakt',
      sub: 'Sprechen Sie mich an',
      name: 'Name',
      namePlaceholder: 'Ihr vollständiger Name',
      email: 'E-Mail',
      emailPlaceholder: 'ihre@email.de',
      subject: 'Betreff',
      subjectPlaceholder: 'Womit kann ich Ihnen helfen?',
      message: 'Nachricht',
      messagePlaceholder: 'Beschreiben Sie Ihr Projekt oder Ihre Anfrage...',
      gdpr: 'Ich habe die',
      gdprLink: 'Datenschutzerklärung',
      submit: 'Nachricht senden',
      successHeading: 'Nachricht gesendet!',
      successBody: 'Vielen Dank für Ihre Anfrage. Ich melde mich innerhalb von 24 Stunden bei Ihnen.',
    },
    footer: {
      tagline: 'Digitale Exzellenz. Messbare Ergebnisse.',
      legal: 'Rechtliches',
      impressum: 'Impressum',
      datenschutz: 'Datenschutzerklärung',
      cookieSettings: 'Cookie-Einstellungen',
      backToTop: 'Nach oben',
      rightsReserved: 'Alle Rechte vorbehalten.',
      socialAriaLinkedIn: 'TMX auf LinkedIn',
      socialAriaInstagram: 'TMX auf Instagram',
      socialAriaXing: 'TMX auf Xing',
    },
    meta: {
      title: 'TMX — Digitale Exzellenz',
      description:
        'TMX – Freelancer für Webentwicklung, Online-Werbung und KI-Lösungen. Websites, Onlineshops und Kampagnen aus einer Hand.',
      impressumTitle: 'Impressum – TMX',
      datenschutzTitle: 'Datenschutzerklärung – TMX',
      kontaktTitle: 'Kontakt – TMX',
    },
  },

  en: {
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      portfolio: 'Portfolio',
      contact: 'Contact',
    },
    toggle: {
      de: 'DE',
      en: 'EN',
      ariaLabel: 'Switch language',
    },
    hero: {
      eyebrow: 'TMX — Freelancer for web, advertising & AI',
      tagline: 'Digital Excellence. Measurable Results.',
      sub: 'I craft bespoke digital solutions — from web development and artificial intelligence to digital marketing and IT consulting.',
      cta: 'Start a project',
      scroll: 'Scroll',
    },
    stats: {
      projects: '150+',
      projectsLabel: 'Projects Completed',
      clients: '80+',
      clientsLabel: 'Happy Clients',
      years: '8+',
      yearsLabel: 'Years of Experience',
      satisfaction: '99%',
      satisfactionLabel: 'Client Satisfaction',
    },
    contact: {
      heading: 'Contact',
      sub: 'Get in touch',
      name: 'Name',
      namePlaceholder: 'Your full name',
      email: 'Email',
      emailPlaceholder: 'you@email.com',
      subject: 'Subject',
      subjectPlaceholder: 'How can I help you?',
      message: 'Message',
      messagePlaceholder: 'Describe your project or enquiry...',
      gdpr: 'I have read the',
      gdprLink: 'Privacy Policy',
      submit: 'Send message',
      successHeading: 'Message sent!',
      successBody: 'Thank you for your enquiry. I will be in touch within 24 hours.',
    },
    footer: {
      tagline: 'Digital Excellence. Measurable Results.',
      legal: 'Legal',
      impressum: 'Legal Notice',
      datenschutz: 'Privacy Policy',
      cookieSettings: 'Cookie Settings',
      backToTop: 'Back to top',
      rightsReserved: 'All rights reserved.',
      socialAriaLinkedIn: 'TMX on LinkedIn',
      socialAriaInstagram: 'TMX on Instagram',
      socialAriaXing: 'TMX on Xing',
    },
    meta: {
      title: 'TMX — Digital Excellence',
      description:
        'TMX – freelancer for web development, online advertising and AI solutions. Websites, online shops and campaigns in one place.',
      impressumTitle: 'Legal Notice – TMX',
      datenschutzTitle: 'Privacy Policy – TMX',
      kontaktTitle: 'Contact – TMX',
    },
  },
};
