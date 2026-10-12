/**
 * Layout for the animated home page only.
 *
 * Lenis smooth scroll + GSAP ScrollTrigger live here and nowhere else, so
 * they are created on entering the home route and destroyed on leaving it.
 * Header/Footer are rendered once by src/app/[locale]/layout.tsx.
 */

import type { ReactNode } from 'react';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SmoothScrollProvider>{children}</SmoothScrollProvider>;
}
