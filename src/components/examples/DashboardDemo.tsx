'use client';

/**
 * Interactive example for "Aufbau digitaler Systeme und Dashboards": a KPI
 * dashboard with a live-simulated line chart. Data is fictional and
 * generated in the browser (seeded, so server and client render the same
 * first frame). Live updates pause when offscreen, on tab switch, on the
 * pause button and for reduced motion.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useExamplesText } from '@/lib/i18n/examples';
import type { Locale } from '@/lib/i18n/translations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';
import { BrowserChrome } from './ExampleFrame';

type Range = 'week' | 'month';
const POINTS: Record<Range, number> = { week: 14, month: 30 };
const W = 600;
const H = 200;
const PAD = 8;

/** Small deterministic PRNG (mulberry32). */
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function series(n: number, seed: number) {
  const r = rng(seed);
  let v = 520;
  return Array.from({ length: n }, (_, i) => {
    v = Math.max(260, v + (r() - 0.42) * 90 + Math.sin(i / 2.4) * 24);
    return Math.round(v);
  });
}

function toPath(values: number[]) {
  const max = Math.max(...values) * 1.08;
  const min = Math.min(...values) * 0.85;
  const step = (W - PAD * 2) / (values.length - 1);
  const pts = values.map((v, i) => [PAD + i * step, H - PAD - ((v - min) / (max - min)) * (H - PAD * 2)]);
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    d += ` C${cx.toFixed(1)},${y0.toFixed(1)} ${cx.toFixed(1)},${y1.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
  }
  const area = `${d} L${pts[pts.length - 1][0].toFixed(1)},${H} L${pts[0][0].toFixed(1)},${H} Z`;
  return { d, area, last: pts[pts.length - 1] };
}

export function DashboardDemo() {
  const t = useExamplesText().dashboard;
  const locale = useLocale() as Locale;
  const reduced = useReducedMotion();
  const nf = useMemo(() => new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-GB'), [locale]);
  const pf = useMemo(
    () => new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-GB', { maximumFractionDigits: 1, minimumFractionDigits: 1 }),
    [locale],
  );

  const [range, setRange] = useState<Range>('week');
  const [values, setValues] = useState(() => series(POINTS.week, 7));
  const [userPaused, setUserPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tick = useRef(0);

  const switchRange = (r: Range) => {
    setRange(r);
    setValues(series(POINTS[r], r === 'week' ? 7 : 30));
  };

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const live = visible && !userPaused && !reduced;

  useEffect(() => {
    if (!live) return;
    const r = rng(99 + tick.current);
    const id = window.setInterval(() => {
      if (document.hidden) return;
      tick.current += 1;
      setValues((prev) => {
        const last = prev[prev.length - 1];
        const next = Math.max(260, Math.round(last + (r() - 0.45) * 80));
        return [...prev.slice(1), next];
      });
    }, 1700);
    return () => window.clearInterval(id);
  }, [live]);

  const { d, area, last } = toPath(values);
  const total = values.reduce((s, v) => s + v, 0);
  const leads = Math.round(total * 0.031);
  const conversion = (leads / total) * 100;
  const first = values.slice(0, Math.floor(values.length / 2)).reduce((s, v) => s + v, 0);
  const second = values.slice(Math.floor(values.length / 2)).reduce((s, v) => s + v, 0);
  const trend = ((second - first) / first) * 100;
  const sources = [42, 27, 19, 12];
  const springT = reduced ? { duration: 0 } : { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const };

  const kpis = [
    { label: t.kpis.visitors, value: nf.format(total) },
    { label: t.kpis.leads, value: nf.format(leads) },
    { label: t.kpis.conversion, value: `${pf.format(conversion)} %` },
  ];

  return (
    <div ref={rootRef}>
      <BrowserChrome url="nordwind.example/dashboard">
        <div className="bg-[#0b0a12] p-4 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold text-white">{t.title}</p>
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest',
                  live ? 'bg-emerald-400/15 text-emerald-300' : 'bg-white/[0.06] text-white/40',
                )}
              >
                <span className={cn('h-1.5 w-1.5 rounded-full', live ? 'animate-pulse bg-emerald-400' : 'bg-white/30')} />
                {t.live}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div role="group" aria-label={t.rangeLabel} className="flex rounded-lg bg-white/[0.04] p-0.5">
                {(['week', 'month'] as Range[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    aria-pressed={range === r}
                    onClick={() => switchRange(r)}
                    className={cn(
                      'rounded-md px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500',
                      range === r ? 'bg-violet-500/30 text-white' : 'text-white/50 hover:text-white',
                    )}
                  >
                    {t.ranges[r]}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                aria-label={userPaused ? t.resume : t.pause}
                title={userPaused ? t.resume : t.pause}
                className="rounded-lg bg-white/[0.04] p-1.5 text-white/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                {userPaused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {kpis.map((k, i) => (
              <div key={k.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">{k.label}</p>
                <p className="mt-2 text-2xl font-bold tabular-nums text-white">{k.value}</p>
                {i === 0 ? (
                  <p className={cn('mt-1 text-[11px]', trend >= 0 ? 'text-emerald-300' : 'text-rose-300')}>
                    {trend >= 0 ? '▲' : '▼'} {pf.format(Math.abs(trend))} % {t.vsPrevious}
                  </p>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
            <figure className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <figcaption className="mb-3 text-[11px] uppercase tracking-[0.16em] text-white/40">{t.chartLabel}</figcaption>
              <div className="relative h-44 w-full">
              <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full" role="img" aria-label={`${t.chartLabel}: ${nf.format(values[values.length - 1])}`}>
                <defs>
                  <linearGradient id="dash-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#7c3aed" stopOpacity="0.45" />
                    <stop offset="1" stopColor="#06b6d4" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="dash-line" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#7c3aed" />
                    <stop offset="1" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                {[0.25, 0.5, 0.75].map((f) => (
                  <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="white" strokeOpacity="0.05" vectorEffect="non-scaling-stroke" />
                ))}
                <motion.path initial={false} animate={{ d: area }} transition={springT} fill="url(#dash-area)" />
                <motion.path initial={false} animate={{ d }} transition={springT} fill="none" stroke="url(#dash-line)" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </svg>
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={{ left: `${(last[0] / W) * 100}%`, top: `${(last[1] / H) * 100}%` }}
                transition={springT}
                className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_0_6px_rgba(6,182,212,0.18)]"
              />
              </div>
            </figure>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="mb-3 text-[11px] uppercase tracking-[0.16em] text-white/40">{t.sources}</p>
              <ul className="space-y-3">
                {sources.map((s, i) => (
                  <li key={t.sourceNames[i]}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-white/70">{t.sourceNames[i]}</span>
                      <span className="tabular-nums text-white/50">{s} %</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                        initial={reduced ? false : { width: 0 }}
                        whileInView={{ width: `${s}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: reduced ? 0 : 1, delay: reduced ? 0 : i * 0.1 }}
                        style={reduced ? { width: `${s}%` } : undefined}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </BrowserChrome>
    </div>
  );
}
