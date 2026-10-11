import type { Metadata } from 'next';
import '../globals.css';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SITE_INDEXABLE } from '@/config/site';

export const metadata: Metadata = {
  title: 'TMX — Digitale Exzellenz',
  description:
    'TMX ist Ihre full-service Digitalagentur für Webentwicklung, KI, digitales Marketing und IT-Beratung. Messbare Ergebnisse, nachhaltige Lösungen.',
  keywords: [
    'Digitalagentur',
    'Webentwicklung',
    'Künstliche Intelligenz',
    'Digitales Marketing',
    'IT-Beratung',
    'Digital Agency',
  ],
  metadataBase: new URL('https://tmx.de'),
  robots: SITE_INDEXABLE
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

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
          <SmoothScrollProvider>
            <Header />
            <main>{children}</main>
          </SmoothScrollProvider>
          {/* Footer is outside SmoothScrollProvider intentionally — no Lenis/GSAP context needed */}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
