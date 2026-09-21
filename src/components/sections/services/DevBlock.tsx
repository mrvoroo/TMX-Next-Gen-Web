'use client';

import { useRef, useEffect, useCallback } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import {
  Globe,
  Smartphone,
  ShoppingCart,
  Link,
  Cloud,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { translations } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

/* ── Icon order matches translations.ts services.dev.items order ────────── */
const ICONS: LucideIcon[] = [Globe, Smartphone, ShoppingCart, Link, Cloud, Zap];

/* ── Individual tilt card ─────────────────────────────────────────────────── */
interface TiltCardProps {
  Icon: LucideIcon;
  label: string;
  reduced: boolean;
}

function TiltCard({ Icon, label, reduced }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  /*
   * rawX / rawY — normalised mouse position [0, 1] within the card.
   * Spring wrapping gives a weighted lag so the card feels physically weighty.
   */
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const springCfg = { damping: 26, stiffness: 260, mass: 0.8 };
  const springX = useSpring(rawX, springCfg);
  const springY = useSpring(rawY, springCfg);

  /* rotateY tracks left↔right, rotateX tracks top↔bottom */
  const rotateY = useTransform(springX, [0, 1], [-12, 12]);
  const rotateX = useTransform(springY, [0, 1], [9, -9]);

  /*
   * Glare — imperative useMotionValue<string> so TypeScript has no ambiguity
   * with useTransform's overloads. Updated synchronously on every mousemove
   * and reset on mouseleave.
   */
  const glare = useMotionValue(
    'radial-gradient(circle at 50% 50%, rgba(255,255,255,0), transparent 62%)',
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduced || !cardRef.current) return;
      const r = cardRef.current.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      const ny = (e.clientY - r.top) / r.height;
      rawX.set(nx);
      rawY.set(ny);
      glare.set(
        `radial-gradient(circle at ${Math.round(nx * 100)}% ${Math.round(ny * 100)}%, rgba(255,255,255,0.055), transparent 62%)`,
      );
    },
    [reduced, rawX, rawY, glare],
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0.5);
    rawY.set(0.5);
    glare.set('radial-gradient(circle at 50% 50%, rgba(255,255,255,0), transparent 62%)');
  }, [rawX, rawY, glare]);

  return (
    /* perspective wrapper — must be outside the motion.div to avoid
       perspective-transform conflicts on the animated element itself */
    <div style={{ perspective: '1000px' }}>
      <motion.div
        ref={cardRef}
        style={
          reduced
            ? undefined
            : { rotateX, rotateY, transformStyle: 'preserve-3d' }
        }
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'group relative flex flex-col gap-4 rounded-2xl p-6 h-full',
          'border border-white/[0.07] bg-white/[0.025]',
          'cursor-default transition-shadow duration-300',
          'hover:border-violet-500/20 hover:shadow-lg hover:shadow-violet-900/20',
        )}
      >
        {/* Mouse-tracking glare overlay */}
        {!reduced && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            // MotionValue<string> is valid here; cast needed due to strict style types
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            style={{ background: glare as any }}
            aria-hidden="true"
          />
        )}

        {/* Icon badge */}
        <div className="relative z-10 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 to-cyan-500/10 text-violet-400 ring-1 ring-violet-500/20">
          <Icon size={19} strokeWidth={1.5} aria-hidden="true" />
        </div>

        {/* Label */}
        <p className="relative z-10 text-sm font-semibold leading-snug text-white/80">
          {label}
        </p>

        {/* Bottom gradient accent line */}
        <div
          className="absolute inset-x-0 bottom-0 h-px rounded-b-2xl bg-gradient-to-r from-transparent via-violet-500/30 to-transparent"
          aria-hidden="true"
        />
      </motion.div>
    </div>
  );
}

/* ── Exported block ───────────────────────────────────────────────────────── */
export function DevBlock() {
  const { t, locale } = useTranslation();
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  /* One ref per wrapper div (not per TiltCard) so GSAP targets the outer el */
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* Access array directly — t() only resolves to strings, not arrays */
  const items = translations[locale].services.dev.items;

  /* Staggered scroll-triggered fade-in */
  useEffect(() => {
    if (reduced || !containerRef.current) return;
    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      gsap.from(cards, {
        opacity: 0,
        y: 42,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={containerRef} className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
      {/* Block header */}
      <div className="mb-12">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-violet-400/60">
          01
        </p>
        <h3 className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {t('services.dev.title')}
        </h3>
        <p className="text-sm text-white/45 sm:text-base">
          {t('services.dev.sub')}
        </p>
      </div>

      {/* 2-col mobile → 3-col md+ */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {items.map((item, i) => (
          <div
            key={item}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="h-full"
          >
            <TiltCard Icon={ICONS[i]} label={item} reduced={reduced} />
          </div>
        ))}
      </div>
    </div>
  );
}
