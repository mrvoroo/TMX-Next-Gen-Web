'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/* ── Stat definitions — keys point into the shared translation dict ───────── */
const STAT_KEYS = [
  { valueKey: 'stats.projects',     labelKey: 'stats.projectsLabel'     },
  { valueKey: 'stats.clients',      labelKey: 'stats.clientsLabel'      },
  { valueKey: 'stats.years',        labelKey: 'stats.yearsLabel'        },
  { valueKey: 'stats.satisfaction', labelKey: 'stats.satisfactionLabel' },
] as const;

/* ── Helpers ──────────────────────────────────────────────────────────────── */
/**
 * Splits "150+" → { numeric: 150, suffix: "+" }
 * Splits "99%"  → { numeric: 99,  suffix: "%" }
 */
function parseStatValue(str: string): { numeric: number; suffix: string } {
  const match = str.match(/^(\d+)([^\d]*)$/);
  if (!match) return { numeric: 0, suffix: '' };
  return { numeric: parseInt(match[1], 10), suffix: match[2] };
}

/* ── Component ────────────────────────────────────────────────────────────── */
export function StatsStrip() {
  const { t } = useTranslation();
  const reduced  = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  // One ref per number span (the digits only — suffix is a sibling element)
  const numRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    // Build the parsed values inside the effect so GSAP sees the live translation
    const parsed = STAT_KEYS.map(k => parseStatValue(t(k.valueKey)));

    const ctx = gsap.context(() => {
      parsed.forEach(({ numeric }, i) => {
        const el = numRefs.current[i];
        if (!el) return;

        if (reduced) {
          // Skip animation — show final value immediately
          el.textContent = String(numeric);
          return;
        }

        const counter = { val: 0 };

        gsap.to(counter, {
          val: numeric,
          duration: 2.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',   // fires when the number is 88% down the viewport
            toggleActions: 'play none none none', // play once; don't reverse on scroll back
          },
          onUpdate() {
            el.textContent = String(Math.round(counter.val));
          },
          onComplete() {
            // Lock to exact final value to avoid any float rounding artifact
            el.textContent = String(numeric);
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
    // Re-run when locale changes (t is stable per locale via useCallback)
    // Re-run when reduced-motion setting changes
  }, [t, reduced]);

  return (
    <section
      ref={sectionRef}
      id="stats"
      aria-label="Zahlen & Fakten"
      className="relative border-y border-white/[0.06] bg-white/[0.025] py-16 sm:py-20"
    >
      {/* Subtle top-edge accent line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, #7c3aed44 30%, #06b6d444 70%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-2 gap-y-12 gap-x-6 md:grid-cols-4 md:gap-x-0">
          {STAT_KEYS.map((keys, i) => {
            const raw                   = t(keys.valueKey);
            const { numeric, suffix }   = parseStatValue(raw);
            const isLast                = i === STAT_KEYS.length - 1;

            return (
              <div
                key={keys.valueKey}
                className="relative flex flex-col items-center text-center"
              >
                {/* Big number + suffix — min-w locks width during count-up to prevent CLS */}
                <div className="flex items-end gap-0.5 leading-none">
                  <span
                    ref={el => { numRefs.current[i] = el; }}
                    className="gradient-text text-5xl font-black tabular-nums sm:text-6xl lg:text-7xl min-w-[3ch] text-right"
                    aria-label={raw}
                  >
                    {/* Initial value shown before JS runs / before ScrollTrigger fires */}
                    {reduced ? numeric : 0}
                  </span>
                  <span
                    className="gradient-text mb-1 text-2xl font-black sm:text-3xl lg:text-4xl"
                    aria-hidden="true"
                  >
                    {suffix}
                  </span>
                </div>

                {/* Label — pulled from translation dict, auto-switches on DE/EN toggle */}
                <p className="mt-3 max-w-[10rem] text-xs font-medium uppercase tracking-widest text-white/45 sm:text-sm">
                  {t(keys.labelKey)}
                </p>

                {/* Vertical divider between columns — desktop only, not after last item */}
                {!isLast && (
                  <div
                    className="absolute -right-px top-1/2 hidden h-12 w-px -translate-y-1/2 md:block"
                    style={{
                      background:
                        'linear-gradient(to bottom, transparent, rgba(255,255,255,0.12), transparent)',
                    }}
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Subtle bottom-edge accent line */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, #7c3aed44 30%, #06b6d444 70%, transparent 100%)',
        }}
        aria-hidden="true"
      />
    </section>
  );
}
