'use client';

import { useRef, useCallback } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import {
  MapPin,
  Layers,
  Shield,
  Upload,
  Server,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useStaggerReveal } from '@/hooks/useStaggerReveal';
import { translations } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils';

/* ── Icon order matches translations.ts services.it.items order ─────────── */
const ICONS: LucideIcon[] = [MapPin, Layers, Shield, Upload, Server, Settings];

/* ── Individual glassmorphic card ────────────────────────────────────────── */
interface ItCardProps {
  Icon: LucideIcon;
  label: string;
  cardRef: (el: HTMLDivElement | null) => void;
}

function ItCard({ Icon, label, cardRef }: ItCardProps) {
  return (
    <div
      ref={cardRef}
      className={cn(
        'relative flex flex-col gap-4 rounded-2xl p-6 min-w-0',
        /* Glassmorphism: backdrop-blur + semi-transparent fill + frosted border */
        'backdrop-blur-md',
        'border border-white/[0.08] bg-white/[0.03]',
        'transition-all duration-300',
        'hover:border-violet-500/20 hover:bg-violet-500/[0.05]',
        'hover:shadow-lg hover:shadow-violet-900/20',
      )}
    >
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 to-cyan-500/10 text-violet-400 ring-1 ring-violet-500/20">
        <Icon size={19} strokeWidth={1.5} aria-hidden="true" />
      </div>
      <p className="text-sm font-semibold leading-snug text-white/80 [hyphens:auto] [overflow-wrap:anywhere]">{label}</p>
      <div
        className="absolute inset-x-0 bottom-0 h-px rounded-b-2xl bg-gradient-to-r from-transparent via-violet-500/25 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}

/* ── Exported block ───────────────────────────────────────────────────────── */
export function ItBlock() {
  const { t, locale } = useTranslation();
  const reduced = useReducedMotion();
  const blockRef   = useRef<HTMLDivElement>(null);   // spotlight tracking target + GSAP context root
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const items = translations[locale].services.it.items;

  /*
   * Spotlight MotionValues — start off-screen so no glow is visible
   * until the user moves into the block.
   */
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  /*
   * useMotionTemplate composes a CSS radial-gradient string reactively.
   * The MotionValue<string> output is consumed directly by motion.div's
   * `style.background` prop — no re-render on every mouse move.
   */
  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${mouseX}px ${mouseY}px, rgba(124,58,237,0.11), transparent 70%)`;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduced || !blockRef.current) return;
      const r = blockRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - r.left);
      mouseY.set(e.clientY - r.top);
    },
    [reduced, mouseX, mouseY],
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(-1000);
    mouseY.set(-1000);
  }, [mouseX, mouseY]);

  /*
   * Shared progressive-enhancement reveal hook replaces the previous double-rAF
   * approach. The hook's failsafe timers (+2 s/+4 s) handle the glassmorphism
   * compositing lag without the risk of a stale rAF handle surviving unmount.
   */
  useStaggerReveal(blockRef, { cardRefs, reduced });

  return (
    /*
     * blockRef is on the outer div — this is the coordinate system for the
     * spotlight radial gradient (mouseX/Y are measured relative to its origin),
     * and also the GSAP context root for the reveal hook.
     */
    <div
      ref={blockRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative bg-[#070612] overflow-hidden"
    >
      {/* Cursor-following spotlight overlay — pointer-events-none so cards remain interactive */}
      {!reduced && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          style={{ background: spotlight as any }}
          aria-hidden="true"
        />
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        {/* Block header */}
        <div className="mb-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-violet-400/60">
            04
          </p>
          <h3 className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {t('services.it.title')}
          </h3>
          <p className="text-sm text-white/45 sm:text-base">
            {t('services.it.sub')}
          </p>
        </div>

        {/* 6 glassmorphic cards — 1-col mobile → 2-col sm → 3-col md+ */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item, i) => (
            <ItCard
              key={item}
              Icon={ICONS[i]}
              label={item}
              cardRef={(el) => { cardRefs.current[i] = el; }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
