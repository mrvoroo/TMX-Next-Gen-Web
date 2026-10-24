'use client';

/**
 * Concept demo: "Physio Lindenhof" – practice website with a 3-step online
 * booking widget. Fictional practice. Wording avoids healing promises and
 * testimonials (Heilmittelwerbegesetz). No real booking.
 */
import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CalendarCheck, Check, ChevronDown, Clock, HeartPulse, MapPin, Phone, Sparkles, Activity, Dumbbell, HandHelping } from 'lucide-react';
import type { DemoLang } from '@/config/demos';
import { cn } from '@/lib/utils';
import { DemoDialog } from '../DemoDialog';
import { useClientNow } from '../useClientNow';

const C = { bg: '#f6faf9', ink: '#0f2a2a', teal: '#0f766e', mint: '#d7efe9', sand: '#f3eee6', soft: '#e9f4f1' };

const SLOTS = ['08:00', '09:30', '11:00', '13:30', '15:00', '16:30', '18:00'];
/** Deterministic "booked" pattern so the widget looks realistic. */
const isBooked = (day: number, slot: number) => (day * 3 + slot * 5) % 7 < 2;

const T = {
  de: {
    nav: ['Leistungen', 'Ablauf', 'Fragen', 'Kontakt'],
    book: 'Termin buchen',
    eyebrow: 'Physiotherapie in Musterstadt',
    title: ['Bewegung,', 'die gut tut.'],
    sub: 'Physiotherapie mit Zeit für Sie: ausführliche Befundaufnahme, ein klarer Plan und Übungen, die in Ihren Alltag passen.',
    facts: ['Termine auch abends', 'Barrierefreier Zugang', 'Alle Kassen & Privat'],
    widgetTitle: 'Online-Termin',
    steps: ['Behandlung', 'Tag', 'Uhrzeit'],
    back: 'Zurück',
    next: 'Weiter',
    summary: 'Ihre Auswahl',
    request: 'Termin anfragen',
    booked: 'belegt',
    treatments: [
      ['Krankengymnastik', 25, 'KG'],
      ['Manuelle Therapie', 25, 'MT'],
      ['Massage', 30, 'KMT'],
      ['Erstberatung', 45, ''],
    ] as [string, number, string][],
    minutes: 'Min.',
    servicesTitle: 'Leistungen',
    servicesSub: 'Auf Rezept oder als Selbstzahler – wir beraten Sie, was für Sie passt.',
    services: [
      ['Krankengymnastik', 'Gezielte Übungen für Kraft, Beweglichkeit und Koordination.', 25, 38],
      ['Manuelle Therapie', 'Sanfte Techniken für Gelenke und Wirbelsäule.', 25, 45],
      ['Massage', 'Lockerung von Muskulatur und Gewebe.', 30, 35],
      ['Training an Geräten', 'Begleitetes Training für mehr Belastbarkeit im Alltag.', 45, 42],
    ] as [string, string, number, number][],
    priceNote: 'Beispielpreise für Selbstzahler',
    from: 'ab',
    flowTitle: 'So läuft Ihr erster Termin',
    flow: [
      ['Ankommen', 'Kurzer Fragebogen, keine Wartezimmer-Marathons.'],
      ['Befund', 'Wir hören zu, testen Beweglichkeit und klären Ihre Ziele.'],
      ['Plan', 'Sie bekommen einen verständlichen Behandlungsplan.'],
      ['Übungen', 'Ausgewählte Übungen für zu Hause – auch als PDF.'],
    ],
    faqTitle: 'Häufige Fragen',
    faq: [
      ['Brauche ich ein Rezept?', 'Für eine Behandlung über die Krankenkasse ja. Ohne Rezept können Sie als Selbstzahler zu uns kommen.'],
      ['Was soll ich mitbringen?', 'Ihr Rezept, falls vorhanden, bequeme Kleidung und ein Handtuch.'],
      ['Wie kann ich einen Termin absagen?', 'Bis 24 Stunden vorher online oder telefonisch – ohne Kosten.'],
      ['Ist die Praxis barrierefrei?', 'Ja, es gibt einen ebenerdigen Zugang und einen Aufzug.'],
    ],
    contactTitle: 'Kontakt & Anfahrt',
    address: ['Lindenallee 4', '00000 Musterstadt'],
    phone: '0000 000000 (Beispiel)',
    hours: [
      ['Mo – Do', '07:30 – 19:30'],
      ['Fr', '07:30 – 15:00'],
    ],
    close: 'Schließen',
    doneTitle: 'Demo-Buchung',
    done: 'Das ist eine Demo – es wurde kein Termin gebucht und keine Daten wurden gesendet. In Ihrer Website käme hier die Bestätigung per E-Mail oder SMS.',
    day: (d: Date) => d.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'numeric' }),
    footer: 'Physio Lindenhof ist eine fiktive Praxis. Die Inhalte ersetzen keine ärztliche Beratung.',
  },
  en: {
    nav: ['Treatments', 'Process', 'FAQ', 'Contact'],
    book: 'Book appointment',
    eyebrow: 'Physiotherapy in Sample Town',
    title: ['Movement', 'that feels good.'],
    sub: 'Physiotherapy that takes its time: a thorough assessment, a clear plan and exercises that fit your everyday life.',
    facts: ['Evening appointments', 'Step-free access', 'Insured & private patients'],
    widgetTitle: 'Book online',
    steps: ['Treatment', 'Day', 'Time'],
    back: 'Back',
    next: 'Next',
    summary: 'Your selection',
    request: 'Request appointment',
    booked: 'booked',
    treatments: [
      ['Physiotherapy', 25, ''],
      ['Manual therapy', 25, ''],
      ['Massage', 30, ''],
      ['First consultation', 45, ''],
    ] as [string, number, string][],
    minutes: 'min',
    servicesTitle: 'Treatments',
    servicesSub: 'With a prescription or self-paying – we help you choose what fits.',
    services: [
      ['Physiotherapy', 'Targeted exercises for strength, mobility and coordination.', 25, 38],
      ['Manual therapy', 'Gentle techniques for joints and spine.', 25, 45],
      ['Massage', 'Loosening muscles and tissue.', 30, 35],
      ['Guided training', 'Supervised training for everyday resilience.', 45, 42],
    ] as [string, string, number, number][],
    priceNote: 'Sample prices for self-paying patients',
    from: 'from',
    flowTitle: 'Your first appointment',
    flow: [
      ['Arrive', 'A short form, no long waiting.'],
      ['Assessment', 'We listen, test mobility and clarify your goals.'],
      ['Plan', 'You get a treatment plan that is easy to follow.'],
      ['Exercises', 'Selected exercises for home – also as a PDF.'],
    ],
    faqTitle: 'FAQ',
    faq: [
      ['Do I need a prescription?', 'For treatment covered by health insurance, yes. Without one you can come as a self-paying patient.'],
      ['What should I bring?', 'Your prescription if you have one, comfortable clothes and a towel.'],
      ['How do I cancel?', 'Up to 24 hours in advance online or by phone – free of charge.'],
      ['Is the practice accessible?', 'Yes, there is step-free access and a lift.'],
    ],
    contactTitle: 'Contact & directions',
    address: ['4 Linden Avenue', 'Sample Town'],
    phone: '0000 000000 (sample)',
    hours: [
      ['Mon – Thu', '7:30 – 19:30'],
      ['Fri', '7:30 – 15:00'],
    ],
    close: 'Close',
    doneTitle: 'Demo booking',
    done: 'This is a demo – no appointment was booked and no data was sent. On your website a confirmation by email or text message would follow.',
    day: (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
    footer: 'Physio Lindenhof is a fictional practice. The content does not replace medical advice.',
  },
};

