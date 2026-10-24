'use client';

/**
 * Interactive example for "Datenanalyse und Auswertung mit KI-Unterstützung":
 * a 12-week bar chart with pre-written insights. Selecting an insight
 * highlights the weeks it refers to. No live AI and no real data.
 */

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useMarketingText } from '@/lib/i18n/marketing-examples';
import type { Locale } from '@/lib/i18n/translations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';
import { ChartPanel, DataTable, Segmented } from './ChartParts';

type Metric = 'leads' | 'revenue';

const DATA: Record<Metric, number[]> = {
  leads: [38, 41, 67, 44, 47, 49, 26, 51, 55, 63, 66, 71],
  revenue: [4200, 4600, 7900, 5100, 5300, 5600, 2900, 6000, 6400, 7300, 7600, 8200],
};
/** Insight i → highlighted week indexes. */
const FOCUS: number[][] = [[6], [8, 9, 10, 11], [2]];

export function InsightsDemo() {
  const t = useMarketingText().insights;
  const locale = useLocale() as Locale;
  const reduced = useReducedMotion();
  const [metric, setMetric] = useState<Metric>('leads');
  const [active, setActive] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  const tag = locale === 'de' ? 'de-DE' : 'en-IE';
  const fmt = useMemo(
    () =>
      metric === 'revenue'
        ? new Intl.NumberFormat(tag, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
        : new Intl.NumberFormat(tag),
    [metric, tag],
  );

  const values = DATA[metric];
  const max = Math.max(...values) * 1.1;
  const avg = values.reduce((s, v) => s + v, 0) / values.length;
  const focus = active === null ? null : FOCUS[active];
  const tr = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 220, damping: 28 };

  return (
    <ChartPanel
      title={t.title}
      note={t.note}
      controls={
        <Segmented
          label={t.metric}
          value={metric}
          onChange={setMetric}
          options={[
            { value: 'leads', label: t.metrics.leads },
            { value: 'revenue', label: t.metrics.revenue },
          ]}
        />
      }
      table={<DataTable head={[t.week, t.metrics[metric]]} rows={values.map((v, i) => [`${t.week} ${i + 1}`, fmt.format(v)])} />}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <figure className="min-w-0">
          <figcaption className="sr-only">
            {t.title} – {t.metrics[metric]}
          </figcaption>
          <div className="relative h-56 sm:h-64" onMouseLeave={() => setHover(null)}>
            {/* Average line */}
            <motion.div
              aria-hidden="true"
              initial={false}
              animate={{ bottom: `${(avg / max) * 100}%` }}
              transition={tr}
              className="pointer-events-none absolute inset-x-0 z-10 border-t border-dashed border-white/25"
            >
              <span className="absolute -top-5 left-0 rounded bg-[#100f17] px-1 text-[10px] text-white/50">
                Ø {fmt.format(Math.round(avg))}
              </span>
            </motion.div>
            <div className="absolute inset-0 flex items-end gap-[3px] border-b border-white/10 sm:gap-1.5">
              {values.map((v, i) => {
                const lit = focus ? focus.includes(i) : true;
                return (
                  <button
                    key={i}
                    type="button"
                    onMouseEnter={() => setHover(i)}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover(null)}
                    aria-label={`${t.week} ${i + 1}: ${fmt.format(v)}`}
                    className="group relative flex h-full min-w-0 flex-1 items-end focus-visible:outline-none"
                  >
                    <motion.span
                      initial={false}
                      animate={{ height: `${(v / max) * 100}%`, opacity: lit ? 1 : 0.25 }}
                      transition={tr}
                      className={cn(
                        'block w-full rounded-t-[4px] bg-violet-500 group-hover:bg-violet-400 group-focus-visible:ring-2 group-focus-visible:ring-white',
                        focus?.includes(i) && 'bg-cyan-400 group-hover:bg-cyan-300',
                      )}
                    />
                    {(hover === i || (focus?.length === 1 && focus[0] === i)) && (
                      <span
                        className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-[#1b1a24] px-2 py-1 text-[10px] tabular-nums text-white shadow-lg"
                        style={{ bottom: `calc(${(v / max) * 100}% + 6px)` }}
                      >
                        {t.weekShort} {i + 1} · {fmt.format(v)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-1.5 flex gap-[3px] sm:gap-1.5" aria-hidden="true">
            {values.map((_, i) => (
              <span key={i} className="min-w-0 flex-1 text-center text-[9px] tabular-nums text-white/35 sm:text-[10px]">
                {i + 1}
              </span>
            ))}
          </div>
        </figure>

        <div>
          <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
            <Lightbulb size={12} aria-hidden="true" />
            {t.insightsLabel}
          </p>
          <ul className="space-y-2">
            {t.items.map((it, i) => (
              <li key={it.title}>
                <button
                  type="button"
                  aria-pressed={active === i}
                  onClick={() => setActive((a) => (a === i ? null : i))}
                  className={cn(
                    'w-full rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500',
                    active === i ? 'border-cyan-400/50 bg-cyan-400/[0.07]' : 'border-white/[0.07] bg-white/[0.02] hover:border-white/20',
                  )}
                >
                  <p className="text-xs font-semibold text-white">{it.title}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-white/55">{it.text}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ChartPanel>
  );
}
