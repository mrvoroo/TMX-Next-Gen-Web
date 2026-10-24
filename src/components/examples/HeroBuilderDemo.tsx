'use client';

/**
 * Interactive example for "Webentwicklung / Webdesign": a live hero builder.
 * The visitor switches style, accent colour, layout and device and the
 * preview of a fictional café website updates instantly.
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Monitor, Smartphone } from 'lucide-react';
import { useExamplesText } from '@/lib/i18n/examples';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';
import { BrowserChrome } from './ExampleFrame';

type Style = 'minimal' | 'bold' | 'gradient';
type Accent = 'violet' | 'cyan' | 'amber' | 'rose';
type Layout = 'centered' | 'split';
type Device = 'desktop' | 'mobile';

const ACCENTS: Record<Accent, { base: string; soft: string; deep: string }> = {
  violet: { base: '#7c3aed', soft: '#c4b5fd', deep: '#2e1065' },
  cyan: { base: '#06b6d4', soft: '#a5f3fc', deep: '#083344' },
  amber: { base: '#f59e0b', soft: '#fde68a', deep: '#451a03' },
  rose: { base: '#f43f5e', soft: '#fecdd3', deep: '#4c0519' },
};

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string; icon?: React.ReactNode }[];
  onChange: (v: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="min-w-0">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500',
              value === o.value
                ? 'border-violet-400/60 bg-violet-500/20 text-white'
                : 'border-white/10 bg-white/[0.03] text-white/60 hover:text-white',
            )}
          >
            {o.icon}
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Abstract cup illustration (pure SVG, tinted by the accent). */
function CupArt({ accent, dark }: { accent: Accent; dark: boolean }) {
  const a = ACCENTS[accent];
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id={`cup-${accent}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a.soft} />
          <stop offset="1" stopColor={a.base} />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="88" fill={dark ? '#ffffff10' : `${a.base}18`} />
      <path d="M58 92h78v28a39 39 0 0 1-78 0z" fill={`url(#cup-${accent})`} />
      <path
        d="M136 98h8a14 14 0 0 1 0 28h-10"
        fill="none"
        stroke={a.base}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <ellipse cx="97" cy="168" rx="52" ry="7" fill={dark ? '#ffffff14' : `${a.deep}22`} />
      <path d="M82 78c0-10 10-10 10-20M100 78c0-10 10-10 10-20" stroke={a.soft} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.8" />
    </svg>
  );
}

export function HeroBuilderDemo() {
  const t = useExamplesText().heroBuilder;
  const reduced = useReducedMotion();
  const [style, setStyle] = useState<Style>('gradient');
  const [accent, setAccent] = useState<Accent>('violet');
  const [layout, setLayout] = useState<Layout>('split');
  const [device, setDevice] = useState<Device>('desktop');

  const a = ACCENTS[accent];
  const dark = style !== 'minimal';
  const mobile = device === 'mobile';
  const split = layout === 'split' && !mobile;
  const transition = reduced ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };

  const background =
    style === 'minimal'
      ? '#f7f5f0'
      : style === 'bold'
        ? '#0b0b10'
        : `radial-gradient(120% 120% at 0% 0%, ${a.base} 0%, ${a.deep} 55%, #07060c 100%)`;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-8">
      <div className="space-y-5" aria-label={t.controlsLabel}>
        <Segmented
          label={t.style}
          value={style}
          onChange={setStyle}
          options={[
            { value: 'minimal', label: t.styles.minimal },
            { value: 'bold', label: t.styles.bold },
            { value: 'gradient', label: t.styles.gradient },
          ]}
        />
        <div role="group" aria-label={t.accent}>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
            {t.accent}
          </p>
          <div className="flex gap-2">
            {(Object.keys(ACCENTS) as Accent[]).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={accent === key}
                aria-label={t.accents[key]}
                title={t.accents[key]}
                onClick={() => setAccent(key)}
                className={cn(
                  'h-8 w-8 rounded-full border-2 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70',
                  accent === key ? 'scale-110 border-white' : 'border-transparent hover:scale-105',
                )}
                style={{ background: ACCENTS[key].base }}
              />
            ))}
          </div>
        </div>
        <Segmented
          label={t.layout}
          value={layout}
          onChange={setLayout}
          options={[
            { value: 'centered', label: t.layouts.centered },
            { value: 'split', label: t.layouts.split },
          ]}
        />
        <Segmented
          label={t.device}
          value={device}
          onChange={setDevice}
          options={[
            { value: 'desktop', label: t.devices.desktop, icon: <Monitor size={13} aria-hidden="true" /> },
            { value: 'mobile', label: t.devices.mobile, icon: <Smartphone size={13} aria-hidden="true" /> },
          ]}
        />
        <p className="text-xs leading-relaxed text-white/40">{t.hint}</p>
      </div>

      <div className="flex min-w-0 justify-center">
        <motion.div
          layout={!reduced}
          transition={transition}
          className="w-full"
          style={{ maxWidth: mobile ? 340 : 760 }}
        >
          <BrowserChrome url={`${t.brand.toLowerCase()}.example`}>
            <motion.div
              key={`${style}-${accent}`}
              initial={reduced ? false : { opacity: 0.4 }}
              animate={{ opacity: 1 }}
              transition={transition}
              className="relative overflow-hidden"
              style={{ background, minHeight: mobile ? 460 : 360 }}
            >
              <div
                className={cn(
                  'flex items-center justify-between px-5 py-4 text-xs',
                  dark ? 'text-white/80' : 'text-neutral-700',
                )}
              >
                <span className="text-sm font-black tracking-tight" style={{ color: dark ? '#fff' : a.deep }}>
                  {t.brand}
                </span>
                {mobile ? (
                  <span aria-hidden="true" className="flex flex-col gap-1">
                    <span className={cn('h-0.5 w-5 rounded', dark ? 'bg-white/70' : 'bg-neutral-700')} />
                    <span className={cn('h-0.5 w-5 rounded', dark ? 'bg-white/70' : 'bg-neutral-700')} />
                  </span>
                ) : (
                  <span className="flex gap-5">
                    {t.nav.map((n) => (
                      <span key={n}>{n}</span>
                    ))}
                  </span>
                )}
              </div>

              <motion.div
                layout={!reduced}
                transition={transition}
                className={cn(
                  'grid items-center gap-6 px-6 pb-10 pt-6 sm:px-10',
                  split ? 'grid-cols-1 text-center sm:grid-cols-[1.2fr_1fr] sm:text-left' : 'grid-cols-1 text-center',
                )}
              >
                <motion.div layout={!reduced} transition={transition} className={cn('min-w-0', !split && 'mx-auto max-w-md')}>
                  <p
                    className="text-[11px] font-semibold uppercase tracking-[0.22em]"
                    style={{ color: dark ? a.soft : a.base }}
                  >
                    {t.eyebrow}
                  </p>
                  <h4
                    className={cn(
                      'mt-3 font-black leading-[1.02] tracking-tight [hyphens:auto] [overflow-wrap:anywhere]',
                      style === 'bold' ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl',
                      dark ? 'text-white' : 'text-neutral-900',
                    )}
                  >
                    {style === 'bold' ? (
                      <>
                        {t.headline.split(' ').slice(0, -1).join(' ')}{' '}
                        <span style={{ color: a.base }}>{t.headline.split(' ').slice(-1)}</span>
                      </>
                    ) : (
                      t.headline
                    )}
                  </h4>
                  <p className={cn('mt-4 text-sm leading-relaxed', dark ? 'text-white/70' : 'text-neutral-600')}>
                    {t.sub}
                  </p>
                  <div className={cn('mt-6 flex flex-wrap justify-center gap-3', split && 'sm:justify-start')}>
                    <span
                      className="rounded-full px-5 py-2.5 text-xs font-semibold shadow-lg"
                      style={{
                        background: style === 'gradient' ? '#fff' : a.base,
                        color: style === 'gradient' ? a.deep : '#fff',
                      }}
                    >
                      {t.cta}
                    </span>
                    <span
                      className={cn(
                        'rounded-full border px-5 py-2.5 text-xs font-semibold',
                        dark ? 'border-white/25 text-white/85' : 'border-neutral-300 text-neutral-700',
                      )}
                    >
                      {t.secondary}
                    </span>
                  </div>
                </motion.div>
                <AnimatePresence initial={false}>
                  {(split || mobile) && (
                    <motion.div
                      key="art"
                      initial={reduced ? false : { opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={reduced ? undefined : { opacity: 0, scale: 0.9 }}
                      transition={transition}
                      className={cn('mx-auto aspect-square w-full', mobile ? 'max-w-[11rem]' : 'max-w-[15rem]')}
                    >
                      <CupArt accent={accent} dark={dark} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </BrowserChrome>
        </motion.div>
      </div>
    </div>
  );
}
