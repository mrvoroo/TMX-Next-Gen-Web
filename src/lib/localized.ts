/**
 * Localized CMS values. Every translatable Keystatic field is stored as
 * { en, de } (see `localized()` in keystatic.config.ts).
 */

export type Locale = 'de' | 'en';

export interface Localized {
  readonly en: string;
  readonly de: string;
}

/** Replaces every { en, de } leaf of T with a plain string. */
export type Resolved<T> = T extends Localized
  ? string
  : T extends readonly (infer U)[]
    ? Resolved<U>[]
    : T extends object
      ? { [K in keyof T]: Resolved<T[K]> }
      : T;

/**
 * The value for `locale`. With `fallbackToDe`, an empty EN value falls back
 * to the German one.
 */
export function pick(
  value: Localized,
  locale: Locale,
  fallbackToDe = false,
): string {
  if (locale === 'en' && fallbackToDe && value.en.trim() === '') return value.de;
  return value[locale];
}

function isLocalized(value: unknown): value is Localized {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const keys = Object.keys(value);
  return (
    keys.length === 2 &&
    typeof (value as Localized).en === 'string' &&
    typeof (value as Localized).de === 'string'
  );
}

/** pick() applied to every { en, de } leaf of a nested content object. */
export function pickAll<T>(value: T, locale: Locale): Resolved<T> {
  if (isLocalized(value)) return pick(value, locale) as Resolved<T>;
  if (Array.isArray(value)) {
    return value.map((item) => pickAll(item, locale)) as Resolved<T>;
  }
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, pickAll(item, locale)]),
    ) as Resolved<T>;
  }
  return value as Resolved<T>;
}
