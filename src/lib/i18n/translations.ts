export type Locale = 'de' | 'en';

export interface TranslationSchema {
  nav: {
    home: string;
    services: string;
    about: string;
    portfolio: string;
    contact: string;
  };
  toggle: {
    de: string;
    en: string;
    ariaLabel: string;
  };
  hero: {
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
  about: {
    heading: string;
    sub: string;
    body: string;
    cta: string;
  };
  services: {
    heading: string;
    sub: string;
    dev: {
      title: string;
      sub: string;
      items: string[];
    };
    ai: {
      title: string;
      sub: string;
      items: string[];
    };
    marketing: {
      title: string;
      sub: string;
      items: string[];
    };
    it: {
      title: string;
      sub: string;
      items: string[];
    };
  };
  process: {
    heading: string;
    sub: string;
    steps: Array<{ title: string; desc: string }>;
  };
  whyUs: {
    heading: string;
    sub: string;
    cards: Array<{ title: string; desc: string }>;
  };
  portfolio: {
    heading: string;
    sub: string;
    badge: string;
    cards: Array<{ title: string; desc: string; tag: string }>;
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
    backToTop: string;
    allRights: string;
    socialAriaLinkedIn: string;
    socialAriaInstagram: string;
    socialAriaXing: string;
  };
}

export const translations: Record<Locale, TranslationSchema> = {
  de: {
    nav: {
      home: 'Start',
      services: 'Leistungen',
      about: 'Über uns',
      portfolio: 'Referenzen',
      contact: 'Kontakt',
    },
    toggle: {
      de: 'DE',
      en: 'EN',
      ariaLabel: 'Sprache wechseln',
    },
    hero: {
      tagline: 'Digitale Exzellenz. Messbare Ergebnisse.',
      sub: 'Wir entwickeln maßgeschneiderte digitale Lösungen — von der Webentwicklung über Künstliche Intelligenz bis hin zu digitalem Marketing und IT-Beratung.',
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
    about: {
      heading: 'Über TMX',
      sub: 'Ihr Partner für digitale Transformation',
      body: 'Wir sind eine full-service Digitalagentur mit Sitz in Deutschland, spezialisiert auf die Entwicklung innovativer digitaler Lösungen. Unser interdisziplinäres Team aus Entwicklern, KI-Experten, Marketing-Strategen und IT-Beratern arbeitet Hand in Hand, um Ihrem Unternehmen nachhaltige Wettbewerbsvorteile zu sichern.',
      cta: 'Mehr erfahren',
    },
    services: {
      heading: 'Unsere Leistungen',
      sub: 'Vier Säulen digitaler Exzellenz',
      dev: {
        title: 'Entwicklung',
        sub: 'Maßgeschneiderte Software- und Weblösungen',
        items: [
          'Webentwicklung',
          'Mobile Apps',
          'E-Commerce',
          'API-Integration',
          'Cloud-Lösungen',
          'Performance-Optimierung',
        ],
      },
      ai: {
        title: 'Künstliche Intelligenz',
        sub: 'Intelligente Automatisierung und KI-Lösungen',
        items: [
          'KI-Strategie & Beratung',
          'Machine Learning',
          'Natural Language Processing',
          'Prozessautomatisierung',
          'Chatbots & Assistenten',
          'Datenanalyse & Prognosen',
        ],
      },
      marketing: {
        title: 'Digitales Marketing',
        sub: 'Reichweite, Relevanz und messbare Ergebnisse',
        items: [
          'Suchmaschinenoptimierung (SEO)',
          'Suchmaschinenwerbung (SEA)',
          'Social-Media-Marketing',
          'Content-Marketing',
          'E-Mail-Marketing',
          'Conversion-Optimierung',
        ],
      },
      it: {
        title: 'IT & Beratung',
        sub: 'Technologieberatung und IT-Infrastruktur',
        items: [
          'IT-Strategie & Roadmap',
          'Systemarchitektur',
          'Cybersicherheit',
          'Cloud-Migration',
          'IT-Infrastruktur',
          'Digitale Transformation',
        ],
      },
    },
    process: {
      heading: 'So arbeiten wir',
      sub: 'Unser bewährter Prozess für Ihren Erfolg',
      steps: [
        {
          title: 'Discovery',
          desc: 'Wir analysieren Ihre Anforderungen, Ziele und den Markt, um eine fundierte Basis für Ihr Projekt zu schaffen.',
        },
        {
          title: 'Strategie',
          desc: 'Auf Basis der Analyse entwickeln wir eine maßgeschneiderte Strategie und einen konkreten Fahrplan.',
        },
        {
          title: 'Umsetzung',
          desc: 'Unser Team setzt die geplante Lösung mit modernsten Technologien und agilen Methoden um.',
        },
        {
          title: 'Launch',
          desc: 'Wir begleiten Sie beim Launch, sorgen für reibungslose Inbetriebnahme und optimieren kontinuierlich.',
        },
        {
          title: 'Support',
          desc: 'Auch nach dem Launch stehen wir Ihnen mit Wartung, Updates und strategischer Weiterentwicklung zur Seite.',
        },
      ],
    },
    whyUs: {
      heading: 'Warum TMX?',
      sub: 'Was uns auszeichnet',
      cards: [
        {
          title: 'Schnelle Umsetzung',
          desc: 'Agile Prozesse und ein erfahrenes Team sorgen für kurze Time-to-Market ohne Qualitätsverlust.',
        },
        {
          title: 'Maximale Sicherheit',
          desc: 'Datenschutz und IT-Sicherheit sind keine Nachgedanken — sie sind Teil unserer DNA.',
        },
        {
          title: 'KI-Expertise',
          desc: 'Wir setzen modernste KI-Technologien ein, um Ihre Prozesse zu automatisieren und zu optimieren.',
        },
        {
          title: '24/7 Support',
          desc: 'Unser Support-Team ist rund um die Uhr für Sie da — persönlich, schnell und kompetent.',
        },
        {
          title: 'Messbare Ergebnisse',
          desc: 'Jede Maßnahme wird mit klaren KPIs verknüpft, transparent gemessen und kontinuierlich optimiert.',
        },
        {
          title: 'Langfristige Partnerschaft',
          desc: 'Wir denken in nachhaltigen Beziehungen — Ihr Erfolg ist unser Erfolg.',
        },
      ],
    },
    portfolio: {
      heading: 'Referenzen',
      sub: 'Ausgewählte Projekte',
      badge: 'Fallstudie',
      cards: [
        {
          title: 'E-Commerce Relaunch',
          desc: 'Vollständige Neugestaltung und Entwicklung einer B2C-E-Commerce-Plattform mit KI-gestützter Produktempfehlung.',
          tag: 'Entwicklung · KI',
        },
        {
          title: 'KI-Automatisierung',
          desc: 'Implementierung eines KI-basierten Automatisierungssystems zur Optimierung von Geschäftsprozessen.',
          tag: 'Künstliche Intelligenz',
        },
        {
          title: 'SEO & Growth',
          desc: 'Steigerung des organischen Traffics um 340 % durch ganzheitliche SEO-Strategie und Content-Marketing.',
          tag: 'Digitales Marketing',
        },
        {
          title: 'IT-Infrastruktur-Migration',
          desc: 'Vollständige Migration der On-Premise-Infrastruktur in eine sichere, skalierbare Cloud-Umgebung.',
          tag: 'IT & Beratung',
        },
      ],
    },
    contact: {
      heading: 'Kontakt',
      sub: 'Lassen Sie uns sprechen',
      name: 'Name',
      namePlaceholder: 'Ihr vollständiger Name',
      email: 'E-Mail',
      emailPlaceholder: 'ihre@email.de',
      subject: 'Betreff',
      subjectPlaceholder: 'Womit können wir Ihnen helfen?',
      message: 'Nachricht',
      messagePlaceholder: 'Beschreiben Sie Ihr Projekt oder Ihre Anfrage...',
      gdpr: 'Ich habe die',
      gdprLink: 'Datenschutzerklärung',
      submit: 'Nachricht senden',
      successHeading: 'Nachricht gesendet!',
      successBody: 'Vielen Dank für Ihre Anfrage. Wir melden uns innerhalb von 24 Stunden bei Ihnen.',
    },
    footer: {
      tagline: 'Digitale Exzellenz. Messbare Ergebnisse.',
      legal: 'Rechtliches',
      impressum: 'Impressum',
      datenschutz: 'Datenschutzerklärung',
      backToTop: 'Nach oben',
      allRights: '© 2025 TMX. Alle Rechte vorbehalten.',
      socialAriaLinkedIn: 'TMX auf LinkedIn',
      socialAriaInstagram: 'TMX auf Instagram',
      socialAriaXing: 'TMX auf Xing',
    },
  },

  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      about: 'About',
      portfolio: 'Portfolio',
      contact: 'Contact',
    },
    toggle: {
      de: 'DE',
      en: 'EN',
      ariaLabel: 'Switch language',
    },
    hero: {
      tagline: 'Digital Excellence. Measurable Results.',
      sub: 'We craft bespoke digital solutions — from web development and artificial intelligence to digital marketing and IT consulting.',
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
    about: {
      heading: 'About TMX',
      sub: 'Your partner for digital transformation',
      body: 'We are a full-service digital agency based in Germany, specialising in building innovative digital solutions. Our interdisciplinary team of developers, AI experts, marketing strategists, and IT consultants works hand in hand to secure lasting competitive advantages for your business.',
      cta: 'Learn more',
    },
    services: {
      heading: 'Our Services',
      sub: 'Four pillars of digital excellence',
      dev: {
        title: 'Development',
        sub: 'Tailored software and web solutions',
        items: [
          'Web Development',
          'Mobile Apps',
          'E-Commerce',
          'API Integration',
          'Cloud Solutions',
          'Performance Optimisation',
        ],
      },
      ai: {
        title: 'Artificial Intelligence',
        sub: 'Intelligent automation and AI solutions',
        items: [
          'AI Strategy & Consulting',
          'Machine Learning',
          'Natural Language Processing',
          'Process Automation',
          'Chatbots & Assistants',
          'Data Analytics & Forecasting',
        ],
      },
      marketing: {
        title: 'Digital Marketing',
        sub: 'Reach, relevance, and measurable outcomes',
        items: [
          'Search Engine Optimisation (SEO)',
          'Search Engine Advertising (SEA)',
          'Social Media Marketing',
          'Content Marketing',
          'Email Marketing',
          'Conversion Optimisation',
        ],
      },
      it: {
        title: 'IT & Consulting',
        sub: 'Technology consulting and IT infrastructure',
        items: [
          'IT Strategy & Roadmap',
          'System Architecture',
          'Cybersecurity',
          'Cloud Migration',
          'IT Infrastructure',
          'Digital Transformation',
        ],
      },
    },
    process: {
      heading: 'How We Work',
      sub: 'Our proven process for your success',
      steps: [
        {
          title: 'Discovery',
          desc: 'We analyse your requirements, goals, and market environment to build a solid foundation for your project.',
        },
        {
          title: 'Strategy',
          desc: 'Based on our analysis we craft a tailored strategy and a concrete roadmap.',
        },
        {
          title: 'Build',
          desc: 'Our team implements the planned solution using cutting-edge technologies and agile methodologies.',
        },
        {
          title: 'Launch',
          desc: 'We accompany you through launch, ensuring a smooth go-live and continuous optimisation.',
        },
        {
          title: 'Support',
          desc: 'After launch we remain by your side with maintenance, updates, and strategic growth.',
        },
      ],
    },
    whyUs: {
      heading: 'Why TMX?',
      sub: 'What sets us apart',
      cards: [
        {
          title: 'Fast Delivery',
          desc: 'Agile processes and an experienced team ensure short time-to-market without compromising quality.',
        },
        {
          title: 'Maximum Security',
          desc: 'Privacy and IT security are not afterthoughts — they are part of our DNA.',
        },
        {
          title: 'AI Expertise',
          desc: 'We deploy the latest AI technologies to automate and optimise your processes.',
        },
        {
          title: '24/7 Support',
          desc: 'Our support team is available around the clock — personal, fast, and expert.',
        },
        {
          title: 'Measurable Results',
          desc: 'Every initiative is tied to clear KPIs, transparently tracked, and continuously improved.',
        },
        {
          title: 'Long-term Partnership',
          desc: 'We think in sustainable relationships — your success is our success.',
        },
      ],
    },
    portfolio: {
      heading: 'Portfolio',
      sub: 'Selected projects',
      badge: 'Case Study',
      cards: [
        {
          title: 'E-Commerce Relaunch',
          desc: 'Complete redesign and development of a B2C e-commerce platform with AI-powered product recommendations.',
          tag: 'Development · AI',
        },
        {
          title: 'AI Automation',
          desc: 'Implementation of an AI-based automation system to streamline and optimise business processes.',
          tag: 'Artificial Intelligence',
        },
        {
          title: 'SEO & Growth',
          desc: 'Grew organic traffic by 340 % through a holistic SEO strategy and content marketing programme.',
          tag: 'Digital Marketing',
        },
        {
          title: 'IT Infrastructure Migration',
          desc: 'Full migration of on-premise infrastructure to a secure, scalable cloud environment.',
          tag: 'IT & Consulting',
        },
      ],
    },
    contact: {
      heading: 'Contact',
      sub: "Let's talk",
      name: 'Name',
      namePlaceholder: 'Your full name',
      email: 'Email',
      emailPlaceholder: 'you@email.com',
      subject: 'Subject',
      subjectPlaceholder: 'How can we help you?',
      message: 'Message',
      messagePlaceholder: 'Describe your project or enquiry...',
      gdpr: 'I have read the',
      gdprLink: 'Privacy Policy',
      submit: 'Send message',
      successHeading: 'Message sent!',
      successBody: 'Thank you for your enquiry. We will be in touch within 24 hours.',
    },
    footer: {
      tagline: 'Digital Excellence. Measurable Results.',
      legal: 'Legal',
      impressum: 'Impressum',
      datenschutz: 'Datenschutzerklärung',
      backToTop: 'Back to top',
      allRights: '© 2025 TMX. All rights reserved.',
      socialAriaLinkedIn: 'TMX on LinkedIn',
      socialAriaInstagram: 'TMX on Instagram',
      socialAriaXing: 'TMX on Xing',
    },
  },
};
