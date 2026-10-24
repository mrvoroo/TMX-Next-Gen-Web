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
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { DemoDialog } from '../DemoDialog';

const C = { bg: '#f4f5ef', ink: '#14261b', green: '#1f3d2b', lime: '#c6f36b', clay: '#d9a07b', card: '#e8ebe0' };
const FREE_SHIPPING = 49;

type Cat = 'all' | 'indoor' | 'cacti' | 'easy';

interface Product {
  id: number;
  /** Photo in /public/images/demos/plants (Unsplash licence, see docs/legal/image-credits.md). */
  img: string;
  bg: string;
  cats: Cat[];
  price: number;
  light: 1 | 2 | 3;
  water: 1 | 2 | 3;
}

const PRODUCTS: Product[] = [
  { id: 0, img: 'monstera', bg: '#dfe7d6', cats: ['indoor'], price: 34.9, light: 2, water: 2 },
  { id: 1, img: 'kugelkaktus', bg: '#efe3d4', cats: ['cacti', 'easy'], price: 14.5, light: 3, water: 1 },
  { id: 2, img: 'bogenhanf', bg: '#dde4dc', cats: ['indoor', 'easy'], price: 24.0, light: 1, water: 1 },
  { id: 3, img: 'efeutute', bg: '#e4ebd9', cats: ['indoor', 'easy'], price: 19.9, light: 2, water: 2 },
  { id: 4, img: 'pilea', bg: '#f0e6da', cats: ['indoor'], price: 29.0, light: 2, water: 3 },
  { id: 5, img: 'kolbenfaden', bg: '#dbe5df', cats: ['indoor', 'easy'], price: 32.0, light: 1, water: 2 },
  { id: 6, img: 'saeulenkaktus', bg: '#e8e4d8', cats: ['cacti', 'easy'], price: 11.9, light: 3, water: 1 },
  { id: 7, img: 'haworthia', bg: '#dfe6d4', cats: ['cacti', 'easy'], price: 12.9, light: 2, water: 1 },
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
    heroAlt: 'Zimmerpflanzen in hellen Töpfen auf einer Kommode vor einer weißen Wand',
    usp: [
      ['Versand in 2–3 Werktagen', Truck],
      ['30 Tage Rückgabe', Undo2],
      ['Pflegeanleitung zu jeder Pflanze', Leaf],
    ] as const,
    shopTitle: 'Unsere Pflanzen',
    cats: { all: 'Alle', indoor: 'Zimmerpflanzen', cacti: 'Kakteen & Sukkulenten', easy: 'Pflegeleicht' } as Record<Cat, string>,
    sort: 'Sortieren',
    sorts: { rec: 'Empfehlung', asc: 'Preis aufsteigend', desc: 'Preis absteigend' },
    names: ['Monstera „Lea“', 'Mini-Kaktus „Pico“', 'Bogenhanf „Sam“', 'Efeutute „Lou“', 'Pilea „Mo“', 'Kolbenfaden „Ida“', 'Säulenkaktus „Ben“', 'Haworthia „Ella“'],
    details: ['Ø 21 cm Topf · 65 cm hoch', 'Ø 9 cm Topf · 12 cm hoch', 'Ø 14 cm Topf · 45 cm hoch', 'Ø 12 cm Topf · hängend', 'Ø 12 cm Topf · 25 cm hoch', 'Ø 17 cm Topf · 50 cm hoch', 'Ø 9 cm Topf · 20 cm hoch', 'Ø 11 cm Topf · 14 cm hoch'],
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
    footer: 'Feldgrün ist eine fiktive Marke. Fotos: Unsplash (Unsplash-Lizenz).',
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
    heroAlt: 'Houseplants in light pots on a sideboard against a white wall',
    usp: [
      ['Delivery in 2–3 working days', Truck],
      ['30-day returns', Undo2],
      ['Care guide with every plant', Leaf],
    ] as const,
    shopTitle: 'Our plants',
    cats: { all: 'All', indoor: 'Houseplants', cacti: 'Cacti & succulents', easy: 'Easy care' } as Record<Cat, string>,
    sort: 'Sort',
    sorts: { rec: 'Recommended', asc: 'Price: low to high', desc: 'Price: high to low' },
    names: ['Monstera “Lea”', 'Mini cactus “Pico”', 'Snake plant “Sam”', 'Pothos “Lou”', 'Pilea “Mo”', 'Chinese evergreen “Ida”', 'Column cactus “Ben”', 'Haworthia “Ella”'],
    details: ['Ø 21 cm pot · 65 cm tall', 'Ø 9 cm pot · 12 cm tall', 'Ø 14 cm pot · 45 cm tall', 'Ø 12 cm pot · trailing', 'Ø 12 cm pot · 25 cm tall', 'Ø 17 cm pot · 50 cm tall', 'Ø 9 cm pot · 20 cm tall', 'Ø 11 cm pot · 14 cm tall'],
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
    footer: 'Feldgrün is a fictional brand. Photos: Unsplash (Unsplash License).',
  },
};

export function PlantSvg({ p, className, sizes = '(min-width: 1024px) 25vw, 50vw', priority = false }: { p: Pick<Product, 'img' | 'id'>; className?: string; sizes?: string; priority?: boolean }) {
  return (
    <Image
      src={`/images/demos/plants/${p.img}.webp`}
      alt=""
      fill
      sizes={sizes}
      priority={priority}
      className={cn('object-cover', className)}
    />
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
          <div className="relative h-72 overflow-hidden sm:h-96 lg:h-auto lg:min-h-[30rem]">
            <motion.div
              className="absolute inset-0"
              initial={reduced ? false : { scale: 1.08, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src="/images/demos/plants/hero-regal.webp"
                alt={t.heroAlt}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </motion.div>
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#1f3d2b] via-[#1f3d2b]/20 to-transparent lg:via-transparent" />
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
                  <PlantSvg p={p} className="transition-transform duration-700 group-hover:scale-105" />
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
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl" style={{ background: p.bg }}>
                          <PlantSvg p={p} sizes="64px" />
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
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl" style={{ background: quick.bg }}>
              <PlantSvg p={quick} sizes="(min-width: 640px) 240px, 90vw" />
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