function HeroArt({ reduced }: { reduced: boolean | null }) {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
      <circle cx="200" cy="200" r="180" fill={C.mint} />
      <circle cx="200" cy="200" r="120" fill="#fff" opacity="0.7" />
      <motion.path
        d="M120 300C150 240 160 200 200 160s70-60 90-100"
        fill="none"
        stroke={C.teal}
        strokeWidth="14"
        strokeLinecap="round"
        initial={reduced ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: 'easeInOut' }}
      />
      {[0.12, 0.3, 0.5, 0.7, 0.88].map((f, i) => (
        <motion.circle
          key={i}
          cx={120 + f * 170}
          cy={300 - f * 240 + Math.sin(f * 6) * 12}
          r="14"
          fill="#fff"
          stroke={C.teal}
          strokeWidth="5"
          initial={reduced ? false : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 + i * 0.18, type: 'spring' }}
        />
      ))}
    </svg>
  );
}

export function LindenhofSite({ lang }: { lang: DemoLang }) {
  const t = T[lang];
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [treatment, setTreatment] = useState<number | null>(null);
  const [day, setDay] = useState<number | null>(null);
  const [slot, setSlot] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const eur = new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

  // Weekdays from tomorrow – only on the client (static HTML has no date).
  const nowMs = useClientNow();
  const days = useMemo(() => {
    if (nowMs === null) return [] as Date[];
    const out: Date[] = [];
    const d = new Date(nowMs);
    while (out.length < 6) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0 && d.getDay() !== 6) out.push(new Date(d));
    }
    return out;
  }, [nowMs]);

  const canNext = [treatment !== null, day !== null, slot !== null][step];
  const reveal = reduced
    ? {}
    : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.6 } };
  const slide = reduced ? { initial: false as const } : { initial: { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -24 }, transition: { duration: 0.25 } };

  const resetBooking = () => {
    setStep(0);
    setTreatment(null);
    setDay(null);
    setSlot(null);
  };

  return (
    <div className="min-h-screen overflow-x-clip" style={{ background: C.bg, color: C.ink }}>
      <header className="sticky top-10 z-40 border-b border-black/5 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <a href="#termin" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white" style={{ background: C.teal }}>
              <HeartPulse size={18} aria-hidden="true" />
            </span>
            <span className="leading-tight">
              <span className="block text-base font-bold">Lindenhof</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] opacity-70">Physiotherapie</span>
            </span>
          </a>
          <nav className="hidden gap-7 text-sm font-medium lg:flex" aria-label="Lindenhof">
            {['#leistungen', '#ablauf', '#fragen', '#kontakt'].map((h, i) => (
              <a key={h} href={h} className="opacity-75 hover:opacity-100">
                {t.nav[i]}
              </a>
            ))}
          </nav>
          <a href="#termin" className="rounded-full px-5 py-2.5 text-sm font-semibold text-white" style={{ background: C.teal }}>
            {t.book}
          </a>
        </div>
      </header>

      {/* Hero + booking */}
      <section id="termin" className="mx-auto grid max-w-7xl scroll-mt-28 items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_27rem] lg:py-20">
        <div className="relative">
          <p className="relative text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: C.teal }}>
            {t.eyebrow}
          </p>
          <h1 className="relative mt-5 text-[clamp(2.7rem,7vw,5.25rem)] font-bold leading-[0.98] tracking-tight">
            {t.title[0]}
            <br />
            <span style={{ color: C.teal }}>{t.title[1]}</span>
          </h1>
          <p className="relative mt-6 max-w-lg text-lg leading-relaxed opacity-70">{t.sub}</p>
          <ul className="relative mt-8 flex flex-wrap gap-2.5">
            {t.facts.map((f) => (
              <li key={f} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm">
                <Check size={14} style={{ color: C.teal }} aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 sm:-right-24 sm:-top-20 sm:h-96 sm:w-96">
          <HeroArt reduced={reduced} />
        </div>
        <div className="relative rounded-[2rem] bg-white p-6 shadow-[0_30px_80px_-30px_rgba(15,118,110,0.35)] ring-1 ring-black/5 sm:p-7">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-base font-bold">
              <CalendarCheck size={18} style={{ color: C.teal }} aria-hidden="true" />
              {t.widgetTitle}
            </p>
            <ol className="flex gap-1.5" aria-label={t.widgetTitle}>
              {t.steps.map((s, i) => (
                <li
                  key={s}
                  aria-current={step === i ? 'step' : undefined}
                  className={cn('h-1.5 w-8 rounded-full transition-colors', i <= step ? '' : 'bg-black/10')}
                  style={i <= step ? { background: C.teal } : undefined}
                >
                  <span className="sr-only">
                    {i + 1}. {s}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] opacity-70">
            {step + 1}/3 · {t.steps[step]}
          </p>
          <div className="relative mt-3 min-h-[17rem]">
            <AnimatePresence mode="wait" initial={false}>
              {step === 0 && (
                <motion.div key="s0" {...slide} role="radiogroup" aria-label={t.steps[0]} className="space-y-2.5">
                  {t.treatments.map(([name, min], i) => (
                    <button
                      key={name}
                      type="button"
                      role="radio"
                      aria-checked={treatment === i}
                      onClick={() => setTreatment(i)}
                      className={cn('flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left text-sm font-semibold transition-colors', treatment === i ? 'border-transparent' : 'border-black/10 hover:border-black/25')}
                      style={treatment === i ? { background: C.soft, boxShadow: `inset 0 0 0 2px ${C.teal}` } : undefined}
                    >
                      {name}
                      <span className="flex items-center gap-1 text-xs font-medium opacity-75">
                        <Clock size={12} aria-hidden="true" /> {min} {t.minutes}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
              {step === 1 && (
                <motion.div key="s1" {...slide} role="radiogroup" aria-label={t.steps[1]} className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {days.map((d, i) => (
                    <button
                      key={i}
                      type="button"
                      role="radio"
                      aria-checked={day === i}
                      onClick={() => {
                        setDay(i);
                        setSlot(null);
                      }}
                      className={cn('rounded-2xl border px-3 py-4 text-sm font-semibold', day === i ? 'border-transparent text-white' : 'border-black/10 hover:border-black/25')}
                      style={day === i ? { background: C.teal } : undefined}
                    >
                      {t.day(d)}
                    </button>
                  ))}
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="s2" {...slide} role="radiogroup" aria-label={t.steps[2]} className="grid grid-cols-3 gap-2.5">
                  {SLOTS.map((s, i) => {
                    const busy = isBooked(day ?? 0, i);
                    return (
                      <button
                        key={s}
                        type="button"
                        role="radio"
                        aria-checked={slot === i}
                        disabled={busy}
                        onClick={() => setSlot(i)}
                        className={cn(
                          'rounded-xl border px-2 py-3 text-sm font-semibold tabular-nums',
                          busy ? 'cursor-not-allowed border-dashed border-black/10 opacity-40' : slot === i ? 'border-transparent text-white' : 'border-black/10 hover:border-black/25',
                        )}
                        style={slot === i ? { background: C.teal } : undefined}
                      >
                        {s}
                        {busy ? <span className="block text-[10px] font-normal">{t.booked}</span> : null}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {treatment !== null && (
            <p className="mt-2 rounded-2xl px-4 py-3 text-xs" style={{ background: C.sand }}>
              <span className="font-semibold">{t.summary}:</span> {t.treatments[treatment][0]}
              {day !== null && days[day] ? ` · ${t.day(days[day])}` : ''}
              {slot !== null ? ` · ${SLOTS[slot]}` : ''}
            </p>
          )}
          <div className="mt-5 flex gap-2.5">
            {step > 0 && (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-3 text-sm font-semibold">
                <ArrowLeft size={15} aria-hidden="true" /> {t.back}
              </button>
            )}
            <button
              type="button"
              disabled={!canNext}
              onClick={() => (step < 2 ? setStep((s) => s + 1) : setDone(true))}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white disabled:opacity-40"
              style={{ background: C.teal }}
            >
              {step < 2 ? t.next : t.request}
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
        </div>
      </section>

      {/* Services */}
      <section id="leistungen" className="scroll-mt-28 bg-white px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal} className="max-w-2xl">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">{t.servicesTitle}</h2>
            <p className="mt-4 text-lg opacity-75">{t.servicesSub}</p>
          </motion.div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.services.map(([name, text, min, price], i) => {
              const Icon = [Activity, HandHelping, Sparkles, Dumbbell][i];
              return (
                <motion.li key={name} {...reveal} className="group flex flex-col rounded-3xl p-7 transition-colors" style={{ background: C.bg }}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white transition-transform group-hover:-rotate-6" style={{ color: C.teal }}>
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-xl font-bold">{name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed opacity-75">{text}</p>
                  <p className="mt-6 flex items-center justify-between border-t border-black/10 pt-4 text-sm">
                    <span className="flex items-center gap-1.5 opacity-75">
                      <Clock size={13} aria-hidden="true" /> {min} {t.minutes}
                    </span>
                    <span className="font-bold">
                      {t.from} {eur.format(price)}
                    </span>
                  </p>
                </motion.li>
              );
            })}
          </ul>
          <p className="mt-4 text-xs opacity-70">{t.priceNote}</p>
        </div>
      </section>

      {/* Flow */}
      <section id="ablauf" className="mx-auto max-w-7xl scroll-mt-28 px-5 py-20 sm:px-8 sm:py-24">
        <motion.h2 {...reveal} className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t.flowTitle}
        </motion.h2>
        <ol className="relative mt-14 grid gap-8 md:grid-cols-4">
          <span aria-hidden="true" className="absolute left-6 top-6 hidden h-0.5 w-[calc(100%-3rem)] md:block" style={{ background: C.mint }} />
          {t.flow.map(([title, text], i) => (
            <motion.li key={title} {...reveal} className="relative">
              <span className="relative flex h-12 w-12 items-center justify-center rounded-full text-base font-bold text-white ring-8" style={{ background: C.teal, ['--tw-ring-color' as string]: C.bg }}>
                {i + 1}
              </span>
              <h3 className="mt-5 text-lg font-bold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed opacity-75">{text}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section id="fragen" className="scroll-mt-28 px-5 py-20 sm:px-8 sm:py-24" style={{ background: C.soft }}>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">{t.faqTitle}</h2>
          <div className="mt-10 space-y-3">
            {t.faq.map(([q, a]) => (
              <details key={q} className="group rounded-2xl bg-white px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold">
                  {q}
                  <ChevronDown size={18} className="shrink-0 transition-transform group-open:rotate-180" style={{ color: C.teal }} aria-hidden="true" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed opacity-70">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="kontakt" className="mx-auto grid max-w-7xl scroll-mt-28 gap-6 px-5 py-20 sm:px-8 sm:py-24 md:grid-cols-3">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:col-span-3">{t.contactTitle}</h2>
        <div className="rounded-3xl bg-white p-7">
          <MapPin size={20} style={{ color: C.teal }} aria-hidden="true" />
          <p className="mt-4 font-semibold">
            {t.address[0]}
            <br />
            {t.address[1]}
          </p>
        </div>
        <div className="rounded-3xl bg-white p-7">
          <Phone size={20} style={{ color: C.teal }} aria-hidden="true" />
          <p className="mt-4 font-semibold">{t.phone}</p>
        </div>
        <div className="rounded-3xl bg-white p-7">
          <Clock size={20} style={{ color: C.teal }} aria-hidden="true" />
          <dl className="mt-4 space-y-1 text-sm">
            {t.hours.map(([d, h]) => (
              <div key={d} className="flex justify-between gap-4">
                <dt className="opacity-75">{d}</dt>
                <dd className="font-semibold tabular-nums">{h}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <footer className="border-t border-black/10 px-5 py-8 text-center text-xs opacity-70">{t.footer}</footer>

      <DemoDialog
        open={done}
        onClose={() => {
          setDone(false);
          resetBooking();
        }}
        title={t.doneTitle}
        closeLabel={t.close}
        className="bg-white text-[#0f2a2a]"
      >
        <p className="text-sm leading-relaxed">{t.done}</p>
      </DemoDialog>
    </div>
  );
}
