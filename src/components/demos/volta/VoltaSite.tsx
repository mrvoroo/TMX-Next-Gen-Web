'use client';

/**
 * Concept demo: "VOLTA" – 3D product page for an e-bike with a live colour
 * configurator, animated specs, scroll story and pre-order flow. Fictional
 * brand and product data, sample prices, no real orders.
 */
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, BatteryCharging, Check, Gauge, Lock, Smartphone, Zap } from 'lucide-react';
import type { DemoLang } from '@/config/demos';
import { cn } from '@/lib/utils';
import { DemoDialog } from '../DemoDialog';
import { useIdleReady } from '@/hooks/useIdleReady';

const BikeCanvas = dynamic(() => import('./BikeCanvas'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-full bg-white/[0.03]" />,
});

const COLORS = [
  { id: 'graphite', hex: '#3a3d44' },
  { id: 'sand', hex: '#c9b38f' },
  { id: 'blue', hex: '#2f6bff' },
  { id: 'orange', hex: '#ff5b1f' },
] as const;
type ColorId = (typeof COLORS)[number]['id'];

const T = {
  de: {
    nav: ['Technik', 'Modelle', 'Vorbestellen'],
    preorder: 'Vorbestellen',
    eyebrow: 'Das neue E-Bike für die Stadt',
    tagline: 'Leicht. Leise. Unaufhaltsam.',
    colorsLabel: 'Rahmenfarbe',
    colors: { graphite: 'Graphit', sand: 'Sand', blue: 'Elektroblau', orange: 'Signalorange' } as Record<ColorId, string>,
    from: 'ab',
    priceNote: 'Beispielpreis',
    drag: 'Ziehen zum Drehen',
    canvasLabel: 'Interaktives 3D-Modell des E-Bikes',
    specs: [
      [120, 'km', 'Reichweite bis zu'],
      [19, 'kg', 'Gewicht'],
      [25, 'km/h', 'Unterstützung bis'],
      [3, 'h', 'Ladezeit'],
    ] as [number, string, string][],
    storyTitle: 'Gebaut für den Alltag.',
    story: [
      ['Integrierter Akku', 'Unsichtbar im Rahmen, in Sekunden herausnehmbar.', BatteryCharging],
      ['Leiser Mittelmotor', 'Kraft genau dann, wenn Sie sie brauchen – kaum hörbar.', Zap],
      ['App & Diebstahlschutz', 'Standort, Akkustand und Sperre direkt auf dem Smartphone.', Smartphone],
    ] as const,
    modelsTitle: 'Wählen Sie Ihr Modell',
    models: [
      ['VOLTA One', 'Für die Stadt', 2990, ['Riemenantrieb', 'Integriertes Licht', 'Schutzbleche']],
      ['VOLTA Trail', 'Für Stadt & Land', 3490, ['Federgabel', 'Breitere Reifen', 'Größerer Akku']],
    ] as [string, string, number, string[]][],
    choose: 'Auswählen',
    chosen: 'Ausgewählt',
    summary: 'Ihre Konfiguration',
    model: 'Modell',
    color: 'Farbe',
    total: 'Gesamt',
    confirm: 'Unverbindlich vorbestellen',
    done: 'Das ist eine Demo – es wurde nichts bestellt und keine Zahlung ausgelöst. In Ihrem Shop ginge es hier zur Kasse.',
    close: 'Schließen',
    footer: 'VOLTA ist eine fiktive Marke. Produkt, Daten und Preise sind erfunden.',
  },
  en: {
    nav: ['Tech', 'Models', 'Pre-order'],
    preorder: 'Pre-order',
    eyebrow: 'The new e-bike for the city',
    tagline: 'Light. Quiet. Unstoppable.',
    colorsLabel: 'Frame colour',
    colors: { graphite: 'Graphite', sand: 'Sand', blue: 'Electric blue', orange: 'Signal orange' } as Record<ColorId, string>,
    from: 'from',
    priceNote: 'Sample price',
    drag: 'Drag to rotate',
    canvasLabel: 'Interactive 3D model of the e-bike',
    specs: [
      [120, 'km', 'Range up to'],
      [19, 'kg', 'Weight'],
      [25, 'km/h', 'Assist up to'],
      [3, 'h', 'Charging time'],
    ] as [number, string, string][],
    storyTitle: 'Built for everyday life.',
    story: [
      ['Integrated battery', 'Hidden in the frame, removable in seconds.', BatteryCharging],
      ['Quiet mid-drive motor', 'Power exactly when you need it – barely audible.', Zap],
      ['App & theft protection', 'Location, battery and lock right on your phone.', Smartphone],
    ] as const,
    modelsTitle: 'Choose your model',
    models: [
      ['VOLTA One', 'For the city', 2990, ['Belt drive', 'Integrated lights', 'Mudguards']],
      ['VOLTA Trail', 'City & country', 3490, ['Suspension fork', 'Wider tyres', 'Bigger battery']],
    ] as [string, string, number, string[]][],
    choose: 'Select',
    chosen: 'Selected',
    summary: 'Your configuration',
    model: 'Model',
    color: 'Colour',
    total: 'Total',
    confirm: 'Pre-order without obligation',
    done: 'This is a demo – nothing was ordered and no payment was made. In your shop this would lead to checkout.',
    close: 'Close',
    footer: 'VOLTA is a fictional brand. Product, data and prices are made up.',
  },
};

