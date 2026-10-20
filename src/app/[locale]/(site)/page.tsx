/**
 * Home — Server Component (static). Reads the Keystatic "servicesSection"
 * singleton + visible "services" entries for the current locale and passes
 * plain props to the client page (preloader, animated sections).
 */

import { setRequestLocale } from 'next-intl/server';
import { resolveLocale } from '@/lib/seo';
import { getServicesSection } from '@/lib/content';
import HomeClient from './HomeClient';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  setRequestLocale(rawLocale);
  const locale = resolveLocale(rawLocale);
  const services = await getServicesSection(locale);

  return <HomeClient services={services} />;
}
