import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/config/site';

type AppLocale = (typeof routing.locales)[number];
type AppPathname = keyof typeof routing.pathnames;

const OG_LOCALE: Record<AppLocale, string> = {
  de: 'de_DE',
  en: 'en_US',
};

export function resolveLocale(locale: string): AppLocale {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}

function localizedUrl(locale: AppLocale, href: AppPathname): string {
  return `${SITE_URL}${getPathname({ locale, href })}`;
}

/**
 * Canonical, hreflang (de, en, x-default) and openGraph for one page.
 * Spread into the result of generateMetadata.
 */
export function localizedMetadata({
  locale,
  href,
  title,
  description,
}: {
  locale: string;
  href: AppPathname;
  title: string;
  description?: string;
}): Metadata {
  const current = resolveLocale(locale);
  const url = localizedUrl(current, href);

  return {
    title,
    ...(description ? { description } : {}),
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [l, localizedUrl(l, href)]),
        ),
        'x-default': localizedUrl(routing.defaultLocale, href),
      },
    },
    openGraph: {
      title,
      ...(description ? { description } : {}),
      url,
      locale: OG_LOCALE[current],
    },
  };
}
