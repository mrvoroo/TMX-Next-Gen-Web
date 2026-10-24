'use client';

/**
 * Interactive example for "Betreuung digitaler Werbekampagnen": a four-stage
 * funnel (impressions → enquiries) with a platform filter. Each stage shows
 * the count, the step rate and – for "all" – which platforms it comes from.
 * All numbers are fictional.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { animate, motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useLocale } from 'next-intl';
import { PLATFORMS, PLATFORM_NAMES, useMarketingText, type Platform } from '@/lib/i18n/marketing-examples';
import type { Locale } from '@/lib/i18n/translations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';
import { ChartPanel, DataTable, PLATFORM_COLORS, Swatch } from './ChartParts';

type Filter = 'all' | Platform;

/** Fictional 30-day values: impressions, clicks, page visits, enquiries. */
const DATA: Record<Platform, [number, number, number, number]> = {
  instagram: [182000, 2900, 2380, 61],
  facebook: [154000, 2150, 1720, 58],
  tiktok: [236000, 3070, 2210, 33],
  snapchat: [88000, 970, 640, 9],
  pinterest: [64000, 1150, 960, 24],
  linkedin: [41000, 370, 330, 17],
};

const sumStage = (i: number) => PLATFORMS.reduce((s, p) => s + DATA[p][i], 0);

function AnimatedNumber({ value, format, reduced }: { value: number; format: (n: number) => string; reduced: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.textContent = format(value);
      prev.current = value;
      return;
    }
    const controls = animate(prev.current, value, {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => (el.textContent = format(Math.round(v))),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, format, reduced]);
  return <span ref={ref}>{format(value)}</span>;
}

export function AdFunnelDemo() {
  const t = useMarketingText();
  const f = t.funnel;
  const locale = useLocale() as Locale;
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<Filter>('all');

  const tag = locale === 'de' ? 'de-DE' : 'en-GB';
  const nf = useMemo(() => new Intl.NumberFormat(tag), [tag]);
  const pf = useMemo(() => new Intl.NumberFormat(tag, { minimumFractionDigits: 1, maximumFractionDigits: 1 }), [tag]);
  const fmt = useCallback((n: number) => nf.format(n), [nf]);

  const values = [0, 1, 2, 3].map((i) => (filter === 'all' ? sumStage(i) : DATA[filter][i]));
  const rates = [1, 2, 3].map((i) => (values[i] / values[i - 1]) * 100);
  const tr = reduced ? { duration: 0 } : { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <ChartPanel
      title={f.title}
      note={f.note}
      table={
        <DataTable
          head={[f.stage, f.value, f.rate]}
          rows={f.stages.map((s, i) => [s, nf.format(values[i]), i === 0 ? '–' : `${pf.format(rates[i - 1])} %`])}
        />
      }
    >
      <div role="group" aria-label={f.filter} className="mb-6 flex flex-wrap gap-1.5">
        {(['all', ...PLATFORMS] as Filter[]).map((p) => (
          <button
            key={p}
            type="button"
            aria-pressed={filter === p}
            onClick={() => setFilter(p)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500',
              filter === p ? 'border-white/40 bg-white/10 text-white' : 'border-white/10 text-white/55 hover:text-white',
            )}
          >
            {p !== 'all' && <Swatch color={PLATFORM_COLORS[p]} />}
            {p === 'all' ? f.all : PLATFORM_NAMES[p]}
          </button>
        ))}
      </div>

      <ol className="grid gap-5 lg:grid-cols-4 lg:gap-0">
        {f.stages.map((stage, i) => (
          <li key={stage} className="flex min-w-0">
            <div className="relative flex min-w-0 flex-1 flex-col rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 lg:mx-1.5">
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-3 left-1/2 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border border-white/10 bg-[#100f17] text-white/40 lg:-left-3 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-0"
                >
                  <ChevronRight size={12} className="rotate-90 lg:rotate-0" />
                </span>
              )}
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                <span className="mr-1.5 text-white/25">0{i + 1}</span>
                {stage}
              </p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-white sm:text-3xl">
                <AnimatedNumber value={values[i]} format={fmt} reduced={reduced} />
              </p>
              {i > 0 ? (
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-[11px] text-white/45">
                    <span title={f.ofPrevious}>{f.rates[i - 1]}</span>
                    <span className="tabular-nums text-white/75">{pf.format(rates[i - 1])} %</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                    <motion.div
                      initial={false}
                      animate={{ width: `${Math.max(rates[i - 1], 1.5)}%` }}
                      transition={tr}
                      className="h-full rounded-full bg-violet-400"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-3 hidden h-[30px] lg:block" aria-hidden="true" />
              )}
              {/* Where this stage comes from — 2px gaps keep segments apart. */}
              <div className="mt-4 flex h-2 w-full gap-[2px] overflow-hidden rounded-full" aria-hidden="true">
                {PLATFORMS.map((p) => {
                  const share = filter === 'all' ? DATA[p][i] : p === filter ? 1 : 0;
                  return (
                    <motion.span
                      key={p}
                      initial={false}
                      animate={{ flexGrow: share }}
                      transition={tr}
                      className="h-full min-w-0 basis-0"
                      style={{ background: PLATFORM_COLORS[p] }}
                    />
                  );
                })}
              </div>
            </div>
          </li>
        ))}
      </ol>

      {filter === 'all' && (
        <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5" aria-label={f.filter}>
          {PLATFORMS.map((p) => (
            <li key={p} className="flex items-center gap-1.5 text-[11px] text-white/55">
              <Swatch color={PLATFORM_COLORS[p]} />
              {PLATFORM_NAMES[p]}
            </li>
          ))}
        </ul>
      )}
    </ChartPanel>
  );
}
