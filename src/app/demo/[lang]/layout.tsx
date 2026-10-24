/**
 * Root layout of the concept demo sites (/demo/<lang>/<slug>).
 * Own <html> (no TMX header/footer, no consent banner: demos set no cookies,
 * use no storage and load nothing from third parties). Always noindex.
 */
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import '../../globals.css';
import { DEMO_LANGS, isDemoLang } from '@/config/demos';
import { SITE_URL } from '@/config/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return DEMO_LANGS.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  robots: { index: false, follow: true },
};

export default async function DemoRootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isDemoLang(lang)) notFound();
  return (
    <html lang={lang} className="h-full">
      <head>
        <link rel="preload" href="/fonts/inter-variable.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
