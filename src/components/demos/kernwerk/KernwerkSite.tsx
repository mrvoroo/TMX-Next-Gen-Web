'use client';

/**
 * Concept demo: "Kernwerk Immobilien" – property search with filters, a
 * shortlist, a brochure request and a mortgage calculator. Fictional agency,
 * listings and figures; the calculator is an example, not financial advice.
 */
import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BedDouble, Heart, MapPin, Maximize2, Search } from 'lucide-react';
import type { DemoLang } from '@/config/demos';
import { cn } from '@/lib/utils';
import { DemoDialog } from '../DemoDialog';

const C = { bg: '#f7f6f3', ink: '#141414', brass: '#a8844f', line: '#e4e1da', night: '#1b1e24' };

type Mode = 'buy' | 'rent';
interface Listing {
  id: number;
  mode: Mode;
  district: number;
  price: number;
  area: number;
  rooms: number;
  floors: 1 | 2 | 3 | 4;
  roof: 'flat' | 'gable';
  wall: string;
  sky: string;
}

const LISTINGS: Listing[] = [
  { id: 0, mode: 'buy', district: 0, price: 489000, area: 118, rooms: 4, floors: 2, roof: 'gable', wall: '#e9e2d4', sky: '#dfe6ea' },
  { id: 1, mode: 'buy', district: 1, price: 329000, area: 78, rooms: 3, floors: 4, roof: 'flat', wall: '#d9d4cb', sky: '#e8e1d6' },
  { id: 2, mode: 'rent', district: 2, price: 1290, area: 64, rooms: 2, floors: 3, roof: 'flat', wall: '#c9b9a3', sky: '#e3e8e4' },
  { id: 3, mode: 'buy', district: 2, price: 715000, area: 165, rooms: 5, floors: 2, roof: 'flat', wall: '#f1efe9', sky: '#d9e2e8' },
  { id: 4, mode: 'rent', district: 0, price: 2150, area: 105, rooms: 4, floors: 2, roof: 'gable', wall: '#dcd2c2', sky: '#ebe4da' },
  { id: 5, mode: 'rent', district: 1, price: 890, area: 46, rooms: 1, floors: 4, roof: 'flat', wall: '#bfc6c9', sky: '#e7e3dc' },
  { id: 6, mode: 'buy', district: 1, price: 259000, area: 61, rooms: 2, floors: 3, roof: 'gable', wall: '#e4d7c3', sky: '#dfe5e3' },
  { id: 7, mode: 'rent', district: 2, price: 1680, area: 88, rooms: 3, floors: 3, roof: 'gable', wall: '#ece6db', sky: '#dbe2e6' },
];

