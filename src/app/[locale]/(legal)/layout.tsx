/**
 * Layout for legal pages (Impressum, Datenschutz, Kontakt).
 *
 * Header, Footer and LanguageToggle come from src/app/[locale]/layout.tsx and
 * are rendered once. No SmoothScrollProvider (Lenis / ScrollTrigger / GSAP)
 * here — that lives in the (site) group, which only wraps the home page.
 *
 * Do NOT render next-intl's `Link` (or other locale-aware server components)
 * in this server layout: without setRequestLocale in this scope it resolves
 * the locale through headers() and turns every legal route dynamic.
 */

import type { ReactNode } from 'react';

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    // No top padding here: Next scrolls a new route to its first element, so any
    // offset would land the page below the top. Pages' own py-16 (64px) already
    // clears the fixed global Header (~61px).
    <div className="min-h-screen bg-[#050508] text-white">
      {children}
    </div>
  );
}
