'use client';

import dynamic from 'next/dynamic';
import { useRef, useEffect, useState } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type MotionValue,
} from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';
import type { IcosahedronSceneProps } from '@/components/three/IcosahedronScene';

gsap.registerPlugin(ScrollTrigger);

/* ── Lazy-load R3F canvas — never blocks first paint ─────────────────────── */
const IcosahedronScene = dynamic<IcosahedronSceneProps>(
  () =>
    import('@/components/three/IcosahedronScene').then(
      (m) => m.IcosahedronScene,
    ),
  { ssr: false, loading: () => null },
);

/* ── Progress dot (needs its own component — hooks can't live in .map) ─── */
function ProgressDot({
  progressMV,
  threshold,
}: {
  progressMV: MotionValue<number>;
  threshold:  number;
}) {
  const opacity = useTransform(progressMV, [threshold - 0.08, threshold + 0.08], [0.2, 0.85]);
  const scale   = useTransform(progressMV, [threshold - 0.08, threshold],         [1,   1.5]);
  return (
    <motion.div
      style={{ opacity, scale }}
      className="h-1.5 w-1.5 rounded-full bg-violet-400"
    />
  );
}

/* ── Main section ─────────────────────────────────────────────────────────── */
export function AboutSection() {
  const { t }   = useTranslation();
  const reduced = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);

  /*
   * progressRef   — written by GSAP (or IntersectionObserver on mobile),
   *                 read by R3F useFrame every animation tick.
   * progressMV    — Framer Motion MotionValue, driven by the same source,
   *                 powers all text opacity/y transforms below.
   *
   * Why two separate values?
   * R3F lives inside a Canvas which has its own RAF loop; it needs direct
   * ref access (no React re-renders).  Framer Motion useTransform needs a
   * MotionValue.  The two are kept in sync by updating both in every GSAP
   * onUpdate / animate callback.
   */
  const progressRef = useRef<number>(0);
  const progressMV  = useMotionValue(0);

  /*
   * isMobile — checked via window.innerWidth (not CSS) because this is a
   *             WebGL performance concern.  768px matches Tailwind's md:.
   * mounted  — guards the IcosahedronScene render so it only appears on the
   *             client (avoids SSR canvas weirdness and ensures correct
   *             isMobile value before R3F initialises).
   */
  const [isMobile, setIsMobile] = useState(false);
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    setMounted(true);
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  /* Reduced-motion: snap both trackers to 1 immediately */
  useEffect(() => {
    if (!reduced) return;
    progressRef.current = 1;
    progressMV.set(1);
  }, [reduced, progressMV]);

  /* ── Scroll driver (GSAP pin on desktop, IntersectionObserver on mobile) ─ */
  useEffect(() => {
    if (!mounted || !sectionRef.current) return;

    /* ── Mobile / reduced-motion path ─────────────────────────────── */
    if (reduced || isMobile) {
      if (reduced) return; // already set to 1 above

      // Mobile: animate progress 0→1 when section enters viewport
      const section = sectionRef.current;
      let triggered = false;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !triggered) {
            triggered = true;
            animate(progressMV, 1, {
              duration: 1.4,
              ease:     [0.22, 1, 0.36, 1],
              onUpdate: (v) => { progressRef.current = v; },
            });
          }
        },
        { threshold: 0.25 },
      );
      observer.observe(section);
      return () => observer.disconnect();
    }

    /* ── Desktop path: GSAP pin + scrub ───────────────────────────── */
    /*
     * Pin this section to the top of the viewport while the user scrolls
     * an additional 150vh.  `scrub: 0.8` adds a small lag so the particle
     * assembly feels physically weighty.  `pinSpacing: true` (default)
     * inserts a spacer div so the next section follows naturally after the
     * pin is released — no jump or flicker.
     *
     * Lenis keeps ScrollTrigger in sync via:
     *   lenis.on('scroll', ScrollTrigger.update)   [in SmoothScrollProvider]
     */
    const trigger = ScrollTrigger.create({
      trigger:    sectionRef.current,
      start:      'top top',
      end:        '+=150%',
      pin:        true,
      pinSpacing: true,
      scrub:      0.8,
      onUpdate(self) {
        progressRef.current = self.progress;
        progressMV.set(self.progress);
      },
    });

    /*
     * Defer ScrollTrigger.refresh() by one tick so Lenis has settled the
     * layout before GSAP measures the pin height.  Prevents the off-by-a-
     * few-pixels pin-spacer bug.
     */
    const timer = setTimeout(() => ScrollTrigger.refresh(), 160);

    return () => {
      trigger.kill();
      clearTimeout(timer);
    };
  }, [mounted, reduced, isMobile, progressMV]);

  /* ── Framer Motion transforms — all driven by progressMV ─────────────── */
  /*
   * Three stages that map to scroll progress 0 → 1:
   *   Stage 1  [0.00 – 0.30]  Sub-label + Heading
   *   Stage 2  [0.28 – 0.62]  Body paragraph
   *   Stage 3  [0.58 – 0.82]  CTA button
   *
   * In reduced-motion mode progressMV = 1 immediately, so all useTransform
   * outputs resolve to their "visible" end values without any animation.
   */
  const subLabelOp = useTransform(progressMV, [0.00, 0.18], [0, 1]);
  const subLabelY  = useTransform(progressMV, [0.00, 0.18], [28, 0]);

  const headingOp  = useTransform(progressMV, [0.08, 0.30], [0, 1]);
  const headingY   = useTransform(progressMV, [0.08, 0.30], [40, 0]);

  const bodyOp     = useTransform(progressMV, [0.28, 0.55], [0, 1]);
  const bodyY      = useTransform(progressMV, [0.28, 0.55], [30, 0]);

  const ctaOp      = useTransform(progressMV, [0.55, 0.80], [0, 1]);
  const ctaY       = useTransform(progressMV, [0.55, 0.80], [22, 0]);

  /* ── Render ────────────────────────────────────────────────────────────── */
  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label={t('about.heading')}
      className={cn(
        'relative w-full overflow-hidden bg-[#050508]',
        /*
         * Desktop (md+): h-screen so GSAP pin has a defined height to work with.
         * Mobile: min-h-screen so content can expand naturally — no pin, no
         * fixed height needed.
         *
         * We guard with `mounted` so the SSR HTML always gets the mobile-safe
         * class, and the class corrects itself on client before the user can
         * see the section (it's below the fold).
         */
        mounted && !isMobile ? 'flex h-screen items-center' : 'min-h-screen py-20',
      )}
    >
      {/* ── Ambient glow ───────────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute right-0 top-1/3 h-[30rem] w-[30rem] rounded-full bg-violet-800/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-cyan-700/8 blur-3xl"
        aria-hidden="true"
      />

      {/* ── Content grid ───────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto grid h-full w-full max-w-7xl grid-cols-1 px-5 sm:px-8 md:grid-cols-2">

        {/* ── Left / bottom (mobile): Text ─────────────────────────────── */}
        <div className="flex flex-col justify-center py-10 md:py-0 md:pr-12 lg:pr-20">

          {/* Sub-label — uses t('about.sub') (short tagline as eyebrow) */}
          <motion.p
            style={{ opacity: subLabelOp, y: subLabelY }}
            className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-violet-400/80"
          >
            {t('about.sub')}
          </motion.p>

          {/* Heading — last word gets gradient accent */}
          <motion.h2
            style={{ opacity: headingOp, y: headingY }}
            className="mb-8 text-4xl font-black leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            {t('about.heading')
              .split(' ')
              .map((word, i, arr) =>
                i === arr.length - 1 ? (
                  <span key={i} className="gradient-text">
                    {word}
                  </span>
                ) : (
                  <span key={i}>{word} </span>
                ),
              )}
          </motion.h2>

          {/* Body */}
          <motion.p
            style={{ opacity: bodyOp, y: bodyY }}
            className="mb-10 max-w-prose text-sm leading-[1.85] text-white/48 sm:text-base"
          >
            {t('about.body')}
          </motion.p>

          {/* CTA — ghost button style (distinct from Hero's filled CTA) */}
          <motion.div style={{ opacity: ctaOp, y: ctaY }}>
            <a
              href="#services"
              className={cn(
                'group inline-flex items-center gap-2.5 rounded-full',
                'border border-violet-500/35 bg-violet-600/10',
                'px-6 py-3 text-sm font-semibold text-violet-300',
                'transition-all duration-300',
                'hover:border-violet-400/55 hover:bg-violet-600/18 hover:text-white',
              )}
            >
              {t('about.cta')}
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </motion.div>
        </div>

        {/* ── Right / top (mobile): 3D scene ───────────────────────────── */}
        <div
          className={cn(
            'relative',
            /*
             * Mobile: fixed height above the text, renders before text in DOM
             *   (order-first) so visually it appears at the top.
             * Desktop: fills the full right column height.
             */
            isMobile ? 'order-first h-[42vh]' : 'h-full',
          )}
        >
          {/*
           * Only render once mounted so isMobile is correct and the Canvas
           * never tries to run on the server.
           */}
          {mounted && (
            <IcosahedronScene
              progressRef={progressRef}
              reducedMotion={reduced}
              isMobile={isMobile}
            />
          )}
        </div>
      </div>

      {/* ── Desktop progress dots (decorative, one per text stage) ─────── */}
      {mounted && !isMobile && !reduced && (
        <div
          className="absolute right-6 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-2.5"
          aria-hidden="true"
        >
          {([0.18, 0.42, 0.68] as const).map((t) => (
            <ProgressDot key={t} progressMV={progressMV} threshold={t} />
          ))}
        </div>
      )}
    </section>
  );
}
