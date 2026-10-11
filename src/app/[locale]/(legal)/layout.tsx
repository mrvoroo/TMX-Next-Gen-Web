/**
 * Minimal layout for legal pages (Impressum, Datenschutz, Kontakt).
 *
 * Intentionally stripped of:
 *   - SmoothScrollProvider (Lenis + ScrollTrigger)
 *   - GSAP context
 *   - Any heavy animation providers
 *
 * This keeps legal routes fast (<100 kB JS) and free of GSAP cleanup
 * races that caused earlier bugs on the main layout.
 *
 * The root RootLayout still wraps this (html/body/fonts/meta), so we
 * only need to add what's different: a simple sticky nav + main area.
 */

import Link from 'next/link';
import type { ReactNode } from 'react';

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#050508] text-white">
      {/* Minimal header — no GSAP, no Lenis, just a back-to-home link */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050508]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="gradient-text text-xl font-black tracking-tight"
            aria-label="TMX – zur Startseite"
          >
            TMX
          </Link>
          <Link
            href="/"
            className="text-sm text-white/50 transition-colors hover:text-white"
          >
            ← Startseite
          </Link>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
