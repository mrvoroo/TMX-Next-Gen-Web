'use client';

/**
 * Concept demo: "Nordwind Kaffeerösterei" – café & roastery website.
 * Fictional brand, sample prices, no real booking.
 */
import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Clock, Coffee, Flame, MapPin, Minus, Plus, Sprout } from 'lucide-react';
import type { DemoLang } from '@/config/demos';
import { cn } from '@/lib/utils';
import { DemoDialog } from '../DemoDialog';
import { useClientNow } from '../useClientNow';

const SERIF = { fontFamily: 'ui-serif, "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif' };
const C = { cream: '#f4ede2', paper: '#fbf7f0', ink: '#2b1d14', brown: '#5a3a26', terra: '#b4532c', sage: '#7d8b6a' };

/** Opening hours by weekday (0 = Sunday). */
const HOURS: [number, number][] = [
  [9, 17],
  [8, 18],
  [8, 18],
  [8, 18],
  [8, 18],
  [8, 19],
  [9, 19],
];

const T = {
  de: {
    nav: ['Karte', 'Rösterei', 'Besuch'],
    reserve: 'Tisch reservieren',
    eyebrow: 'Café & Rösterei · Musterstadt',
    title: ['Kaffee, der nach', 'Norden', 'schmeckt.'],
    sub: 'Wir rösten jede Woche frisch, backen jeden Morgen selbst – und haben immer einen Platz am Fenster für Sie.',
    toMenu: 'Zur Karte',
    openNow: (until: string) => `Jetzt geöffnet · bis ${until} Uhr`,
    closedNow: (from: string) => `Gerade geschlossen · ab ${from} Uhr`,
    marquee: ['Espresso', 'Filterkaffee', 'Hausgebäck', 'Bohnen zum Mitnehmen', 'Frühstück bis 14 Uhr'],
    menuTitle: 'Unsere Karte',
    menuNote: 'Beispielpreise',
    tabs: ['Kaffee', 'Gebäck', 'Frühstück'],
    menu: [
      [
        ['Espresso', 'Hausmischung „Nordwind“', 2.4],
        ['Flat White', 'Doppelter Espresso, feiner Milchschaum', 3.9],
        ['Filterkaffee', 'Bohne der Woche, frisch aufgebrüht', 3.6],
        ['Hafer-Cappuccino', 'Mit Haferdrink, ohne Aufpreis', 3.8],
      ],
      [
        ['Franzbrötchen', 'Zimt, Butter, Zucker – noch warm', 2.9],
        ['Kardamomschnecke', 'Nach skandinavischem Rezept', 3.2],
        ['Apfelkuchen', 'Mit Streuseln und Sahne', 4.2],
      ],
      [
        ['Nordwind-Frühstück', 'Brötchen, Butter, Käse, Marmelade, Ei', 9.8],
        ['Porridge', 'Hafer, Beeren, geröstete Nüsse', 7.5],
        ['Avocado-Brot', 'Sauerteig, Limette, Chili', 8.9],
      ],
    ] as [string, string, number][][],
    roastTitle: 'Von der Bohne bis zur Tasse',
    roastSub: 'Wir rösten in kleinen Mengen – direkt hinter der Theke.',
    steps: [
      ['Ausgewählte Bohnen', 'Direkt gehandelte Rohkaffees aus wenigen Regionen.'],
      ['Langsame Röstung', 'Kleine Chargen, damit jede Bohne ihr Aroma entfalten kann.'],
      ['Frisch in der Tasse', 'Höchstens zwei Wochen von der Röstung bis zu Ihnen.'],
    ],
    beanTitle: 'Bohne der Woche',
    beanName: 'Hochland, gewaschen',
    beanNotes: [
      ['Säure', 0.55],
      ['Süße', 0.8],
      ['Körper', 0.65],
    ] as [string, number][],
    beanBuy: 'Bohnen vorbestellen',
    visitTitle: 'Besuchen Sie uns',
    address: ['Hafenstraße 12', '00000 Musterstadt'],
    days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    today: 'heute',
    dialogTitle: 'Tisch reservieren',
    close: 'Schließen',
    day: 'Tag',
    time: 'Uhrzeit',
    guests: 'Personen',
    fewer: 'Weniger Personen',
    more: 'Mehr Personen',
    confirm: 'Reservierung anfragen',
    done: 'Das ist eine Demo – es wurde keine echte Reservierung gesendet. Auf Ihrer Website würde hier eine Bestätigung per E-Mail verschickt.',
    preorderDone: 'Das ist eine Demo – es wurde nichts bestellt.',
    weekday: (d: Date) => d.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'numeric' }),
    footer: 'Nordwind Kaffeerösterei ist eine fiktive Marke.',
  },
  en: {
    nav: ['Menu', 'Roastery', 'Visit'],
    reserve: 'Book a table',
    eyebrow: 'Café & roastery · Sample Town',
    title: ['Coffee that tastes', 'like the', 'north.'],
    sub: 'We roast fresh every week, bake every morning – and always keep a seat by the window for you.',
    toMenu: 'See the menu',
    openNow: (until: string) => `Open now · until ${until}`,
    closedNow: (from: string) => `Closed right now · opens ${from}`,
    marquee: ['Espresso', 'Filter coffee', 'Homemade pastries', 'Beans to go', 'Breakfast until 2 pm'],
    menuTitle: 'Our menu',
    menuNote: 'Sample prices',
    tabs: ['Coffee', 'Pastries', 'Breakfast'],
    menu: [
      [
        ['Espresso', 'House blend “Nordwind”', 2.4],
        ['Flat white', 'Double espresso, silky milk', 3.9],
        ['Filter coffee', 'Bean of the week, freshly brewed', 3.6],
        ['Oat cappuccino', 'With oat milk at no extra cost', 3.8],
      ],
      [
        ['Cinnamon pastry', 'Cinnamon, butter, sugar – still warm', 2.9],
        ['Cardamom bun', 'Scandinavian recipe', 3.2],
        ['Apple cake', 'With crumble and cream', 4.2],
      ],
      [
        ['Nordwind breakfast', 'Rolls, butter, cheese, jam, egg', 9.8],
        ['Porridge', 'Oats, berries, roasted nuts', 7.5],
        ['Avocado toast', 'Sourdough, lime, chilli', 8.9],
      ],
    ] as [string, string, number][][],
    roastTitle: 'From bean to cup',
    roastSub: 'We roast in small batches – right behind the counter.',
    steps: [
      ['Selected beans', 'Directly traded green coffee from a few regions.'],
      ['Slow roasting', 'Small batches so every bean can develop its aroma.'],
      ['Fresh in your cup', 'Two weeks at most from roasting to you.'],
    ],
    beanTitle: 'Bean of the week',
    beanName: 'Highland, washed',
    beanNotes: [
      ['Acidity', 0.55],
      ['Sweetness', 0.8],
      ['Body', 0.65],
    ] as [string, number][],
    beanBuy: 'Pre-order beans',
    visitTitle: 'Visit us',
    address: ['12 Harbour Street', 'Sample Town'],
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    today: 'today',
    dialogTitle: 'Book a table',
    close: 'Close',
    day: 'Day',
    time: 'Time',
    guests: 'Guests',
    fewer: 'Fewer guests',
    more: 'More guests',
    confirm: 'Request booking',
    done: 'This is a demo – no real booking was sent. On your website a confirmation email would go out here.',
    preorderDone: 'This is a demo – nothing was ordered.',
    weekday: (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
    footer: 'Nordwind Kaffeerösterei is a fictional brand.',
  },
};

