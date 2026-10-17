import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { localizedMetadata, resolveLocale } from '@/lib/seo';
import { getContactPage } from '@/lib/content';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'meta' });
  const page = await getContactPage(locale);

  return localizedMetadata({
    locale,
    href: '/kontakt',
    title: t('kontaktTitle'),
    description: page?.metaDescription,
  });
}

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
