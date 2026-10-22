/**
 * Home — Server Component (static). Reads the Keystatic home singletons
 * (hero, about, services, process, why-us) + visible "services" entries for the
 * current locale and passes plain props to the client page (preloader,
 * animated sections).
 */

import { setRequestLocale } from 'next-intl/server';
import { resolveLocale } from '@/lib/seo';
import {
  getHeroSection,
  getAboutSection,
  getProcessSection,
  getServicesSection,
  getWhyUsSection,
} from '@/lib/content';
import HomeClient from './HomeClient';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  setRequestLocale(rawLocale);
  const locale = resolveLocale(rawLocale);
  const [hero, about, services, process, whyUs] = await Promise.all([
    getHeroSection(locale),
    getAboutSection(locale),
    getServicesSection(locale),
    getProcessSection(locale),
    getWhyUsSection(locale),
  ]);

  return (
    <HomeClient
      hero={hero}
      about={about}
      services={services}
      process={process}
      whyUs={whyUs}
    />
  );
}