function Counter({ to, reduced, locale }: { to: number; reduced: boolean; locale: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduced) {
      el.textContent = to.toLocaleString(locale);
      return;
    }
    const c = animate(0, to, { duration: 1.4, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => (el.textContent = Math.round(v).toLocaleString(locale)) });
    return () => c.stop();
  }, [inView, to, reduced, locale]);
  return <span ref={ref}>{to.toLocaleString(locale)}</span>;
}

export function VoltaSite({ lang }: { lang: DemoLang }) {
  const t = T[lang];
  const reduced = Boolean(useReducedMotion());
  // 3D model mounts after first paint + idle so it never delays the headline.
  const sceneReady = useIdleReady();
  const locale = lang === 'de' ? 'de-DE' : 'en-IE';
  const eur = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  const [color, setColor] = useState<ColorId>('blue');
  const [model, setModel] = useState(0);
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const hex = COLORS.find((c) => c.id === color)!.hex;

  const storyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: storyRef, offset: ['start 70%', 'end 50%'] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const openPreorder = () => {
    setSent(false);
    setOpen(true);
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-[#09090b] text-white">
      <header className="sticky top-10 z-40 border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a href="#top" className="text-xl font-black italic tracking-[0.2em]">
            VOLTA
          </a>
          <nav className="hidden gap-8 text-sm font-medium text-white/60 md:flex" aria-label="VOLTA">
            {['#technik', '#modelle', '#modelle'].map((h, i) => (
              <a key={i} href={h} className="hover:text-white">
                {t.nav[i]}
              </a>
            ))}
          </nav>
          <button type="button" onClick={openPreorder} className="rounded-full px-5 py-2.5 text-sm font-bold text-black transition-colors" style={{ background: hex === '#3a3d44' ? '#e9ecef' : hex, color: color === 'blue' || color === 'orange' ? '#fff' : '#09090b' }}>
            {t.preorder}
          </button>
        </div>
      </header>

      {/* Hero with 3D */}
      <section id="top" className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 transition-[background] duration-700" style={{ background: `radial-gradient(55% 50% at 50% 55%, ${hex}40 0%, transparent 70%)` }} />
        <p aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[18%] select-none text-center text-[22vw] font-black italic leading-none tracking-tighter text-white/[0.04]">
          VOLTA
        </p>
        <div className="relative mx-auto max-w-7xl px-5 pt-12 sm:px-8 sm:pt-16">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">{t.eyebrow}</p>
            <h1 className="mt-4 text-[clamp(3rem,10vw,7.5rem)] font-black italic leading-[0.9] tracking-tight">
              VOLTA <span style={{ color: hex === '#3a3d44' ? '#9aa1ad' : hex }} className="transition-colors duration-500">One</span>
            </h1>
            <p className="mt-4 text-lg text-white/60 sm:text-xl">{t.tagline}</p>
          </div>
          <div className="relative mx-auto h-[19rem] max-w-5xl sm:h-[30rem] lg:h-[34rem]">
            {sceneReady ? <BikeCanvas color={hex} reduced={reduced} label={t.canvasLabel} /> : <div className="h-full w-full" />}
            <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.2em] text-white/50">{t.drag}</p>
          </div>
          <div className="flex flex-col items-center gap-6 pb-16 sm:flex-row sm:justify-between">
            <div role="radiogroup" aria-label={t.colorsLabel} className="flex items-center gap-3">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={color === c.id}
                  aria-label={t.colors[c.id]}
                  title={t.colors[c.id]}
                  onClick={() => setColor(c.id)}
                  className={cn('h-9 w-9 rounded-full ring-offset-4 ring-offset-[#09090b] transition-transform hover:scale-110', color === c.id && 'ring-2 ring-white')}
                  style={{ background: c.hex }}
                />
              ))}
              <span className="ml-2 text-sm font-semibold text-white/70" aria-live="polite">
                {t.colors[color]}
              </span>
            </div>
            <div className="flex items-center gap-5">
              <p className="text-right">
                <span className="block text-xs text-white/60">
                  {t.from} · {t.priceNote}
                </span>
                <span className="text-2xl font-black tabular-nums">{eur.format(2990)}</span>
              </p>
              <button type="button" onClick={openPreorder} className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-black hover:bg-white/90">
                {t.preorder} <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Specs */}
      <section id="technik" className="scroll-mt-28 border-y border-white/[0.06]">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
          {t.specs.map(([v, unit, label], i) => (
            <div key={label} className={cn('flex flex-col-reverse gap-2 px-5 py-10 sm:px-8 sm:py-14', i % 2 === 1 && 'border-l border-white/[0.06]', i >= 2 && 'border-t border-white/[0.06] lg:border-t-0', i === 2 && 'lg:border-l')}>
              <dt className="text-sm text-white/50">{label}</dt>
              <dd className="text-5xl font-black tabular-nums tracking-tight sm:text-6xl">
                <Counter to={v} reduced={reduced} locale={locale} />
                <span className="ml-1 text-xl font-bold text-white/55">{unit}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <h2 className="max-w-3xl text-5xl font-black italic tracking-tight sm:text-7xl">{t.storyTitle}</h2>
        <div ref={storyRef} className="relative mt-16 grid gap-14 pl-10 sm:pl-16">
          <span aria-hidden="true" className="absolute left-3 top-0 h-full w-0.5 bg-white/10 sm:left-5" />
          <motion.span aria-hidden="true" className="absolute left-3 top-0 h-full w-0.5 origin-top sm:left-5" style={{ background: hex, scaleY: reduced ? 1 : lineScale }} />
          {t.story.map(([title, text, Icon], i) => (
            <motion.div
              key={title}
              initial={reduced ? false : { opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: i * 0.05 }}
              className="grid items-center gap-6 md:grid-cols-[1fr_1.3fr]"
            >
              <div>
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: `${hex}26`, color: hex === '#3a3d44' ? '#cfd3da' : hex }}>
                  <Icon size={26} aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">{title}</h3>
                <p className="mt-3 max-w-sm text-white/60">{text}</p>
              </div>
              <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.06] to-transparent">
                <div className="absolute inset-0 flex items-center justify-center">
                  {i === 0 && (
                    <div className="flex h-24 w-56 items-center rounded-2xl border-2 border-white/20 p-2">
                      <motion.div className="h-full rounded-lg" style={{ background: hex }} initial={reduced ? false : { width: '10%' }} whileInView={{ width: '86%' }} viewport={{ once: true }} transition={{ duration: 1.8, ease: 'easeOut' }} />
                    </div>
                  )}
                  {i === 1 && (
                    <div className="relative h-36 w-36">
                      <Gauge size={144} strokeWidth={1} className="text-white/20" aria-hidden="true" />
                      <motion.span className="absolute inset-0 rounded-full border-4" style={{ borderColor: hex, borderTopColor: 'transparent', borderLeftColor: 'transparent' }} initial={reduced ? false : { rotate: -120 }} whileInView={{ rotate: 40 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: 'easeOut' }} />
                    </div>
                  )}
                  {i === 2 && (
                    <div className="w-40 rounded-[1.6rem] border-2 border-white/20 bg-black/40 p-4">
                      <Lock size={22} style={{ color: hex === '#3a3d44' ? '#cfd3da' : hex }} aria-hidden="true" />
                      <div className="mt-4 h-2 w-3/4 rounded bg-white/20" />
                      <div className="mt-2 h-2 w-1/2 rounded bg-white/10" />
                      <motion.div className="mt-5 h-8 rounded-lg" style={{ background: hex }} initial={reduced ? false : { opacity: 0.2 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, repeat: reduced ? 0 : 2, repeatType: 'reverse' }} />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Models */}
      <section id="modelle" className="scroll-mt-28 border-t border-white/[0.06] px-5 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-4xl font-black tracking-tight sm:text-6xl">{t.modelsTitle}</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {t.models.map(([name, sub, price, feats], i) => (
              <div key={name} className={cn('flex flex-col rounded-3xl border p-8 transition-colors', model === i ? 'border-white/40 bg-white/[0.05]' : 'border-white/10')}>
                <p className="text-sm text-white/50">{sub}</p>
                <h3 className="mt-1 text-3xl font-black italic">{name}</h3>
                <p className="mt-4 text-3xl font-black tabular-nums">
                  <span className="text-sm font-medium text-white/60">{t.from} </span>
                  {eur.format(price)}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {feats.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-white/70">
                      <Check size={15} style={{ color: hex === '#3a3d44' ? '#cfd3da' : hex }} aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  aria-pressed={model === i}
                  onClick={() => setModel(i)}
                  className={cn('mt-8 rounded-full py-3.5 text-sm font-bold', model === i ? 'bg-white text-black' : 'border border-white/20 text-white hover:bg-white/5')}
                >
                  {model === i ? t.chosen : t.choose}
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-5 rounded-3xl border border-white/10 p-6 sm:flex-row sm:px-8">
            <p className="text-sm text-white/60">
              <span className="font-semibold text-white">{t.models[model][0]}</span> · {t.colors[color]} ·{' '}
              <span className="font-bold tabular-nums text-white">{eur.format(t.models[model][2])}</span>
            </p>
            <button type="button" onClick={openPreorder} className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold" style={{ background: hex, color: color === 'sand' ? '#09090b' : '#fff' }}>
              {t.preorder} <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-white/55">{t.priceNote}</p>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] px-5 py-8 text-center text-xs text-white/55">{t.footer}</footer>

      <DemoDialog open={open} onClose={() => setOpen(false)} title={t.summary} closeLabel={t.close} className="bg-[#141418] text-white">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-white/50">{t.model}</dt>
            <dd className="font-semibold">{t.models[model][0]}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-white/50">{t.color}</dt>
            <dd className="flex items-center gap-2 font-semibold">
              <span className="h-3 w-3 rounded-full" style={{ background: hex }} /> {t.colors[color]}
            </dd>
          </div>
          <div className="flex justify-between border-t border-white/10 pt-3 text-base">
            <dt>{t.total}</dt>
            <dd className="font-black tabular-nums">{eur.format(t.models[model][2])}</dd>
          </div>
        </dl>
        {sent ? (
          <p role="status" className="mt-6 rounded-2xl bg-white/[0.06] p-4 text-sm leading-relaxed text-white/80">
            {t.done}
          </p>
        ) : (
          <button type="button" onClick={() => setSent(true)} className="mt-6 w-full rounded-full bg-white py-3.5 text-sm font-bold text-black">
            {t.confirm}
          </button>
        )}
      </DemoDialog>
    </div>
  );
}
