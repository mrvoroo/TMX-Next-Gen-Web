import type { Metadata } from 'next';
import '../globals.css';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ConsentBanner } from '@/components/ui/ConsentBanner';
import { ConsentScripts } from '@/components/providers/ConsentScripts';
import { getConsentBanner } from '@/lib/content';
import { SITE_INDEXABLE, SITE_URL } from '@/config/site';
import { localizedMetadata, resolveLocale } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    ...localizedMetadata({
      locale,
      href: '/',
      title: t('title'),
      description: t('description'),
    }),
    keywords: [
      'Digitalagentur',
      'Webentwicklung',
      'Künstliche Intelligenz',
      'Digitales Marketing',
      'IT-Beratung',
      'Digital Agency',
    ],
    metadataBase: new URL(SITE_URL),
    robots: SITE_INDEXABLE
      ? { index: true, follow: true }
      : { index: false, follow: false },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const consentBanner = await getConsentBanner(resolveLocale(locale));

  return (
    <html lang={locale} className="dark h-full">
      {/*
        Font preload — must be in <head> before any CSS so the browser starts
        fetching inter-variable.woff2 during HTML parsing, before @font-face
        rules are encountered. Without this, font-display:swap causes a layout
        shift when the font loads and replaces the system fallback.
      */}
      <head>
        <link
          rel="preload"
          href="/fonts/inter-variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full antialiased" suppressHydrationWarning>
        <NextIntlClientProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          {consentBanner ? <ConsentBanner content={consentBanner} /> : null}
          <ConsentScripts />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
