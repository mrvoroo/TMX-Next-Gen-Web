import { useCallback } from 'react';
import { useLocale } from './LocaleContext';
import { translations, type TranslationSchema } from './translations';

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeyOf<T[K]>}` | K
          : K
        : never;
    }[keyof T]
  : never;

type TranslationKey = NestedKeyOf<TranslationSchema>;

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== 'object') return path;
    current = (current as Record<string, unknown>)[key];
  }
  if (typeof current === 'string') return current;
  return path;
}

export function useTranslation() {
  const { locale, setLocale } = useLocale();

  // Memoised so `t` is the same reference between renders —
  // only changes when `locale` changes. Safe to use in useEffect deps.
  const t = useCallback(
    (key: TranslationKey): string =>
      getNestedValue(
        translations[locale] as unknown as Record<string, unknown>,
        key,
      ),
    [locale],
  );

  return { t, locale, setLocale };
}
