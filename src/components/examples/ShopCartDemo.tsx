'use client';

/**
 * Interactive example for "E-Commerce-Shops": a small plant shop with a
 * working cart (add, quantity, remove, subtotal). Fictional brand, sample
 * prices, no real checkout and no network requests.
 */

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useLocale } from 'next-intl';
import { currencyFormatter, useExamplesText } from '@/lib/i18n/examples';
import type { Locale } from '@/lib/i18n/translations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';
import { BrowserChrome } from './ExampleFrame';

const PLANT_COLORS = [
  { bg: 'linear-gradient(160deg,#1f3b2d,#0f1f17)', leaf: '#4ade80', pot: '#e7d8c9' },
  { bg: 'linear-gradient(160deg,#2c3324,#141a10)', leaf: '#a3b18a', pot: '#c08457' },
  { bg: 'linear-gradient(160deg,#1c2f33,#0c1a1d)', leaf: '#5eead4', pot: '#f1f5f9' },
];

function PlantArt({ variant }: { variant: number }) {
  const c = PLANT_COLORS[variant % PLANT_COLORS.length];
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
      {variant === 0 && (
        <g fill={c.leaf}>
          <path d="M60 70C40 60 30 38 42 22c10 14 18 30 18 48z" />
          <path d="M60 70c20-10 30-32 18-48-10 14-18 30-18 48z" opacity="0.85" />
          <path d="M60 72C44 72 24 62 20 44c16 2 32 12 40 28z" opacity="0.7" />
        </g>
      )}
      {variant === 1 && (
        <g>
          <rect x="58" y="34" width="4" height="40" fill="#6b4f3a" />
          <circle cx="60" cy="34" r="22" fill={c.leaf} />
          <circle cx="46" cy="40" r="12" fill={c.leaf} opacity="0.8" />
          <circle cx="74" cy="42" r="13" fill={c.leaf} opacity="0.75" />
        </g>
      )}
      {variant === 2 && (
        <g fill={c.leaf}>
          <path d="M52 74c-4-20-2-40 4-56 4 18 4 38 2 56z" />
          <path d="M62 74c0-22 6-40 14-50 0 20-6 38-10 50z" opacity="0.85" />
          <path d="M46 74c-8-14-12-28-10-42 8 12 12 28 14 42z" opacity="0.7" />
        </g>
      )}
      <path d="M38 72h44l-5 30a6 6 0 0 1-6 5H49a6 6 0 0 1-6-5z" fill={c.pot} />
      <rect x="35" y="68" width="50" height="8" rx="3" fill={c.pot} opacity="0.85" />
    </svg>
  );
}

