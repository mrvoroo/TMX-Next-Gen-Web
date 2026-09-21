'use client';

import dynamic from 'next/dynamic';
import { useRef, useCallback } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
  type Variants,
} from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';
import type { ParticleNetworkProps } from '@/components/three/ParticleNetwork';

/* ── Lazy-load the 3D scene — never blocks first paint ───────────────────── */
const ParticleNetwork = dynamic<ParticleNetworkProps>(
  () =>
    import('@/components/three/ParticleNetwork').then(
      (m) => m.ParticleNetwork,
    ),
  { ssr: false, loading: () => null },
);

/* ── Framer Motion variants ──────────────────────────────────────────────── */
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
};

// Cubic-bezier as a typed 4-tuple so Framer Motion accepts it
const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

function makeItemVariants(reduced: boolean): Variants {
  if (reduced)
    return { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } };
  return {
    hidden:  { opacity: 0, y: 36 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.75, ease: EASE_OUT_EXPO },
    },
  };
}

/* ── Magnetic CTA button ─────────────────────────────────────────────────── */
interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  reduced: boolean;
}

function MagneticButton({ children, href = '#contact', reduced }: MagneticButtonProps) {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springCfg = { damping: 18, stiffness: 160, mass: 0.6 };
  const springX = useSpring(x, springCfg);
  const springY = useSpring(y, springCfg);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (reduced || !btnRef.current) return;
      const rect = btnRef.current.getBoundingClientRect();
      x.set((e.clientX - (rect.left + rect.width  / 2)) * 0.32);
      y.set((e.clientY - (rect.top  + rect.height / 2)) * 0.32);
    },
    [reduced, x, y],
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.a
      ref={btnRef}
      href={href}
      style={reduced ? {} : { x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={reduced ? {} : { scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'group inline-flex items-center gap-3 rounded-full',
        'bg-gradient-to-r from-violet-600 to-cyan-500',
        'px-7 py-3.5 text-sm font-semibold text-white',
        'shadow-lg shadow-violet-600/30',
        'transition-shadow duration-300 hover:shadow-violet-600/50',
        'select-none',
      )}
    >
      {children}
      <ArrowRight
        size={16}
        className="transition-transform duration-300 group-hover:translate-x-1"
      />
    </motion.a>
  );
}

/* ── Hero section ────────────────────────────────────────────────────────── */
interface HeroSectionProps {
  shouldAnimate: boolean;
}

export function HeroSection({ shouldAnimate }: HeroSectionProps) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const itemVariants = makeItemVariants(reduced);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
    >
      {/* ── Gradient backdrop (renders before 3D scene loads) ── */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% 40%, #1a0a3a 0%, #07060f 60%, #050508 100%)',
        }}
      />

      {/* ── Secondary colour accent blobs ── */}
      <div
        className="pointer-events-none absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-violet-700/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-1/4 h-64 w-64 rounded-full bg-cyan-600/10 blur-3xl"
        aria-hidden="true"
      />

      {/* ── Lazy-loaded R3F particle network ── */}
      <ParticleNetwork reducedMotion={reduced} />

      {/* ── Content — sits above the canvas ──────────────────────────────── */}
      {/*
        IMPORTANT LAYOUT NOTE
        ─────────────────────
        The fixed header is ~70px tall. We use:
          pt-24 (6rem / 96px) on mobile
          pt-28 on sm
          pt-0 on md+ (content is centered in full viewport via flex)
        Plus we cap content width tightly so the toggle (top-right in header)
        NEVER overlaps the heading at any breakpoint.
        z-10 ensures content renders above the Three.js canvas (z-0 by default).
      */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-5 pb-28 pt-28 text-center sm:px-8 md:pt-0">
        <AnimatePresence>
          {shouldAnimate && (
            <motion.div
              key="hero-content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Eyebrow label */}
              <motion.p
                variants={itemVariants}
                className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-violet-400/80"
              >
                TMX — Digital Agency
              </motion.p>

              {/* Main heading — responsive font size, never overflows */}
              <motion.h1
                variants={itemVariants}
                className={cn(
                  'mx-auto mb-6',
                  'text-4xl font-black leading-[1.08] tracking-tight text-white',
                  'sm:text-5xl',
                  'md:text-6xl',
                  'lg:text-7xl',
                )}
              >
                {/* Accent first word, then rest in white */}
                {t('hero.tagline')
                  .split('. ')
                  .map((part, i, arr) => (
                    <span key={i}>
                      {i === 0 ? (
                        <span className="gradient-text">{part}</span>
                      ) : (
                        part
                      )}
                      {i < arr.length - 1 ? '. ' : ''}
                    </span>
                  ))}
              </motion.h1>

              {/* Sub-text */}
              <motion.p
                variants={itemVariants}
                className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg"
              >
                {t('hero.sub')}
              </motion.p>

              {/* CTA button */}
              <motion.div variants={itemVariants}>
                <MagneticButton href="#contact" reduced={reduced}>
                  {t('hero.cta')}
                </MagneticButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={shouldAnimate ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/30">
          {t('hero.scroll')}
        </span>
        <motion.div
          animate={reduced ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={16} className="text-white/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