function CupIllustration() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="nw-coffee" cx="0.45" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#9b5b33" />
          <stop offset="1" stopColor="#3d2416" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="215" r="170" fill={C.terra} opacity="0.12" />
      <ellipse cx="200" cy="312" rx="150" ry="26" fill={C.ink} opacity="0.12" />
      <ellipse cx="200" cy="300" rx="132" ry="22" fill="#fff" />
      <path d="M96 170h208l-14 96a40 40 0 0 1-40 34H150a40 40 0 0 1-40-34z" fill={C.paper} stroke={C.ink} strokeWidth="4" />
      <path d="M304 192h14a30 30 0 0 1 0 60h-22" fill="none" stroke={C.ink} strokeWidth="10" strokeLinecap="round" />
      <ellipse cx="200" cy="172" rx="104" ry="18" fill="url(#nw-coffee)" stroke={C.ink} strokeWidth="4" />
      <path d="M182 168c10-10 26-10 36 0-10 8-26 8-36 0z" fill="#e9c9a6" opacity="0.8" />
      <g fill="none" stroke={C.brown} strokeWidth="6" strokeLinecap="round" opacity="0.55">
        <path className="nw-steam" d="M160 130c-14-18 14-30 0-52" />
        <path className="nw-steam nw-steam-2" d="M200 124c-14-18 14-30 0-56" />
        <path className="nw-steam nw-steam-3" d="M240 130c-14-18 14-30 0-52" />
      </g>
      {[
        [70, 90, 20],
        [330, 110, -30],
        [340, 330, 40],
        [56, 300, -10],
      ].map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <ellipse rx="14" ry="20" fill={C.brown} />
          <path d="M0 -17c-6 10 6 24 0 34" stroke={C.cream} strokeWidth="3" fill="none" />
        </g>
      ))}
    </svg>
  );
}