export function ShopCartDemo() {
  const t = useExamplesText().shop;
  const locale = useLocale() as Locale;
  const fmt = currencyFormatter(locale);
  const reduced = useReducedMotion();

  const [cart, setCart] = useState<Record<number, number>>({});
  const [justAdded, setJustAdded] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [bump, setBump] = useState(0);
  const timer = useRef<number | undefined>(undefined);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  const count = Object.values(cart).reduce((s, q) => s + q, 0);
  const subtotal = Object.entries(cart).reduce(
    (s, [i, q]) => s + t.products[Number(i)].price * q,
    0,
  );

  const add = (i: number) => {
    setCart((c) => ({ ...c, [i]: (c[i] ?? 0) + 1 }));
    setJustAdded(i);
    setBump((b) => b + 1);
    setCheckedOut(false);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setJustAdded(null), 1300);
  };
  const setQty = (i: number, q: number) =>
    setCart((c) => {
      const next = { ...c };
      if (q <= 0) delete next[i];
      else next[i] = q;
      return next;
    });

  const spring = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 420, damping: 32 };

  return (
    <BrowserChrome url="gruenraum.example/shop">
      <div className="relative overflow-hidden bg-[#0a0d0b]" style={{ minHeight: 430 }}>
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
          <span className="text-sm font-black tracking-tight text-emerald-300">{t.brand}</span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={`${t.openCart} (${count} ${t.itemsInCart})`}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-white/80 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <ShoppingBag size={17} aria-hidden="true" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={bump}
                  initial={reduced ? false : { scale: 0.4 }}
                  animate={{ scale: 1 }}
                  transition={spring}
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-400 px-1 text-[10px] font-bold text-emerald-950"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
        <p className="sr-only" aria-live="polite">
          {count} {t.itemsInCart}
        </p>

        <ul className="grid gap-4 p-5 sm:grid-cols-3">
          {t.products.map((p, i) => (
            <li
              key={p.name}
              className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]"
            >
              <div
                className="aspect-[4/3] w-full p-4 transition-transform duration-500 group-hover:scale-[1.03]"
                style={{ background: PLANT_COLORS[i % PLANT_COLORS.length].bg }}
              >
                <PlantArt variant={i} />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="text-sm font-semibold text-white">{p.name}</p>
                <p className="text-xs text-white/40">{p.detail}</p>
                <p className="mt-2 text-sm font-semibold text-emerald-300">{fmt.format(p.price)}</p>
                <button
                  type="button"
                  onClick={() => add(i)}
                  className={cn(
                    'mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
                    justAdded === i
                      ? 'bg-emerald-400 text-emerald-950'
                      : 'bg-white/[0.07] text-white hover:bg-white/[0.12]',
                  )}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={justAdded === i ? 'added' : 'add'}
                      initial={reduced ? false : { y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={reduced ? undefined : { y: -8, opacity: 0 }}
                      transition={{ duration: reduced ? 0 : 0.18 }}
                      className="inline-flex items-center gap-1.5"
                    >
                      {justAdded === i ? <Check size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
                      {justAdded === i ? t.added : t.add}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>
            </li>
          ))}
        </ul>
        <p className="px-5 pb-4 text-[11px] text-white/30">{t.priceNote}</p>

        <AnimatePresence>
          {open && (
            <>
              <motion.button
                type="button"
                aria-label={t.close}
                tabIndex={-1}
                onClick={() => setOpen(false)}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduced ? undefined : { opacity: 0 }}
                className="absolute inset-0 bg-black/50"
              />
              <motion.div
                role="dialog"
                aria-label={t.cart}
                onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
                initial={reduced ? false : { x: '100%' }}
                animate={{ x: 0 }}
                exit={reduced ? undefined : { x: '100%' }}
                transition={spring}
                className="absolute inset-y-0 right-0 flex w-full max-w-xs flex-col border-l border-white/[0.08] bg-[#0f1311] p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{t.cart}</p>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label={t.close}
                    className="rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                </div>
                {count === 0 ? (
                  <p className="text-sm text-white/50">{t.empty}</p>
                ) : (
                  <ul className="flex-1 space-y-3 overflow-y-auto">
                    {Object.entries(cart).map(([key, q]) => {
                      const i = Number(key);
                      const p = t.products[i];
                      return (
                        <li key={key} className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-2.5">
                          <div
                            className="h-11 w-11 shrink-0 rounded-lg p-1"
                            style={{ background: PLANT_COLORS[i % PLANT_COLORS.length].bg }}
                          >
                            <PlantArt variant={i} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-white">{p.name}</p>
                            <p className="text-[11px] text-white/45">{fmt.format(p.price * q)}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button type="button" aria-label={`${t.qtyDec}: ${p.name}`} onClick={() => setQty(i, q - 1)} className="rounded-md p-1 text-white/60 hover:bg-white/10 hover:text-white">
                              {q === 1 ? <Trash2 size={13} aria-hidden="true" /> : <Minus size={13} aria-hidden="true" />}
                            </button>
                            <span className="w-5 text-center text-xs text-white">{q}</span>
                            <button type="button" aria-label={`${t.qtyInc}: ${p.name}`} onClick={() => setQty(i, q + 1)} className="rounded-md p-1 text-white/60 hover:bg-white/10 hover:text-white">
                              <Plus size={13} aria-hidden="true" />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <div className="mt-4 border-t border-white/[0.08] pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">{t.subtotal}</span>
                    <span className="font-semibold text-white">{fmt.format(subtotal)}</span>
                  </div>
                  <button
                    type="button"
                    disabled={count === 0}
                    onClick={() => setCheckedOut(true)}
                    className="mt-4 w-full rounded-xl bg-emerald-400 py-2.5 text-sm font-semibold text-emerald-950 transition-opacity hover:opacity-90 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    {t.checkout}
                  </button>
                  <p aria-live="polite" className="mt-3 min-h-4 text-center text-[11px] text-emerald-200/80">
                    {checkedOut ? t.checkoutNote : ''}
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </BrowserChrome>
  );
}
