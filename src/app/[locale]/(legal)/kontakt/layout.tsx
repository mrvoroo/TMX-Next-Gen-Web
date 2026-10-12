import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { localizedMetadata, resolveLocale } from '@/lib/seo';

// page.tsx is a client component and cannot export metadata, so it lives here.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'meta' });

  return localizedMetadata({
    locale,
    href: '/kontakt',
    title: t('kontaktTitle'),
  });
}

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
