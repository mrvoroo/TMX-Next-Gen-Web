'use client';

/**
 * Interactive example for "Media Buying": the visitor sets a monthly budget,
 * a goal and an audience and sees an illustrative split across the six
 * platforms. Weights are fictional – no quote, no forecast.
 */

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { PLATFORMS, PLATFORM_NAMES, useMarketingText, type Platform } from '@/lib/i18n/marketing-examples';
import type { Locale } from '@/lib/i18n/translations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ChartPanel, DataTable, PLATFORM_COLORS, Segmented, Swatch } from './ChartParts';

type Goal = 'reach' | 'leads' | 'sales';
type Audience = 'b2c' | 'b2b';

const WEIGHTS: Record<Goal, Record<Platform, number>> = {
  reach: { instagram: 26, facebook: 18, tiktok: 28, snapchat: 14, pinterest: 10, linkedin: 4 },
  leads: { instagram: 30, facebook: 30, tiktok: 14, snapchat: 6, pinterest: 12, linkedin: 8 },
  sales: { instagram: 32, facebook: 26, tiktok: 16, snapchat: 6, pinterest: 16, linkedin: 4 },
};
const B2B_FACTOR: Record<Platform, number> = {
  instagram: 0.8,
  facebook: 1,
  tiktok: 0.6,
  snapchat: 0.3,
  pinterest: 0.5,
  linkedin: 6,
};

/** Integer percentages that always add up to 100 (largest remainder). */
function toPercents(weights: Record<Platform, number>) {
  const total = PLATFORMS.reduce((s, p) => s + weights[p], 0);
  const raw = PLATFORMS.map((p) => ({ p, v: (weights[p] / total) * 100 }));
  const out = raw.map((r) => ({ p: r.p, pct: Math.floor(r.v), rest: r.v - Math.floor(r.v) }));
  let missing = 100 - out.reduce((s, o) => s + o.pct, 0);
  [...out].sort((a, b) => b.rest - a.rest).forEach((o) => {
    if (missing > 0) {
      o.pct += 1;
      missing -= 1;
    }
  });
  return out;
}

export function BudgetMixDemo() {
  const t = useMarketingText().budget;
  const locale = useLocale() as Locale;
  const reduced = useReducedMotion();
  const [budget, setBudget] = useState(2500);
  const [goal, setGoal] = useState<Goal>('leads');
  const [audience, setAudience] = useState<Audience>('b2c');

  const eur = useMemo(
    () => new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }),
    [locale],
  );

  const rows = useMemo(() => {
    const w = { ...WEIGHTS[goal] };
    if (audience === 'b2b') PLATFORMS.forEach((p) => (w[p] *= B2B_FACTOR[p]));
    return toPercents(w)
      .map((r) => ({ ...r, amount: Math.round((budget * r.pct) / 100 / 10) * 10 }))
      .sort((a, b) => b.pct - a.pct || PLATFORMS.indexOf(a.p) - PLATFORMS.indexOf(b.p));
  }, [goal, audience, budget]);

  const max = rows[0].pct;
  const tr = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 260, damping: 30 };

  return (
    <ChartPanel
      title={t.title}
      note={t.note}
      controls={
        <>
          <Segmented
            label={t.goal}
            value={goal}
            onChange={setGoal}
            options={[
              { value: 'reach', label: t.goals.reach },
              { value: 'leads', label: t.goals.leads },
              { value: 'sales', label: t.goals.sales },
            ]}
          />
          <Segmented
            label={t.audience}
            value={audience}
            onChange={setAudience}
            options={[
              { value: 'b2c', label: t.audiences.b2c },
              { value: 'b2b', label: t.audiences.b2b },
            ]}
          />
        </>
      }
      table={
        <DataTable
          head={[t.platform, t.share, t.amount]}
          rows={rows.map((r) => [PLATFORM_NAMES[r.p], `${r.pct} %`, eur.format(r.amount)])}
        />
      }
    >
      <div className="mb-6">
        <div className="mb-2 flex items-baseline justify-between gap-4">
          <label htmlFor="budget-mix-range" className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
            {t.budget}
          </label>
          <p className="text-lg font-bold tabular-nums text-white">
            {eur.format(budget)} <span className="text-xs font-normal text-white/40">{t.perMonth}</span>
          </p>
        </div>
        <input
          id="budget-mix-range"
          type="range"
          min={500}
          max={10000}
          step={250}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          aria-valuetext={eur.format(budget)}
          className="w-full accent-violet-500 [color-scheme:dark]"
        />
      </div>

      {/* 100 % stacked overview — 2px surface gaps between segments. */}
      <div className="flex h-3 w-full gap-[2px] overflow-hidden rounded-full" aria-hidden="true">
        {PLATFORMS.map((p) => {
          const r = rows.find((x) => x.p === p)!;
          return (
            <motion.span
              key={p}
              initial={false}
              animate={{ flexGrow: r.pct }}
              transition={tr}
              className="h-full min-w-0 basis-0"
              style={{ background: PLATFORM_COLORS[p] }}
              title={`${PLATFORM_NAMES[p]}: ${r.pct} %`}
            />
          );
        })}
      </div>

      <ul className="mt-6 space-y-3">
        {rows.map((r) => (
          <motion.li key={r.p} layout={!reduced} transition={tr} className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[8rem_minmax(0,1fr)_6rem]">
            <span className="flex items-center gap-2 text-xs text-white/80">
              <Swatch color={PLATFORM_COLORS[r.p]} />
              {PLATFORM_NAMES[r.p]}
            </span>
            <span className="flex min-w-0 items-center gap-2">
              <span className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/[0.04]">
                <motion.span
                  initial={false}
                  animate={{ width: `${(r.pct / max) * 100}%` }}
                  transition={tr}
                  className="block h-full rounded-full"
                  style={{ background: PLATFORM_COLORS[r.p] }}
                />
              </span>
              <span className="w-9 shrink-0 text-right text-xs tabular-nums text-white/70">{r.pct} %</span>
            </span>
            <span className="col-start-2 -mt-2 text-right text-[11px] tabular-nums text-white/45 sm:col-start-auto sm:mt-0 sm:text-xs">
              {eur.format(r.amount)}
            </span>
          </motion.li>
        ))}
      </ul>
    </ChartPanel>
  );
}