function RotatingBadge({ text }: { text: string }) {
  return (
    <svg viewBox="0 0 120 120" className="nw-spin h-full w-full" aria-hidden="true">
      <defs>
        <path id="nw-circle" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" />
      </defs>
      <circle cx="60" cy="60" r="58" fill={C.ink} />
      <text fill={C.cream} fontSize="11" letterSpacing="3" style={{ fontWeight: 700 }}>
        <textPath href="#nw-circle">{text}</textPath>
      </text>
      <Coffee x="44" y="44" width="32" height="32" color={C.terra} />
    </svg>
  );
}

export function NordwindSite({ lang }: { lang: DemoLang }) {
  const t = T[lang];
  const reduced = useReducedMotion();
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [beanOpen, setBeanOpen] = useState(false);
  const [day, setDay] = useState(0);
  const [time, setTime] = useState('10:00');
  const [guests, setGuests] = useState(2);
  const [sent, setSent] = useState(false);
  const eur = new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'en-IE', { style: 'currency', currency: 'EUR' });

  // Time-dependent UI only on the client (static HTML has no "now").
  const nowMs = useClientNow();
  const { status, todayIdx, days } = useMemo(() => {
    if (nowMs === null) return { status: null, todayIdx: null, days: [] as Date[] };
    const now = new Date(nowMs);
    const d = now.getDay();
    const [from, to] = HOURS[d];
    const h = now.getHours() + now.getMinutes() / 60;
    const isOpen = h >= from && h < to;
    return {
      todayIdx: d,
      status: { open: isOpen, text: isOpen ? t.openNow(`${to}:00`) : t.closedNow(`${HOURS[(h >= to ? d + 1 : d) % 7][0]}:00`) },
      days: Array.from({ length: 6 }, (_, i) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)),
    };
  }, [nowMs, t]);

  const reveal = reduced
    ? {}
    : { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' }, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } };

  const openReserve = () => {
    setSent(false);
    setOpen(true);
  };

  return (
    <div style={{ background: C.cream, color: C.ink }} className="min-h-screen overflow-x-clip">
      <style>{`
        @keyframes nw-steam { 0%{transform:translateY(8px);opacity:0} 40%{opacity:.6} 100%{transform:translateY(-18px);opacity:0} }
        .nw-steam{animation:nw-steam 3.2s ease-in-out infinite}
        .nw-steam-2{animation-delay:.8s}.nw-steam-3{animation-delay:1.6s}
        @keyframes nw-spin { to { transform: rotate(360deg) } }
        .nw-spin{animation:nw-spin 18s linear infinite;transform-origin:center}
        @keyframes nw-marquee { to { transform: translateX(-50%) } }
        .nw-marquee{animation:nw-marquee 26s linear infinite}
      `}</style>

      {/* Brand nav */}
      <header className="sticky top-10 z-40 border-b border-black/5 backdrop-blur-md" style={{ background: `${C.cream}e6` }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a href="#top" className="text-2xl font-bold tracking-tight" style={SERIF}>
            Nordwind<span style={{ color: C.terra }}>.</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex" aria-label="Nordwind">
            {['#karte', '#roesterei', '#besuch'].map((h, i) => (
              <a key={h} href={h} className="opacity-70 transition-opacity hover:opacity-100">
                {t.nav[i]}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={openReserve}
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
            style={{ background: C.ink }}
          >
            {t.reserve}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:pb-24 lg:pt-20">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3.5 py-1.5 text-xs font-semibold" aria-live="polite">
            <span className={cn('h-2 w-2 rounded-full', !status ? 'bg-black/20' : status.open ? 'bg-emerald-500' : 'bg-amber-500')} />
            {status?.text ?? t.eyebrow}
          </p>
          <h1 className="text-[clamp(2.75rem,8vw,6rem)] font-semibold leading-[0.95] tracking-tight" style={SERIF}>
            {t.title[0]}
            <br />
            {t.title[1]} <em style={{ color: C.terra }}>{t.title[2]}</em>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed opacity-75">{t.sub}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openReserve}
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.03]"
              style={{ background: C.terra, boxShadow: `0 18px 40px -16px ${C.terra}` }}
            >
              {t.reserve}
              <ArrowRight size={16} aria-hidden="true" />
            </button>
            <a href="#karte" className="inline-flex items-center rounded-full border border-black/15 px-7 py-3.5 text-sm font-semibold hover:bg-black/5">
              {t.toMenu}
            </a>
          </div>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-[30rem]">
          <motion.div
            className="h-full w-full"
            initial={reduced ? false : { opacity: 0, scale: 0.92, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <CupIllustration />
          </motion.div>
          <div className="absolute -bottom-2 left-2 h-24 w-24 sm:h-28 sm:w-28">
            <RotatingBadge text={lang === 'de' ? '· FRISCH GERÖSTET · JEDE WOCHE ' : '· FRESHLY ROASTED · EVERY WEEK '} />
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-y border-black/10 py-4" style={{ background: C.ink, color: C.cream }} aria-hidden="true">
        <div className={cn('flex w-max gap-10 whitespace-nowrap text-2xl', !reduced && 'nw-marquee')} style={SERIF}>
          {[...t.marquee, ...t.marquee, ...t.marquee, ...t.marquee].map((w, i) => (
            <span key={i} className="flex items-center gap-10">
              {w}
              <span style={{ color: C.terra }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Menu */}
      <section id="karte" className="mx-auto max-w-5xl scroll-mt-28 px-5 py-20 sm:px-8 sm:py-28">
        <motion.div {...reveal} className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-5xl font-semibold tracking-tight sm:text-6xl" style={SERIF}>
            {t.menuTitle}
          </h2>
          <div role="tablist" aria-label={t.menuTitle} className="flex gap-1 rounded-full bg-black/5 p-1">
            {t.tabs.map((name, i) => (
              <button
                key={name}
                role="tab"
                type="button"
                aria-selected={tab === i}
                aria-controls="nw-menu-panel"
                onClick={() => setTab(i)}
                className={cn('rounded-full px-4 py-2 text-sm font-semibold transition-colors', tab === i ? 'text-white' : 'opacity-75 hover:opacity-100')}
                style={tab === i ? { background: C.ink } : undefined}
              >
                {name}
              </button>
            ))}
          </div>
        </motion.div>
        <div id="nw-menu-panel" role="tabpanel" className="mt-10">
          <ul key={tab} className="divide-y divide-black/10 border-y border-black/10">
            {t.menu[tab].map(([name, desc, price], i) => (
              <motion.li
                key={name}
                initial={reduced ? false : { opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: reduced ? 0 : i * 0.06 }}
                className="flex items-baseline gap-4 py-5"
              >
                <div className="min-w-0">
                  <p className="text-xl font-semibold" style={SERIF}>
                    {name}
                  </p>
                  <p className="mt-1 text-sm opacity-75">{desc}</p>
                </div>
                <span className="mx-2 hidden flex-1 border-b border-dotted border-black/25 sm:block" aria-hidden="true" />
                <span className="ml-auto shrink-0 text-lg font-semibold tabular-nums" style={{ color: C.brown }}>
                  {eur.format(price)}
                </span>
              </motion.li>
            ))}
          </ul>
          <p className="mt-3 text-xs opacity-70">{t.menuNote}</p>
        </div>
      </section>

      {/* Roastery */}
      <section id="roesterei" className="scroll-mt-28 px-5 py-20 sm:px-8 sm:py-28" style={{ background: C.paper }}>
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal} className="max-w-2xl">
            <h2 className="text-5xl font-semibold tracking-tight sm:text-6xl" style={SERIF}>
              {t.roastTitle}
            </h2>
            <p className="mt-4 text-lg opacity-70">{t.roastSub}</p>
          </motion.div>
          <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1fr_1fr_1.15fr]">
            {t.steps.map(([title, text], i) => {
              const Icon = [Sprout, Flame, Coffee][i];
              return (
                <motion.div key={title} {...reveal} transition={{ ...(reveal.transition ?? {}), delay: reduced ? 0 : i * 0.12 }} className="rounded-3xl border border-black/10 bg-white p-7">
                  <span className="text-sm font-semibold opacity-40">0{i + 1}</span>
                  <Icon size={30} className="mt-6" style={{ color: C.terra }} aria-hidden="true" />
                  <h3 className="mt-5 text-2xl font-semibold" style={SERIF}>
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed opacity-75">{text}</p>
                </motion.div>
              );
            })}
            <motion.div {...reveal} className="flex flex-col rounded-3xl p-7 text-white" style={{ background: C.ink }}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-75">{t.beanTitle}</p>
              <p className="mt-3 text-3xl font-semibold" style={SERIF}>
                {t.beanName}
              </p>
              <ul className="mt-6 space-y-4">
                {t.beanNotes.map(([label, v]) => (
                  <li key={label}>
                    <div className="mb-1.5 flex justify-between text-xs opacity-70">
                      <span>{label}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: C.terra, width: reduced ? `${v * 100}%` : undefined }}
                        initial={reduced ? false : { width: 0 }}
                        whileInView={{ width: `${v * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setBeanOpen(true)}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
                style={{ background: C.cream, color: C.ink }}
              >
                {t.beanBuy}
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Visit */}
      <section id="besuch" className="mx-auto grid max-w-7xl scroll-mt-28 gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-2">
        <motion.div {...reveal}>
          <h2 className="text-5xl font-semibold tracking-tight sm:text-6xl" style={SERIF}>
            {t.visitTitle}
          </h2>
          <p className="mt-6 flex items-start gap-3 text-lg">
            <MapPin size={20} className="mt-1 shrink-0" style={{ color: C.terra }} aria-hidden="true" />
            <span>
              {t.address[0]}
              <br />
              {t.address[1]}
            </span>
          </p>
          <table className="mt-8 w-full max-w-md text-sm">
            <tbody>
              {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                <tr key={d} className={cn('border-b border-black/10', todayIdx === d && 'font-semibold')} style={todayIdx === d ? { color: C.terra } : undefined}>
                  <th scope="row" className="py-2.5 text-left font-[inherit]">
                    {t.days[d]} {todayIdx === d ? <span className="ml-1 text-xs">({t.today})</span> : null}
                  </th>
                  <td className="py-2.5 text-right tabular-nums">
                    <Clock size={12} className="mr-1.5 inline opacity-70" aria-hidden="true" />
                    {HOURS[d][0]}:00 – {HOURS[d][1]}:00
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
        <motion.div {...reveal} className="relative min-h-[22rem] overflow-hidden rounded-[2rem]" style={{ background: '#e7dcc9' }}>
          <svg viewBox="0 0 600 440" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <rect width="600" height="440" fill="#e7dcc9" />
            <path d="M0 330C120 300 200 360 320 330S520 270 600 290V440H0z" fill="#b9c8c4" />
            <g stroke="#fbf7f0" strokeWidth="16" fill="none" strokeLinecap="round">
              <path d="M-20 120H620" />
              <path d="M180 -20V460" />
              <path d="M420 -20L360 460" />
              <path d="M-20 250C200 230 400 260 620 210" />
            </g>
            <g fill="#d6c7ae">
              <rect x="40" y="20" width="110" height="70" rx="10" />
              <rect x="220" y="150" width="110" height="70" rx="10" />
              <rect x="460" y="20" width="120" height="70" rx="10" />
              <rect x="40" y="150" width="110" height="70" rx="10" />
              <rect x="460" y="140" width="120" height="50" rx="10" />
            </g>
          </svg>
          <div className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-full">
            <span className={cn('absolute left-1/2 top-full h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full', !reduced && 'animate-ping')} style={{ background: `${C.terra}40` }} />
            <div className="relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-xl" style={{ background: C.ink }}>
              <Coffee size={15} aria-hidden="true" /> Nordwind
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-black/10 px-5 py-8 text-center text-xs opacity-70 sm:px-8">{t.footer}</footer>

      {/* Reservation */}
      <DemoDialog open={open} onClose={() => setOpen(false)} title={t.dialogTitle} closeLabel={t.close} className="bg-[#fbf7f0] text-[#2b1d14]">
        {sent ? (
          <p className="rounded-2xl bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-900" role="status">
            {t.done}
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="space-y-6"
          >
            <fieldset>
              <legend className="mb-2 text-sm font-semibold">{t.day}</legend>
              <div className="grid grid-cols-3 gap-2">
                {days.map((d, i) => (
                  <label key={i} className={cn('cursor-pointer rounded-xl border px-2 py-2 text-center text-xs font-medium has-[:focus-visible]:ring-2', day === i ? 'border-transparent text-white' : 'border-black/15')} style={day === i ? { background: C.ink } : undefined}>
                    <input type="radio" name="nw-day" className="sr-only" checked={day === i} onChange={() => setDay(i)} />
                    {t.weekday(d)}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-2 text-sm font-semibold">{t.time}</legend>
              <div className="flex flex-wrap gap-2">
                {['09:00', '10:00', '11:30', '13:00', '15:00', '16:30'].map((tm) => (
                  <label key={tm} className={cn('cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium tabular-nums has-[:focus-visible]:ring-2', time === tm ? 'border-transparent text-white' : 'border-black/15')} style={time === tm ? { background: C.terra } : undefined}>
                    <input type="radio" name="nw-time" className="sr-only" checked={time === tm} onChange={() => setTime(tm)} />
                    {tm}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{t.guests}</span>
              <div className="flex items-center gap-3">
                <button type="button" aria-label={t.fewer} onClick={() => setGuests((g) => Math.max(1, g - 1))} className="rounded-full border border-black/15 p-2">
                  <Minus size={14} aria-hidden="true" />
                </button>
                <span className="w-6 text-center text-lg font-semibold tabular-nums" aria-live="polite">
                  {guests}
                </span>
                <button type="button" aria-label={t.more} onClick={() => setGuests((g) => Math.min(8, g + 1))} className="rounded-full border border-black/15 p-2">
                  <Plus size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
            <button type="submit" className="w-full rounded-full py-3.5 text-sm font-semibold text-white" style={{ background: C.terra }}>
              {t.confirm}
            </button>
          </form>
        )}
      </DemoDialog>
      <DemoDialog open={beanOpen} onClose={() => setBeanOpen(false)} title={t.beanBuy} closeLabel={t.close} className="bg-[#fbf7f0] text-[#2b1d14]">
        <p className="text-sm leading-relaxed">{t.preorderDone}</p>
      </DemoDialog>
    </div>
  );
}