const T = {
  de: {
    nav: ['Angebote', 'Finanzierung', 'Verkaufen'],
    saved: 'Merkliste',
    eyebrow: 'Immobilien in Musterstadt',
    title: ['Zuhause finden.', 'Ohne Umwege.'],
    sub: 'Geprüfte Angebote, ehrliche Beschreibungen und eine persönliche Ansprechperson – vom ersten Klick bis zur Schlüsselübergabe.',
    buy: 'Kaufen',
    rent: 'Mieten',
    where: 'Stadtteil',
    anyDistrict: 'Alle Stadtteile',
    districts: ['Altstadt', 'Hafenviertel', 'Parkseite'],
    roomsMin: 'Zimmer ab',
    search: 'Suchen',
    results: (n: number) => `${n} ${n === 1 ? 'Angebot' : 'Angebote'}`,
    maxPrice: 'Preis bis',
    noResults: 'Keine Angebote mit diesen Filtern – probieren Sie weniger Zimmer oder einen höheren Preis.',
    rooms: 'Zi.',
    perMonth: '/ Monat',
    titles: ['Stadthaus mit Garten', 'Helle Etagenwohnung', 'Altbau mit Balkon', 'Architektenhaus am Park', 'Doppelhaushälfte', 'Kompaktes Apartment', 'Dachgeschoss mit Weitblick', 'Familienwohnung mit Terrasse'],
    save: 'Merken',
    unsave: 'Von der Merkliste entfernen',
    details: 'Details ansehen',
    expose: 'Exposé anfordern',
    exposeDone: 'Das ist eine Demo – es wurde keine Anfrage gesendet. Auf Ihrer Website ginge die Anfrage direkt an Ihr Postfach oder CRM.',
    calcTitle: 'Was kostet mich das im Monat?',
    calcSub: 'Grobe Beispielrechnung für eine Finanzierung.',
    price: 'Kaufpreis',
    equity: 'Eigenkapital',
    rate: 'Sollzins p. a.',
    repay: 'Anfängliche Tilgung',
    loan: 'Darlehen',
    monthly: 'Monatliche Rate',
    calcNote: 'Beispielrechnung ohne Kaufnebenkosten. Keine Finanzierungsberatung und kein Angebot.',
    sellTitle: 'Sie möchten verkaufen?',
    sellText: 'Wir bewerten Ihre Immobilie realistisch und begleiten Sie bis zum Notartermin.',
    sellCta: 'Bewertung anfragen',
    close: 'Schließen',
    footer: 'Kernwerk Immobilien ist eine fiktive Marke. Alle Angebote sind erfunden.',
  },
  en: {
    nav: ['Listings', 'Financing', 'Sell'],
    saved: 'Shortlist',
    eyebrow: 'Real estate in Sample Town',
    title: ['Find your home.', 'Without detours.'],
    sub: 'Verified listings, honest descriptions and one personal contact – from the first click to the key handover.',
    buy: 'Buy',
    rent: 'Rent',
    where: 'District',
    anyDistrict: 'All districts',
    districts: ['Old Town', 'Harbour', 'Parkside'],
    roomsMin: 'Rooms from',
    search: 'Search',
    results: (n: number) => `${n} ${n === 1 ? 'listing' : 'listings'}`,
    maxPrice: 'Price up to',
    noResults: 'No listings with these filters – try fewer rooms or a higher price.',
    rooms: 'rooms',
    perMonth: '/ month',
    titles: ['Townhouse with garden', 'Bright apartment', 'Period flat with balcony', 'Architect house by the park', 'Semi-detached house', 'Compact studio', 'Top floor with a view', 'Family flat with terrace'],
    save: 'Save',
    unsave: 'Remove from shortlist',
    details: 'View details',
    expose: 'Request brochure',
    exposeDone: 'This is a demo – no request was sent. On your website the request would go straight to your inbox or CRM.',
    calcTitle: 'What would it cost per month?',
    calcSub: 'Rough sample calculation for a mortgage.',
    price: 'Purchase price',
    equity: 'Equity',
    rate: 'Interest p. a.',
    repay: 'Initial repayment',
    loan: 'Loan',
    monthly: 'Monthly payment',
    calcNote: 'Sample calculation without purchase costs. Not financial advice and not an offer.',
    sellTitle: 'Thinking of selling?',
    sellText: 'We value your property realistically and support you all the way to the notary appointment.',
    sellCta: 'Request a valuation',
    close: 'Close',
    footer: 'Kernwerk Immobilien is a fictional brand. All listings are made up.',
  },
};

function HouseSvg({ l, className }: { l: Listing; className?: string }) {
  const fh = 29;
  const h = l.floors * fh;
  const top = 168 - h;
  const cols = l.floors >= 3 ? 4 : 3;
  return (
    <svg viewBox="0 0 240 180" className={className} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <rect width="240" height="180" fill={l.sky} />
      <circle cx="150" cy="30" r="13" fill="#fff" opacity="0.6" />
      <rect x="0" y="166" width="240" height="14" fill="#cfd6c6" />
      <g>
        {l.roof === 'gable' ? <path d={`M52 ${top}L120 ${top - 34}L188 ${top}z`} fill={C.night} /> : <rect x="56" y={top - 6} width="128" height="6" fill={C.night} />}
        <rect x="60" y={top} width="120" height={h} fill={l.wall} />
        {Array.from({ length: l.floors }).map((_, f) =>
          Array.from({ length: cols }).map((__, c) => {
            const w = 100 / cols - 8;
            const isDoor = f === l.floors - 1 && c === Math.floor(cols / 2);
            return (
              <rect
                key={`${f}-${c}`}
                x={70 + c * (100 / cols) + 1}
                y={top + 8 + f * fh + (isDoor ? 4 : 0)}
                width={w}
                height={isDoor ? fh - 12 : 18}
                rx="1.5"
                fill={isDoor ? C.brass : '#2a3340'}
                opacity={isDoor ? 1 : 0.85}
              />
            );
          }),
        )}
      </g>
      <circle cx="34" cy="148" r="18" fill="#7c9472" />
      <rect x="32" y="150" width="4" height="18" fill="#5a4636" />
      <circle cx="210" cy="152" r="14" fill="#8ba37f" />
    </svg>
  );
}

