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

/** Dynamic-segment values per locale (localized slugs). */
type ParamsFor = (locale: AppLocale) => Record<string, string>;

function localizedUrl(
  locale: AppLocale,
  href: AppPathname,
  params?: ParamsFor,
): string {
  const target = params ? { pathname: href, params: params(locale) } : href;
  return `${SITE_URL}${getPathname({ locale, href: target as never })}`;
}

/**
 * Canonical, hreflang (de, en, x-default) and openGraph for one page.
 * Spread into the result of generateMetadata.
 */
export function localizedMetadata({
  locale,
  href,
  params,
  title,
  description,
}: {
  locale: string;
  href: AppPathname;
  /** Required for pathnames with a dynamic segment, e.g. the pillar pages. */
  params?: ParamsFor;
  title: string;
  description?: string;
}): Metadata {
  const current = resolveLocale(locale);
  const url = localizedUrl(current, href, params);

  return {
    title,
    ...(description ? { description } : {}),
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [l, localizedUrl(l, href, params)]),
        ),
        'x-default': localizedUrl(routing.defaultLocale, href, params),
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
