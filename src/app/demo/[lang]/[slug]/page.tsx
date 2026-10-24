import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DEMOS, DEMO_LANGS, DEMO_SLUGS, demoPath, isDemoLang, isDemoSlug } from '@/config/demos';
import { SITE_URL } from '@/config/site';
import { DemoShell } from '@/components/demos/DemoShell';
import { DemoSite } from '@/components/demos/DemoSite';

export const dynamicParams = false;

export function generateStaticParams() {
  return DEMO_LANGS.flatMap((lang) => DEMO_SLUGS.map((slug) => ({ lang, slug })));
}

type Params = Promise<{ lang: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isDemoLang(lang) || !isDemoSlug(slug)) return {};
  const d = DEMOS[slug];
  const concept = lang === 'de' ? 'Konzeptprojekt von TMX' : 'Concept project by TMX';
  return {
    title: `${d.brand} – ${concept}`,
    description: `${d.kind[lang]}. ${lang === 'de' ? 'Fiktive Marke, keine echte Firma.' : 'Fictional brand, not a real company.'}`,
    robots: { index: false, follow: true },
    alternates: {
      canonical: `${SITE_URL}${demoPath(lang, slug)}`,
      languages: Object.fromEntries(DEMO_LANGS.map((l) => [l, `${SITE_URL}${demoPath(l, slug)}`])),
    },
  };
}

export default async function DemoPage({ params }: { params: Params }) {
  const { lang, slug } = await params;
  if (!isDemoLang(lang) || !isDemoSlug(slug)) notFound();
  return (
    <DemoShell lang={lang} slug={slug}>
      <DemoSite lang={lang} slug={slug} />
    </DemoShell>
  );
}