export function KernwerkSite({ lang }: { lang: DemoLang }) {
  const t = T[lang];
  const reduced = useReducedMotion();
  const locale = lang === 'de' ? 'de-DE' : 'en-IE';
  const eur = useMemo(() => new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }), [locale]);
  const nf = useMemo(() => new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }), [locale]);

  const [mode, setMode] = useState<Mode>('buy');
  const [district, setDistrict] = useState(-1);
  const [roomsMin, setRoomsMin] = useState(1);
  const [maxBuy, setMaxBuy] = useState(800000);
  const [maxRent, setMaxRent] = useState(2500);
  const [saved, setSaved] = useState<number[]>([]);
  const [open, setOpen] = useState<Listing | null>(null);
  const [sent, setSent] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);

  const [price, setPrice] = useState(450000);
  const [equity, setEquity] = useState(90000);
  const [interest, setInterest] = useState(3.6);
  const [repay, setRepay] = useState(2);

  const maxPrice = mode === 'buy' ? maxBuy : maxRent;
  const results = LISTINGS.filter((l) => l.mode === mode && (district < 0 || l.district === district) && l.rooms >= roomsMin && l.price <= maxPrice);
  const loan = Math.max(0, price - equity);
  const monthly = (loan * ((interest + repay) / 100)) / 12;
  const interestShare = interest + repay > 0 ? interest / (interest + repay) : 0;

  const toggleSave = (id: number) => setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const reveal = reduced
    ? {}
    : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.6 } };

  const field = 'w-full rounded-xl border border-black/10 bg-white px-3.5 py-3 text-sm font-medium';

  return (
    <div className="min-h-screen overflow-x-clip" style={{ background: C.bg, color: C.ink }}>
      <header className="sticky top-10 z-40 border-b bg-white/90 backdrop-blur-md" style={{ borderColor: C.line }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a href="#suche" className="flex items-center gap-2 text-lg font-black uppercase tracking-[0.18em]">
            <span className="inline-block h-5 w-5 rotate-45 border-[3px]" style={{ borderColor: C.brass }} aria-hidden="true" />
            Kernwerk
          </a>
          <nav className="hidden gap-8 text-sm font-medium md:flex" aria-label="Kernwerk">
            {['#angebote', '#finanzierung', '#verkaufen'].map((h, i) => (
              <a key={h} href={h} className="opacity-75 hover:opacity-100">
                {t.nav[i]}
              </a>
            ))}
          </nav>
          <a href="#angebote" className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold" style={{ borderColor: C.line }} aria-label={`${t.saved}: ${saved.length}`}>
            <Heart size={15} aria-hidden="true" className={saved.length ? 'fill-current' : ''} style={saved.length ? { color: C.brass } : undefined} />
            <span className="hidden sm:inline">{t.saved}</span>
            <span className="tabular-nums">{saved.length}</span>
          </a>
        </div>
      </header>

      {/* Hero + search */}
      <section id="suche" className="relative scroll-mt-28 overflow-hidden" style={{ background: C.night, color: '#fff' }}>
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]" aria-hidden="true">
          <defs>
            <pattern id="kw-grid" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M56 0H0V56" fill="none" stroke="#fff" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#kw-grid)" />
        </svg>
        <div className="relative mx-auto max-w-7xl px-5 pb-28 pt-16 sm:px-8 sm:pt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: C.brass }}>
            {t.eyebrow}
          </p>
          <h1 className="mt-6 max-w-4xl text-[clamp(2.6rem,7vw,5.75rem)] font-black leading-[0.95] tracking-tight">
            {t.title[0]}
            <br />
            <span className="text-white/60">{t.title[1]}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/65">{t.sub}</p>
        </div>
        <div className="relative mx-auto -mb-px max-w-7xl px-5 sm:px-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              document.getElementById('angebote')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
            }}
            className="grid gap-3 rounded-t-3xl bg-white p-4 text-[#141414] shadow-2xl sm:p-5 md:grid-cols-[auto_1fr_1fr_auto]"
          >
            <div role="group" aria-label={`${t.buy} / ${t.rent}`} className="flex rounded-xl bg-black/5 p-1">
              {(['buy', 'rent'] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={mode === m}
                  onClick={() => setMode(m)}
                  className={cn('flex-1 rounded-lg px-5 py-2.5 text-sm font-semibold', mode === m ? 'bg-white shadow-sm' : 'opacity-70')}
                >
                  {t[m]}
                </button>
              ))}
            </div>
            <label className="block">
              <span className="sr-only">{t.where}</span>
              <select value={district} onChange={(e) => setDistrict(Number(e.target.value))} className={field}>
                <option value={-1}>{t.anyDistrict}</option>
                {t.districts.map((d, i) => (
                  <option key={d} value={i}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="sr-only">{t.roomsMin}</span>
              <select value={roomsMin} onChange={(e) => setRoomsMin(Number(e.target.value))} className={field}>
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {t.roomsMin} {r}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3 text-sm font-bold text-white" style={{ background: C.ink }}>
              <Search size={16} aria-hidden="true" />
              {t.search}
            </button>
          </form>
        </div>
      </section>

      {/* Listings */}
      <section id="angebote" className="mx-auto max-w-7xl scroll-mt-28 px-5 pb-20 pt-10 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-5 border-b pb-6" style={{ borderColor: C.line }}>
          <p className="text-2xl font-black" aria-live="polite">
            {t.results(results.length)}
          </p>
          <label className="flex min-w-[16rem] items-center gap-3 text-sm font-medium">
            <span className="shrink-0 opacity-75">{t.maxPrice}</span>
            <input
              type="range"
              min={mode === 'buy' ? 200000 : 600}
              max={mode === 'buy' ? 800000 : 2500}
              step={mode === 'buy' ? 10000 : 50}
              value={maxPrice}
              onChange={(e) => (mode === 'buy' ? setMaxBuy : setMaxRent)(Number(e.target.value))}
              aria-valuetext={eur.format(maxPrice)}
              className="w-full accent-[#a8844f]"
            />
            <span className="w-24 shrink-0 text-right font-bold tabular-nums">{eur.format(maxPrice)}</span>
          </label>
        </div>

        {results.length === 0 ? (
          <p className="mt-10 rounded-2xl bg-white p-6 text-sm opacity-70">{t.noResults}</p>
        ) : (
          <motion.ul layout={!reduced} className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {results.map((l) => {
                const isSaved = saved.includes(l.id);
                return (
                  <motion.li
                    key={l.id}
                    layout={!reduced}
                    initial={reduced ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0, scale: 0.96 }}
                    className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <HouseSvg l={l} className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
                      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold">{t[l.mode]}</span>
                      <button
                        type="button"
                        aria-pressed={isSaved}
                        aria-label={`${isSaved ? t.unsave : t.save}: ${t.titles[l.id]}`}
                        onClick={() => toggleSave(l.id)}
                        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 transition-transform active:scale-90"
                      >
                        <Heart size={16} aria-hidden="true" className={isSaved ? 'fill-current' : ''} style={{ color: isSaved ? C.brass : C.ink }} />
                      </button>
                    </div>
                    <div className="p-5">
                      <p className="flex items-center gap-1.5 text-xs font-medium opacity-70">
                        <MapPin size={12} aria-hidden="true" /> {t.districts[l.district]}
                      </p>
                      <h3 className="mt-1.5 text-lg font-bold">{t.titles[l.id]}</h3>
                      <p className="mt-3 flex gap-4 text-sm opacity-70">
                        <span className="flex items-center gap-1.5">
                          <BedDouble size={14} aria-hidden="true" /> {l.rooms} {t.rooms}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Maximize2 size={13} aria-hidden="true" /> {l.area} m²
                        </span>
                      </p>
                      <div className="mt-5 flex items-center justify-between border-t pt-4" style={{ borderColor: C.line }}>
                        <p className="text-xl font-black tabular-nums">
                          {eur.format(l.price)}
                          {l.mode === 'rent' ? <span className="text-xs font-medium opacity-70"> {t.perMonth}</span> : null}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setSent(false);
                            setOpen(l);
                          }}
                          aria-label={`${t.details}: ${t.titles[l.id]}`}
                          className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-transform group-hover:translate-x-0.5"
                          style={{ background: C.ink }}
                        >
                          <ArrowRight size={16} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>
        )}
      </section>

      {/* Calculator */}
      <section id="finanzierung" className="scroll-mt-28 border-y bg-white px-5 py-20 sm:px-8 sm:py-24" style={{ borderColor: C.line }}>
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <motion.div {...reveal}>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">{t.calcTitle}</h2>
            <p className="mt-4 text-lg opacity-75">{t.calcSub}</p>
            <div className="mt-10 space-y-7">
              {(
                [
                  [t.price, price, setPrice, 100000, 1200000, 5000, eur.format(price)],
                  [t.equity, equity, setEquity, 0, Math.max(0, price), 5000, eur.format(equity)],
                  [t.rate, interest, setInterest, 1, 7, 0.1, `${nf.format(interest)} %`],
                  [t.repay, repay, setRepay, 1, 5, 0.5, `${nf.format(repay)} %`],
                ] as [string, number, (v: number) => void, number, number, number, string][]
              ).map(([label, v, set, min, max, step, shown]) => (
                <label key={label} className="block">
                  <span className="mb-2 flex justify-between text-sm font-semibold">
                    {label}
                    <span className="tabular-nums">{shown}</span>
                  </span>
                  <input type="range" min={min} max={max} step={step} value={Math.min(v, max)} onChange={(e) => set(Number(e.target.value))} aria-valuetext={shown} className="w-full accent-[#a8844f]" />
                </label>
              ))}
            </div>
          </motion.div>
          <motion.div {...reveal} className="flex flex-col justify-center rounded-[2rem] p-8 text-white sm:p-10" style={{ background: C.night }}>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">{t.monthly}</p>
            <p className="mt-3 text-6xl font-black tabular-nums sm:text-7xl">{eur.format(Math.round(monthly))}</p>
            <div className="mt-8 h-3 overflow-hidden rounded-full bg-white/10">
              <motion.div className="h-full" style={{ background: C.brass }} initial={false} animate={{ width: `${interestShare * 100}%` }} />
            </div>
            <div className="mt-3 flex justify-between text-xs text-white/60">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: C.brass }} /> {t.rate}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white/30" /> {t.repay}
              </span>
            </div>
            <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 text-sm">
              <div>
                <dt className="text-white/50">{t.loan}</dt>
                <dd className="mt-1 text-lg font-bold tabular-nums">{eur.format(loan)}</dd>
              </div>
              <div>
                <dt className="text-white/50">{t.equity}</dt>
                <dd className="mt-1 text-lg font-bold tabular-nums">{eur.format(equity)}</dd>
              </div>
            </dl>
            <p className="mt-6 text-xs leading-relaxed text-white/60">{t.calcNote}</p>
          </motion.div>
        </div>
      </section>

      {/* Sell */}
      <section id="verkaufen" className="mx-auto max-w-7xl scroll-mt-28 px-5 py-20 sm:px-8 sm:py-24">
        <motion.div {...reveal} className="flex flex-col items-start justify-between gap-8 rounded-[2rem] p-8 sm:p-12 md:flex-row md:items-center" style={{ background: '#ece6da' }}>
          <div className="max-w-xl">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{t.sellTitle}</h2>
            <p className="mt-3 opacity-70">{t.sellText}</p>
          </div>
          <button type="button" onClick={() => setSellOpen(true)} className="inline-flex shrink-0 items-center gap-2 rounded-full px-7 py-4 text-sm font-bold text-white" style={{ background: C.ink }}>
            {t.sellCta} <ArrowRight size={16} aria-hidden="true" />
          </button>
        </motion.div>
      </section>

      <footer className="border-t px-5 py-8 text-center text-xs opacity-70" style={{ borderColor: C.line }}>
        {t.footer}
      </footer>

      <DemoDialog open={open !== null} onClose={() => setOpen(null)} title={open ? t.titles[open.id] : ''} closeLabel={t.close} className="bg-white text-[#141414]">
        {open && (
          <div>
            <div className="overflow-hidden rounded-2xl">
              <HouseSvg l={open} className="aspect-[4/3] w-full" />
            </div>
            <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm opacity-70">
              <span>{t.districts[open.district]}</span>
              <span>
                {open.rooms} {t.rooms}
              </span>
              <span>{open.area} m²</span>
            </p>
            <p className="mt-2 text-2xl font-black tabular-nums">
              {eur.format(open.price)}
              {open.mode === 'rent' ? <span className="text-sm font-medium opacity-70"> {t.perMonth}</span> : null}
            </p>
            {sent ? (
              <p role="status" className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
                {t.exposeDone}
              </p>
            ) : (
              <button type="button" onClick={() => setSent(true)} className="mt-5 w-full rounded-full py-3.5 text-sm font-bold text-white" style={{ background: C.ink }}>
                {t.expose}
              </button>
            )}
          </div>
        )}
      </DemoDialog>
      <DemoDialog open={sellOpen} onClose={() => setSellOpen(false)} title={t.sellCta} closeLabel={t.close} className="bg-white text-[#141414]">
        <p className="text-sm leading-relaxed">{t.exposeDone}</p>
      </DemoDialog>
    </div>
  );
}
