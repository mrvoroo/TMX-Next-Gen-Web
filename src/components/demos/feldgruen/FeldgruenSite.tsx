'use client';

/**
 * Concept demo: "Feldgrün" – online shop for plants with filters, sorting,
 * quick view and a cart with free-shipping progress. Fictional brand, sample
 * prices, no real checkout.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, Droplets, Eye, Minus, Plus, ShoppingBag, Sun, Truck, Undo2, Leaf, X } from 'lucide-react';
import type { DemoLang } from '@/config/demos';
import { cn } from '@/lib/utils';
import { DemoDialog } from '../DemoDialog';

const C = { bg: '#f4f5ef', ink: '#14261b', green: '#1f3d2b', lime: '#c6f36b', clay: '#d9a07b', card: '#e8ebe0' };
const FREE_SHIPPING = 49;

type Cat = 'all' | 'indoor' | 'cacti' | 'easy';
type Shape = 'monstera' | 'round' | 'cactus' | 'snake' | 'trailing' | 'palm';

interface Product {
  id: number;
  shape: Shape;
  leaf: string;
  pot: string;
  bg: string;
  cats: Cat[];
  price: number;
  light: 1 | 2 | 3;
  water: 1 | 2 | 3;
}

const PRODUCTS: Product[] = [
  { id: 0, shape: 'monstera', leaf: '#2f7a4b', pot: '#e9e2d6', bg: '#dfe7d6', cats: ['indoor'], price: 34.9, light: 2, water: 2 },
  { id: 1, shape: 'cactus', leaf: '#5d8f5a', pot: '#d9a07b', bg: '#efe3d4', cats: ['cacti', 'easy'], price: 14.5, light: 3, water: 1 },
  { id: 2, shape: 'snake', leaf: '#3e6b45', pot: '#1f3d2b', bg: '#dde4dc', cats: ['indoor', 'easy'], price: 24.0, light: 1, water: 1 },
  { id: 3, shape: 'trailing', leaf: '#4f9a5f', pot: '#f4f5ef', bg: '#e4ebd9', cats: ['indoor', 'easy'], price: 19.9, light: 2, water: 2 },
  { id: 4, shape: 'round', leaf: '#6aa56b', pot: '#c97f5c', bg: '#f0e6da', cats: ['indoor'], price: 29.0, light: 2, water: 3 },
  { id: 5, shape: 'palm', leaf: '#3f8a58', pot: '#e9e2d6', bg: '#dbe5df', cats: ['indoor'], price: 49.0, light: 3, water: 2 },
  { id: 6, shape: 'cactus', leaf: '#7ba36a', pot: '#f4f5ef', bg: '#e8e4d8', cats: ['cacti', 'easy'], price: 11.9, light: 3, water: 1 },
  { id: 7, shape: 'round', leaf: '#2f6e48', pot: '#1f3d2b', bg: '#dfe6d4', cats: ['indoor', 'easy'], price: 22.5, light: 1, water: 2 },
];

const T = {
  de: {
    nav: ['Shop', 'Pflege', 'Über uns'],
    cart: 'Warenkorb',
    openCart: 'Warenkorb öffnen',
    items: 'Artikel',
    heroEyebrow: 'Neue Lieblingspflanzen',
    heroTitle: ['Mehr Grün.', 'Weniger Aufwand.'],
    heroSub: 'Pflanzen, die zu Ihrem Zuhause passen – mit ehrlicher Pflegeanleitung und sicher verpackt bis an die Tür.',
    heroCta: 'Jetzt entdecken',
    heroFinder: 'Pflegeleichte zeigen',
    usp: [
      ['Versand in 2–3 Werktagen', Truck],
      ['30 Tage Rückgabe', Undo2],
      ['Pflegeanleitung zu jeder Pflanze', Leaf],
    ] as const,
    shopTitle: 'Unsere Pflanzen',
    cats: { all: 'Alle', indoor: 'Zimmerpflanzen', cacti: 'Kakteen & Sukkulenten', easy: 'Pflegeleicht' } as Record<Cat, string>,
    sort: 'Sortieren',
    sorts: { rec: 'Empfehlung', asc: 'Preis aufsteigend', desc: 'Preis absteigend' },
    names: ['Monstera „Lea“', 'Kugelkaktus „Pico“', 'Bogenhanf „Sam“', 'Efeutute „Lou“', 'Pilea „Mo“', 'Kentia-Palme „Ida“', 'Säulenkaktus „Ben“', 'Glücksfeder „Ella“'],
    details: ['Ø 21 cm Topf · 65 cm hoch', 'Ø 9 cm Topf · 12 cm hoch', 'Ø 14 cm Topf · 45 cm hoch', 'Ø 12 cm Topf · hängend', 'Ø 12 cm Topf · 25 cm hoch', 'Ø 24 cm Topf · 110 cm hoch', 'Ø 9 cm Topf · 20 cm hoch', 'Ø 14 cm Topf · 40 cm hoch'],
    add: 'In den Warenkorb',
    added: 'Hinzugefügt',
    quick: 'Schnellansicht',
    light: 'Licht',
    water: 'Wasser',
    levels: ['wenig', 'mittel', 'viel'],
    priceNote: 'Beispielpreise inkl. MwSt.',
    cartEmpty: 'Ihr Warenkorb ist noch leer.',
    toFree: (v: string) => `Noch ${v} bis zum kostenlosen Versand`,
    freeReached: 'Kostenloser Versand – geschafft!',
    subtotal: 'Zwischensumme',
    checkout: 'Zur Kasse',
    close: 'Schließen',
    dec: 'Menge verringern',
    inc: 'Menge erhöhen',
    checkoutTitle: 'Demo-Kasse',
    checkoutText: 'Das ist eine Demo – es wird nichts verkauft und keine Zahlung ausgelöst. In Ihrem Shop ginge es hier zu Adresse, Versand und Zahlung.',
    careTitle: 'Pflege, die einfach klappt',
    careSub: 'Zu jeder Pflanze gibt es eine kurze Anleitung – verständlich und ohne Fachchinesisch.',
    careSteps: [
      ['Standort finden', 'Hell, halbschattig oder schattig – wir sagen Ihnen, was passt.'],
      ['Richtig gießen', 'Lieber seltener und gründlich als jeden Tag ein bisschen.'],
      ['Wachsen lassen', 'Einmal im Monat düngen, im Frühjahr umtopfen.'],
    ],
    newsletterTitle: 'Pflanzentipps per E-Mail',
    newsletterText: 'Einmal im Monat, jederzeit abbestellbar.',
    newsletterBtn: 'Anmelden',
    newsletterDone: 'Demo – es wurde nichts gespeichert oder versendet.',
    email: 'E-Mail-Adresse',
    footer: 'Feldgrün ist eine fiktive Marke.',
  },
  en: {
    nav: ['Shop', 'Care', 'About'],
    cart: 'Cart',
    openCart: 'Open cart',
    items: 'items',
    heroEyebrow: 'New favourite plants',
    heroTitle: ['More green.', 'Less effort.'],
    heroSub: 'Plants that suit your home – with honest care guides and safely packed all the way to your door.',
    heroCta: 'Shop now',
    heroFinder: 'Show easy-care plants',
    usp: [
      ['Delivery in 2–3 working days', Truck],
      ['30-day returns', Undo2],
      ['Care guide with every plant', Leaf],
    ] as const,
    shopTitle: 'Our plants',
    cats: { all: 'All', indoor: 'Houseplants', cacti: 'Cacti & succulents', easy: 'Easy care' } as Record<Cat, string>,
    sort: 'Sort',
    sorts: { rec: 'Recommended', asc: 'Price: low to high', desc: 'Price: high to low' },
    names: ['Monstera “Lea”', 'Ball cactus “Pico”', 'Snake plant “Sam”', 'Pothos “Lou”', 'Pilea “Mo”', 'Kentia palm “Ida”', 'Column cactus “Ben”', 'ZZ plant “Ella”'],
    details: ['Ø 21 cm pot · 65 cm tall', 'Ø 9 cm pot · 12 cm tall', 'Ø 14 cm pot · 45 cm tall', 'Ø 12 cm pot · trailing', 'Ø 12 cm pot · 25 cm tall', 'Ø 24 cm pot · 110 cm tall', 'Ø 9 cm pot · 20 cm tall', 'Ø 14 cm pot · 40 cm tall'],
    add: 'Add to cart',
    added: 'Added',
    quick: 'Quick view',
    light: 'Light',
    water: 'Water',
    levels: ['low', 'medium', 'high'],
    priceNote: 'Sample prices incl. VAT.',
    cartEmpty: 'Your cart is still empty.',
    toFree: (v: string) => `${v} more for free shipping`,
    freeReached: 'Free shipping – unlocked!',
    subtotal: 'Subtotal',
    checkout: 'Checkout',
    close: 'Close',
    dec: 'Decrease quantity',
    inc: 'Increase quantity',
    checkoutTitle: 'Demo checkout',
    checkoutText: 'This is a demo – nothing is sold and no payment is made. In your shop this step would lead to address, shipping and payment.',
    careTitle: 'Care that just works',
    careSub: 'Every plant comes with a short guide – clear and free of jargon.',
    careSteps: [
      ['Find the spot', 'Bright, partial shade or shade – we tell you what fits.'],
      ['Water right', 'Less often and thoroughly beats a little every day.'],
      ['Let it grow', 'Feed once a month, repot in spring.'],
    ],
    newsletterTitle: 'Plant tips by email',
    newsletterText: 'Once a month, unsubscribe any time.',
    newsletterBtn: 'Sign up',
    newsletterDone: 'Demo – nothing was saved or sent.',
    email: 'Email address',
    footer: 'Feldgrün is a fictional brand.',
  },
};

export function PlantSvg({ p, className }: { p: Pick<Product, 'shape' | 'leaf' | 'pot'>; className?: string }) {
  const { leaf, pot } = p;
  return (
    <svg viewBox="0 0 200 220" className={className} aria-hidden="true">
      <ellipse cx="100" cy="206" rx="52" ry="7" fill="#000" opacity="0.08" />
      {p.shape === 'monstera' && (
        <g fill={leaf}>
          {[-40, -12, 18, 44].map((r, i) => (
            <g key={i} transform={`rotate(${r} 100 140)`}>
              <path d="M100 140C70 120 64 70 100 40c36 30 30 80 0 100z" />
              <path d="M100 52v80M100 80l-18-10M100 100l20-12M100 70l16-10" stroke="#fff" strokeOpacity="0.35" strokeWidth="3" />
            </g>
          ))}
        </g>
      )}
      {p.shape === 'round' && (
        <g>
          <path d="M100 150V90M100 120l-30-30M100 110l32-36M100 132l-40-8M100 128l38-4" stroke={leaf} strokeWidth="4" />
          {[
            [70, 88, 20],
            [132, 72, 22],
            [60, 122, 17],
            [138, 122, 18],
            [100, 70, 24],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={leaf} opacity={0.85 + i * 0.03} />
          ))}
        </g>
      )}
      {p.shape === 'cactus' && (
        <g fill={leaf}>
          <rect x="82" y="60" width="36" height="100" rx="18" />
          <rect x="54" y="92" width="22" height="46" rx="11" />
          <rect x="62" y="122" width="26" height="14" rx="7" />
          <rect x="124" y="80" width="22" height="50" rx="11" />
          <rect x="112" y="114" width="26" height="14" rx="7" />
          <g stroke="#fff" strokeOpacity="0.45" strokeWidth="2">
            <path d="M100 70v80M90 76v70M110 76v70" />
          </g>
          <circle cx="100" cy="58" r="7" fill="#f28da4" />
        </g>
      )}
      {p.shape === 'snake' && (
        <g fill={leaf}>
          {[-16, -6, 4, 14].map((r, i) => (
            <path key={i} transform={`rotate(${r} 100 150)`} d={`M100 150c-12-30-10-${70 + i * 10} 0-${100 + i * 8}c10 ${30 + i * 8} 12 ${70 + i * 10} 0 ${100 + i * 8}z`} opacity={1 - i * 0.08} />
          ))}
          <path d="M96 140c-4-30-4-60 4-90" stroke="#d8e9a8" strokeOpacity="0.5" strokeWidth="3" fill="none" />
        </g>
      )}
      {p.shape === 'trailing' && (
        <g fill={leaf}>
          {[
            [100, 130],
            [80, 120],
            [120, 118],
            [60, 150],
            [140, 150],
            [50, 180],
            [152, 182],
            [92, 110],
          ].map(([x, y], i) => (
            <path key={i} d={`M${x} ${y}c-14-4-18-20-6-28 6 4 16 14 6 28z`} transform={`rotate(${i * 37} ${x} ${y})`} />
          ))}
          <path d="M70 150c-20 10-20 30-18 40M130 150c20 10 22 30 20 40" stroke={leaf} strokeWidth="3" fill="none" />
        </g>
      )}
      {p.shape === 'palm' && (
        <g stroke={leaf} strokeWidth="5" fill="none" strokeLinecap="round">
          {[-60, -30, 0, 30, 60].map((r, i) => (
            <g key={i} transform={`rotate(${r} 100 150)`}>
              <path d="M100 150C100 110 100 80 100 30" />
              {[50, 66, 82, 98, 114].map((y) => (
                <path key={y} d={`M100 ${y}l-16 10M100 ${y}l16 10`} strokeWidth="4" />
              ))}
            </g>
          ))}
        </g>
      )}
      <path d="M62 150h76l-8 50a8 8 0 0 1-8 6H78a8 8 0 0 1-8-6z" fill={pot} stroke="#14261b" strokeOpacity="0.12" strokeWidth="2" />
      <rect x="58" y="144" width="84" height="12" rx="4" fill={pot} stroke="#14261b" strokeOpacity="0.12" strokeWidth="2" />
    </svg>
  );
}

function Level({ n, icon: Icon, label }: { n: number; icon: typeof Sun; label: string }) {
  return (
    <span role="img" className="inline-flex items-center gap-1" title={label} aria-label={label}>
      {[1, 2, 3].map((i) => (
        <Icon key={i} size={12} aria-hidden="true" className={i <= n ? 'opacity-90' : 'opacity-20'} />
      ))}
    </span>
  );
}

export function FeldgruenSite({ lang }: { lang: DemoLang }) {
  const t = T[lang];
  const reduced = useReducedMotion();
  const eur = useMemo(() => new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'en-IE', { style: 'currency', currency: 'EUR' }), [lang]);
  const [cat, setCat] = useState<Cat>('all');
  const [sort, setSort] = useState<'rec' | 'asc' | 'desc'>('rec');
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [quick, setQuick] = useState<Product | null>(null);
  const [checkout, setCheckout] = useState(false);
  const [justAdded, setJustAdded] = useState<number | null>(null);
  const [newsDone, setNewsDone] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    if (cartOpen) closeRef.current?.focus();
  }, [cartOpen]);

  const list = useMemo(() => {
    const l = PRODUCTS.filter((p) => cat === 'all' || p.cats.includes(cat));
    if (sort === 'asc') return [...l].sort((a, b) => a.price - b.price);
    if (sort === 'desc') return [...l].sort((a, b) => b.price - a.price);
    return l;
  }, [cat, sort]);

  const count = Object.values(cart).reduce((s, q) => s + q, 0);
  const subtotal = Object.entries(cart).reduce((s, [id, q]) => s + PRODUCTS[Number(id)].price * q, 0);
  const progress = Math.min(1, subtotal / FREE_SHIPPING);

  const add = (id: number) => {
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
    setJustAdded(id);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setJustAdded(null), 1400);
  };
  const setQty = (id: number, q: number) =>
    setCart((c) => {
      const n = { ...c };
      if (q <= 0) delete n[id];
      else n[id] = q;
      return n;
    });

  const reveal = reduced
    ? {}
    : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <div className="min-h-screen overflow-x-clip" style={{ background: C.bg, color: C.ink }}>
      <header className="sticky top-10 z-40 border-b border-black/5 backdrop-blur-md" style={{ background: `${C.bg}e6` }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <a href="#shop" className="flex items-center gap-2 text-xl font-black tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: C.green, color: C.lime }}>
              <Leaf size={16} aria-hidden="true" />
            </span>
            feldgrün
          </a>
          <nav className="hidden gap-8 text-sm font-semibold md:flex" aria-label="Feldgrün">
            {['#shop', '#pflege', '#newsletter'].map((h, i) => (
              <a key={h} href={h} className="opacity-75 hover:opacity-100">
                {t.nav[i]}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`${t.openCart} (${count} ${t.items})`}
            className="relative inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white"
            style={{ background: C.green }}
          >
            <ShoppingBag size={16} aria-hidden="true" />
            <span className="hidden sm:inline">{t.cart}</span>
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={reduced ? false : { scale: 0.3 }}
                  animate={{ scale: 1 }}
                  className="flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold"
                  style={{ background: C.lime, color: C.ink }}
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-5 pt-6 sm:px-8 sm:pt-8">
        <div className="relative grid overflow-hidden rounded-[2.5rem] lg:grid-cols-[1.05fr_1fr]" style={{ background: C.green, color: '#fff' }}>
          <div className="relative z-10 p-8 sm:p-12 lg:p-16">
            <p className="inline-flex rounded-full px-3 py-1 text-xs font-bold" style={{ background: C.lime, color: C.ink }}>
              {t.heroEyebrow}
            </p>
            <h1 className="mt-6 text-[clamp(2.6rem,7vw,5.5rem)] font-black leading-[0.92] tracking-tight">
              {t.heroTitle[0]}
              <br />
              <span style={{ color: C.lime }}>{t.heroTitle[1]}</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/75 sm:text-lg">{t.heroSub}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#shop" className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold" style={{ background: C.lime, color: C.ink }}>
                {t.heroCta} <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a
                href="#shop"
                onClick={() => setCat('easy')}
                className="inline-flex items-center rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold text-white/90 hover:bg-white/10"
              >
                {t.heroFinder}
              </a>
            </div>
          </div>
          <div className="relative h-72 sm:h-96 lg:h-auto">
            <div className="absolute inset-0" style={{ background: 'radial-gradient(60% 60% at 60% 50%, #2f5c40 0%, transparent 70%)' }} />
            {[
              { p: PRODUCTS[5], cls: 'left-[8%] bottom-0 w-[46%]', d: 0 },
              { p: PRODUCTS[0], cls: 'right-[4%] bottom-0 w-[44%]', d: 0.15 },
              { p: PRODUCTS[1], cls: 'left-[42%] bottom-0 w-[24%]', d: 0.3 },
            ].map(({ p, cls, d }) => (
              <motion.div
                key={p.id}
                className={cn('absolute', cls)}
                initial={reduced ? false : { y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: d, ease: [0.22, 1, 0.36, 1] }}
              >
                <PlantSvg p={p} className="w-full" />
              </motion.div>
            ))}
          </div>
        </div>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {t.usp.map(([label, Icon]) => (
            <li key={label} className="flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold" style={{ background: C.card }}>
              <Icon size={18} aria-hidden="true" style={{ color: C.green }} />
              {label}
            </li>
          ))}
        </ul>
      </section>

      {/* Shop */}
      <section id="shop" className="mx-auto max-w-7xl scroll-mt-28 px-5 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">{t.shopTitle}</h2>
          <label className="flex items-center gap-2 text-sm font-semibold">
            {t.sort}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium"
            >
              {(['rec', 'asc', 'desc'] as const).map((s) => (
                <option key={s} value={s}>
                  {t.sorts[s]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div role="group" aria-label={t.shopTitle} className="mt-6 flex flex-wrap gap-2">
          {(Object.keys(t.cats) as Cat[]).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={cn('rounded-full px-4 py-2 text-sm font-semibold transition-colors', cat === c ? 'text-white' : 'bg-white hover:bg-black/5')}
              style={cat === c ? { background: C.green } : undefined}
            >
              {t.cats[c]}
            </button>
          ))}
        </div>

        <motion.ul layout={!reduced} className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <motion.li
                key={p.id}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduced ? undefined : { opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.3 }}
                className="group flex min-w-0 flex-col overflow-hidden rounded-3xl bg-white"
              >
                <div className="relative aspect-[4/5] overflow-hidden" style={{ background: p.bg }}>
                  <PlantSvg p={p} className="absolute inset-x-[8%] bottom-[4%] w-[84%] transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1" />
                  <button
                    type="button"
                    onClick={() => setQuick(p)}
                    aria-label={`${t.quick}: ${t.names[p.id]}`}
                    className="absolute right-3 top-3 rounded-full bg-white/85 p-2 opacity-100 shadow-sm transition-opacity hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                  >
                    <Eye size={15} aria-hidden="true" />
                  </button>
                </div>
                <div className="flex flex-1 flex-col p-3.5 sm:p-5">
                  <p className="text-sm font-bold sm:text-base">{t.names[p.id]}</p>
                  <p className="mt-0.5 text-[11px] opacity-70 sm:text-xs">{t.details[p.id]}</p>
                  <div className="mt-2.5 flex flex-wrap gap-3 text-[11px]" style={{ color: C.green }}>
                    <Level n={p.light} icon={Sun} label={`${t.light}: ${t.levels[p.light - 1]}`} />
                    <Level n={p.water} icon={Droplets} label={`${t.water}: ${t.levels[p.water - 1]}`} />
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                    <span className="text-base font-black tabular-nums sm:text-lg">{eur.format(p.price)}</span>
                    <button
                      type="button"
                      onClick={() => add(p.id)}
                      aria-label={`${t.add}: ${t.names[p.id]}`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors"
                      style={{ background: justAdded === p.id ? C.lime : C.green, color: justAdded === p.id ? C.ink : '#fff' }}
                    >
                      {justAdded === p.id ? <Check size={17} aria-hidden="true" /> : <Plus size={17} aria-hidden="true" />}
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
        <p className="mt-4 text-xs opacity-70">{t.priceNote}</p>
        <p className="sr-only" aria-live="polite">
          {count} {t.items}
        </p>
      </section>

      {/* Care */}
      <section id="pflege" className="scroll-mt-28 px-5 py-16 sm:px-8 sm:py-24" style={{ background: C.card }}>
        <div className="mx-auto max-w-7xl">
          <motion.div {...reveal} className="max-w-2xl">
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">{t.careTitle}</h2>
            <p className="mt-4 text-lg opacity-70">{t.careSub}</p>
          </motion.div>
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {t.careSteps.map(([title, text], i) => (
              <motion.li key={title} {...reveal} className="rounded-3xl bg-white p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-full text-lg font-black" style={{ background: C.lime }}>
                  {i + 1}
                </span>
                <h3 className="mt-6 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed opacity-75">{text}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="mx-auto max-w-7xl scroll-mt-28 px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid items-center gap-8 rounded-[2.5rem] p-8 sm:p-12 lg:grid-cols-2" style={{ background: C.lime }}>
          <div>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{t.newsletterTitle}</h2>
            <p className="mt-2 opacity-70">{t.newsletterText}</p>
          </div>
          {newsDone ? (
            <p role="status" className="rounded-2xl bg-white/70 p-4 text-sm font-semibold">
              {t.newsletterDone}
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setNewsDone(true);
              }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="fg-email" className="sr-only">
                {t.email}
              </label>
              <input id="fg-email" type="email" required placeholder={t.email} autoComplete="off" className="min-w-0 flex-1 rounded-full bg-white px-5 py-3.5 text-sm" />
              <button type="submit" className="rounded-full px-7 py-3.5 text-sm font-bold text-white" style={{ background: C.ink }}>
                {t.newsletterBtn}
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="border-t border-black/10 px-5 py-8 text-center text-xs opacity-70">{t.footer}</footer>

      {/* Cart drawer */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-[90]" onKeyDown={(e) => e.key === 'Escape' && setCartOpen(false)}>
            <motion.button
              type="button"
              tabIndex={-1}
              aria-label={t.close}
              className="absolute inset-0 bg-black/40"
              onClick={() => setCartOpen(false)}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label={t.cart}
              initial={reduced ? false : { x: '100%' }}
              animate={{ x: 0 }}
              exit={reduced ? undefined : { x: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
              className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col pt-10"
              style={{ background: C.bg }}
            >
              <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
                <p className="text-lg font-black">
                  {t.cart} <span className="text-sm font-semibold opacity-70">({count})</span>
                </p>
                <button ref={closeRef} type="button" onClick={() => setCartOpen(false)} aria-label={t.close} className="rounded-full p-2 hover:bg-black/5">
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
              <div className="px-6 py-4">
                <p className="text-sm font-semibold">{progress >= 1 ? t.freeReached : t.toFree(eur.format(FREE_SHIPPING - subtotal))}</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/10">
                  <motion.div className="h-full rounded-full" style={{ background: C.green }} initial={false} animate={{ width: `${progress * 100}%` }} />
                </div>
              </div>
              {count === 0 ? (
                <p className="px-6 py-8 text-sm opacity-75">{t.cartEmpty}</p>
              ) : (
                <ul className="flex-1 space-y-3 overflow-y-auto px-6 py-2">
                  {Object.entries(cart).map(([id, q]) => {
                    const p = PRODUCTS[Number(id)];
                    return (
                      <li key={id} className="flex items-center gap-4 rounded-2xl bg-white p-3">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl" style={{ background: p.bg }}>
                          <PlantSvg p={p} className="h-full w-full" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold">{t.names[p.id]}</p>
                          <p className="text-sm tabular-nums opacity-75">{eur.format(p.price * q)}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button type="button" aria-label={`${t.dec}: ${t.names[p.id]}`} onClick={() => setQty(p.id, q - 1)} className="rounded-full border border-black/10 p-1.5">
                            <Minus size={12} aria-hidden="true" />
                          </button>
                          <span className="w-5 text-center text-sm font-bold tabular-nums">{q}</span>
                          <button type="button" aria-label={`${t.inc}: ${t.names[p.id]}`} onClick={() => setQty(p.id, q + 1)} className="rounded-full border border-black/10 p-1.5">
                            <Plus size={12} aria-hidden="true" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
              <div className="mt-auto border-t border-black/10 p-6">
                <div className="flex justify-between text-base font-bold">
                  <span>{t.subtotal}</span>
                  <span className="tabular-nums">{eur.format(subtotal)}</span>
                </div>
                <button
                  type="button"
                  disabled={count === 0}
                  onClick={() => setCheckout(true)}
                  className="mt-4 w-full rounded-full py-4 text-sm font-bold text-white disabled:opacity-40"
                  style={{ background: C.green }}
                >
                  {t.checkout}
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <DemoDialog open={quick !== null} onClose={() => setQuick(null)} title={quick ? t.names[quick.id] : ''} closeLabel={t.close} className="bg-white text-[#14261b]">
        {quick && (
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl p-4" style={{ background: quick.bg }}>
              <PlantSvg p={quick} className="w-full" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm opacity-75">{t.details[quick.id]}</p>
              <p className="mt-3 text-2xl font-black tabular-nums">{eur.format(quick.price)}</p>
              <div className="mt-4 space-y-2 text-sm" style={{ color: C.green }}>
                <p className="flex items-center gap-2">
                  <Level n={quick.light} icon={Sun} label={t.light} /> {t.light}: {t.levels[quick.light - 1]}
                </p>
                <p className="flex items-center gap-2">
                  <Level n={quick.water} icon={Droplets} label={t.water} /> {t.water}: {t.levels[quick.water - 1]}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  add(quick.id);
                  setQuick(null);
                }}
                className="mt-auto rounded-full py-3.5 text-sm font-bold text-white"
                style={{ background: C.green, marginTop: '1.5rem' }}
              >
                {t.add}
              </button>
            </div>
          </div>
        )}
      </DemoDialog>
      <DemoDialog open={checkout} onClose={() => setCheckout(false)} title={t.checkoutTitle} closeLabel={t.close} className="bg-white text-[#14261b]">
        <p className="text-sm leading-relaxed">{t.checkoutText}</p>
      </DemoDialog>
    </div>
  );
}
