'use client';

import { useRef, useCallback } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useStaggerReveal } from '@/hooks/useStaggerReveal';
import { cn } from '@/lib/utils';
import { getServiceIcon } from './icons';
import { ServiceGrid } from './ServiceGrid';
import type { PillarBlockProps } from './types';

/* ── Individual glassmorphic card ────────────────────────────────────────── */
interface ItCardProps {
  Icon: LucideIcon;
  label: string;
  slug: string;
  cardRef: (el: HTMLDivElement | null) => void;
}

function ItCard({ Icon, label, slug, cardRef }: ItCardProps) {
  return (
    <div
      ref={cardRef}
      id={slug}
      data-slug={slug}
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
export function ItBlock({ title, sub, items, number }: PillarBlockProps) {
  const reduced = useReducedMotion();
  const blockRef   = useRef<HTMLDivElement>(null);   // spotlight tracking target + GSAP context root
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

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
            {number}
          </p>
          <h3 className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {title}
          </h3>
          <p className="text-sm text-white/45 sm:text-base">
            {sub}
          </p>
        </div>

        {/* glassmorphic cards — 1-col mobile → 2-col sm+. Few cards (≤2): two wide
            cards, centred as a deliberate pair; otherwise up to 3 per row. */}
        <ServiceGrid maxCols={items.length <= 2 ? 2 : 3}>
          {items.map((item, i) => (
            <ItCard
              key={item.slug}
              slug={item.slug}
              Icon={getServiceIcon(item.icon)}
              label={item.name}
              cardRef={(el) => { cardRefs.current[i] = el; }}
            />
          ))}
        </ServiceGrid>
      </div>
    </div>
  );
}
