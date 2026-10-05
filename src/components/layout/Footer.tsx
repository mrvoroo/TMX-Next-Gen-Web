'use client';

/**
 * Global Footer component.
 *
 * Rendered in the root layout (src/app/layout.tsx) so it appears on every page.
 * Uses the same `useTranslation` hook as the Header for full DE/EN support.
 *
 * Links:
 *   - /impressum, /datenschutz  ← real routes (built as app/(legal)/)
 *   - "Cookie-Einstellungen" button — stub only
 *     TODO: wire to CookieConsent once built
 *   - Social placeholders from src/config/company.ts
 *   - MrVoroo credit link → https://github.com/mrvoroo
 */

import Link from 'next/link';
import { SOCIAL_LINKEDIN, SOCIAL_INSTAGRAM, SOCIAL_XING } from '@/config/company';
import { useTranslation } from '@/lib/i18n/useTranslation';

/* ── Minimal SVG icons (inline, no extra package) ────────────────────────── */
function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function IconXing() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M18.188 0c-.517 0-.741.325-.927.66 0 0-7.455 13.224-7.702 13.657.015.024 4.919 9.023 4.919 9.023.17.308.436.66.967.66h3.454c.211 0 .375-.078.463-.22.089-.151.089-.346-.009-.536l-4.879-8.916c-.004-.006-.004-.016 0-.022L22.139.756c.095-.191.097-.387.006-.535C22.056.078 21.894 0 21.686 0h-3.498zM3.648 4.74c-.211 0-.385.074-.473.216-.09.149-.078.339.02.531l2.34 4.05c.004.01.004.016 0 .021L1.86 16.051c-.099.188-.093.381 0 .529.085.142.239.234.45.234h3.461c.518 0 .766-.348.945-.667l3.734-6.609-2.378-4.155c-.172-.315-.434-.643-.962-.643H3.648z" />
    </svg>
  );
}

/* ── Component ───────────────────────────────────────────────────────────── */
export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-white/10 bg-[#050508]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">

        {/* Top row */}
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">

          {/* Brand + tagline */}
          <div className="max-w-xs">
            <Link
              href="/"
              className="gradient-text text-xl font-black tracking-tight"
              aria-label="TMX – zur Startseite"
            >
              TMX
            </Link>
            <p className="mt-2 text-sm text-white/40">{t('footer.tagline')}</p>
          </div>

          {/* Legal links */}
          <nav aria-label="Rechtliche Links">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">
              {t('footer.legal')}
            </p>
            <ul className="space-y-2 text-sm text-white/50">
              <li>
                <Link href="/impressum" className="transition-colors hover:text-white">
                  {t('footer.impressum')}
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="transition-colors hover:text-white">
                  {t('footer.datenschutz')}
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="transition-colors hover:text-white">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                {/*
                  TODO: wire to CookieConsent once built.
                  Currently a visual stub — clicking does nothing.
                  Replace with the real open-banner handler when CookieConsent exists.
                */}
                <button
                  type="button"
                  className="cursor-pointer text-left transition-colors hover:text-white text-white/50"
                  onClick={() => {
                    /* TODO: wire to CookieConsent once built */
                    console.info('[Cookie-Einstellungen] CookieConsent not yet implemented.');
                  }}
                >
                  Cookie-Einstellungen
                </button>
              </li>
            </ul>
          </nav>

          {/* Social */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">
              Social
            </p>
            <div className="flex items-center gap-4">
              {/* LinkedIn */}
              <a
                href={SOCIAL_LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 transition-colors hover:text-white"
                aria-label={t('footer.socialAriaLinkedIn')}
              >
                <IconLinkedIn />
              </a>
              {/* Instagram */}
              <a
                href={SOCIAL_INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 transition-colors hover:text-white"
                aria-label={t('footer.socialAriaInstagram')}
              >
                <IconInstagram />
              </a>
              {/* Xing */}
              <a
                href={SOCIAL_XING}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 transition-colors hover:text-white"
                aria-label={t('footer.socialAriaXing')}
              >
                <IconXing />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-white/5" />

        {/* Bottom row */}
        <div className="flex flex-col items-center gap-3 text-xs text-white/25 sm:flex-row sm:justify-between">
          <p>{t('footer.allRights')}</p>

          {/* MrVoroo credit */}
          <p>
            Built by{' '}
            <a
              href="https://github.com/mrvoroo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 underline underline-offset-2 transition-colors hover:text-white"
            >
              MrVoroo
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
