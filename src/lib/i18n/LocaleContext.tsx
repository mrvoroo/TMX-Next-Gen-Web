'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { type Locale } from './translations';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'de',
  setLocale: () => {},
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('de');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('tmx-locale') as Locale | null;
    if (stored === 'de' || stored === 'en') {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    localStorage.setItem('tmx-locale', next);
    // Update html lang attribute for accessibility & SEO
    if (typeof document !== 'undefined') {
      document.documentElement.lang = next;
    }
  };

  // Avoid hydration mismatch: render with default 'de' on server,
  // then hydrate with stored value after mount.
  if (!mounted) {
    return (
      <LocaleContext.Provider value={{ locale: 'de', setLocale }}>
        {children}
      </LocaleContext.Provider>
    );
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
