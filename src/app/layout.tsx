import type { Metadata } from 'next';
import './globals.css';
import { LocaleProvider } from '@/lib/i18n/LocaleContext';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { Header } from '@/components/layout/Header';

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // lang is set dynamically by LocaleContext on the client; default is 'de'
    <html lang="de" className="dark h-full">
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
        <LocaleProvider>
          <SmoothScrollProvider>
            <Header />
            <main>{children}</main>
          </SmoothScrollProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
