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
      <head />
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
