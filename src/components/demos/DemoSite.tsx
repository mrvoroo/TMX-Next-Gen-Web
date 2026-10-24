import dynamic from 'next/dynamic';
import type { DemoLang, DemoSlug } from '@/config/demos';
import { NordwindSite } from './nordwind/NordwindSite';
import { FeldgruenSite } from './feldgruen/FeldgruenSite';
import { LindenhofSite } from './lindenhof/LindenhofSite';
import { KernwerkSite } from './kernwerk/KernwerkSite';

// The 3D demo ships three.js – its own chunk, only loaded on /demo/*/volta.
const VoltaSite = dynamic(() => import('./volta/VoltaSite').then((m) => m.VoltaSite));

/** Maps a demo slug to its site component. */
export function DemoSite({ lang, slug }: { lang: DemoLang; slug: DemoSlug }) {
  switch (slug) {
    case 'nordwind':
      return <NordwindSite lang={lang} />;
    case 'feldgruen':
      return <FeldgruenSite lang={lang} />;
    case 'lindenhof':
      return <LindenhofSite lang={lang} />;
    case 'kernwerk':
      return <KernwerkSite lang={lang} />;
    case 'volta':
      return <VoltaSite lang={lang} />;
  }
}
