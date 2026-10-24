'use client';

/**
 * Interactive example for "Automatisierung von Social-Media-Prozessen": a
 * queue of posts that moves into a weekly calendar – one by one on click, or
 * all at once with "schedule automatically". Pure browser simulation.
 */

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { RotateCcw, Sparkles } from 'lucide-react';
import { PLATFORM_NAMES, useMarketingText, type Platform } from '@/lib/i18n/marketing-examples';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';
import { ChartPanel, PLATFORM_COLORS } from './ChartParts';

const ABBR: Record<Platform, string> = {
  instagram: 'IG',
  facebook: 'FB',
  tiktok: 'TT',
  snapchat: 'SC',
  pinterest: 'PI',
  linkedin: 'LI',
};

/** Post i → platform and target slot [day 0–6, slot 0–2]. */
const PLAN: { platform: Platform; day: number; slot: number }[] = [
  { platform: 'instagram', day: 0, slot: 2 },
  { platform: 'tiktok', day: 1, slot: 2 },
  { platform: 'facebook', day: 2, slot: 1 },
  { platform: 'linkedin', day: 1, slot: 0 },
  { platform: 'tiktok', day: 3, slot: 2 },
  { platform: 'pinterest', day: 4, slot: 1 },
  { platform: 'snapchat', day: 5, slot: 1 },
  { platform: 'linkedin', day: 3, slot: 0 },
];

export function PostSchedulerDemo() {
  const t = useMarketingText().scheduler;
  const reduced = useReducedMotion();
  const [placed, setPlaced] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearInterval(timer.current), []);

  const place = (i: number) => setPlaced((p) => (p.includes(i) ? p : [...p, i]));

  const autoPlan = () => {
    const rest = PLAN.map((_, i) => i).filter((i) => !placed.includes(i));
    if (!rest.length) return;
    if (reduced) {
      setPlaced((p) => [...p, ...rest]);
      return;
    }
    setRunning(true);
    let k = 0;
    window.clearInterval(timer.current);
    timer.current = window.setInterval(() => {
      place(rest[k]);
      k += 1;
      if (k >= rest.length) {
        window.clearInterval(timer.current);
        setRunning(false);
      }
    }, 260);
  };

  const reset = () => {
    window.clearInterval(timer.current);
    setRunning(false);
    setPlaced([]);
  };

  const queue = PLAN.map((_, i) => i).filter((i) => !placed.includes(i));
  const tr = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 380, damping: 32 };

  return (
    <ChartPanel
      title={t.title}
      note={t.note}
      controls={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={autoPlan}
            disabled={running || queue.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Sparkles size={14} aria-hidden="true" />
            {t.autoPlan}
          </button>
          <button
            type="button"
            onClick={reset}
            aria-label={t.reset}
            title={t.reset}
            className="rounded-lg bg-white/[0.05] p-2 text-white/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            <RotateCcw size={14} aria-hidden="true" />
          </button>
        </div>
      }
    >
      <LayoutGroup id="post-scheduler">
        <div className="grid gap-5 lg:grid-cols-[14rem_minmax(0,1fr)]">
          <div>
            <p className="mb-2 flex items-baseline justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
              {t.queue}
              <span aria-live="polite" className="normal-case tracking-normal text-white/55">
                {placed.length} {t.of} {PLAN.length} {t.planned}
              </span>
            </p>
            <ul className="flex min-h-[3rem] flex-wrap gap-2 lg:flex-col">
              {queue.map((i) => (
                <li key={i}>
                  <motion.button
                    layoutId={reduced ? undefined : `post-${i}`}
                    transition={tr}
                    type="button"
                    onClick={() => place(i)}
                    disabled={running}
                    className="flex w-full items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-2.5 py-2 text-left text-xs text-white/80 hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                  >
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white"
                      style={{ background: PLATFORM_COLORS[PLAN[i].platform] }}
                      title={PLATFORM_NAMES[PLAN[i].platform]}
                    >
                      {ABBR[PLAN[i].platform]}
                    </span>
                    <span className="truncate">{t.posts[i]}</span>
                  </motion.button>
                </li>
              ))}
              {queue.length === 0 && <li className="py-2 text-xs text-emerald-300/80">{t.emptyQueue}</li>}
            </ul>
          </div>

          <div className="min-w-0" role="table" aria-label={t.title}>
            <div role="rowgroup">
              <div role="row" className="grid grid-cols-[3.25rem_repeat(7,minmax(0,1fr))] gap-1 sm:grid-cols-[4.5rem_repeat(7,minmax(0,1fr))]">
                <span role="columnheader" />
                {t.days.map((d) => (
                  <span key={d} role="columnheader" className="pb-1 text-center text-[10px] font-semibold uppercase tracking-wider text-white/40">
                    {d}
                  </span>
                ))}
              </div>
            </div>
            <div role="rowgroup" className="space-y-1">
              {t.slots.map((slot, s) => (
                <div key={slot} role="row" className="grid grid-cols-[3.25rem_repeat(7,minmax(0,1fr))] gap-1 sm:grid-cols-[4.5rem_repeat(7,minmax(0,1fr))]">
                  <span role="rowheader" className="flex items-center text-[10px] text-white/40 sm:text-[11px]">
                    {slot}
                  </span>
                  {t.days.map((d, day) => {
                    const i = PLAN.findIndex((p) => p.day === day && p.slot === s);
                    const here = i >= 0 && placed.includes(i);
                    return (
                      <div
                        key={d}
                        role="cell"
                        className={cn(
                          'relative flex h-12 min-w-0 items-center justify-center rounded-lg border border-dashed sm:h-14',
                          here ? 'border-transparent' : 'border-white/[0.06] bg-white/[0.01]',
                        )}
                      >
                        <AnimatePresence>
                          {here && (
                            <motion.span
                              layoutId={reduced ? undefined : `post-${i}`}
                              transition={tr}
                              className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 overflow-hidden rounded-lg px-1 text-white"
                              style={{ background: PLATFORM_COLORS[PLAN[i].platform] }}
                              title={`${PLATFORM_NAMES[PLAN[i].platform]} · ${t.posts[i]}`}
                            >
                              <span className="text-[10px] font-bold">{ABBR[PLAN[i].platform]}</span>
                              <span className="hidden w-full truncate text-center text-[9px] leading-tight opacity-90 xl:block">{t.posts[i]}</span>
                              <span className="sr-only">
                                {PLATFORM_NAMES[PLAN[i].platform]}: {t.posts[i]}
                              </span>
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </LayoutGroup>
    </ChartPanel>
  );
}
