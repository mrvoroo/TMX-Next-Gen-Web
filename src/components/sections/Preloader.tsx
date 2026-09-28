'use client';

import { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type {
  PortalShaderProps,
  PortalConfig,
  PortalState,
} from '@/components/three/PortalShader';

/* ── Lazy-load WebGL — never blocks first paint ───────────────────────────── */
const PortalShader = dynamic<PortalShaderProps>(
  () => import('@/components/three/PortalShader').then((m) => m.PortalShader),
  { ssr: false, loading: () => null },
);

/* ── Visual configuration ────────────────────────────────────────────────── */
/*
 * All tunables live here — one object, zero magic strings in JSX.
 * Colors match the React Bits customizer values from the brief.
 */
const PORTAL_CONFIG: PortalConfig = {
  background:  '#050508',
  bodyColor:   '#0c0b12',
  bodyEdge:    '#13111c',
  streakColor: '#7c3aed',
  accentColor: '#06b6d4',
  rimColorA:   '#6d28d9',
  rimColorB:   '#0891b2',
  haloColor:   '#4c1d95',
  coreColor:   '#0e7490',
  density:     1.0,
  swirl:       3.8,
  brightness:  1.25,
  rimThickness:0.15,
  orbSize:     0.13,       // radius = clamp(orbSize * vmin, 90, 150) px
                              // → diameter ≈ clamp(180px, 26vmin, 300px)
};

/* ── Component ───────────────────────────────────────────────────────────── */
interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  /*
   * shaderState — mutable bag written by GSAP on the JS thread,
   * read by PortalScene's useFrame on every animation tick.
   * No React state → no re-renders during animation.
   */
  const shaderState = useRef<PortalState>({
    speed: 0.35,
    intro: 0.70,
    open:  0.00,
    alpha: 0.00,
  });

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    /* ── Reduced-motion path ─────────────────────────────────────────── */
    if (reducedMotion) {
      /*
       * No WebGL.  Show the static CSS gradient circle, hold ~300 ms,
       * then fade the overlay and call onComplete.
       */
      const t = setTimeout(() => {
        gsap.to(overlay, {
          opacity:    0,
          duration:   0.2,
          ease:       'power1.out',
          onComplete: onComplete,
        });
      }, 300);
      return () => clearTimeout(t);
    }

    /* ── Full animation timeline (~2.5 s) ────────────────────────────── */
    /*
     * All tweens animate plain-object properties on shaderState.current —
     * useFrame reads them each tick and pushes to GPU uniforms.
     *
     * Timing:
     *   0   → 0.6 s  : orb fades in + scales 0.7 → 1.0  (power2.out)
     *   0.3 → 1.9 s  : swirl speed ramps 0.35 → 1.2     (power1.in)
     *   2.0 → 2.5 s  : portal "opens" — orb expands ×5  (power3.in)
     *   2.15→ 2.5 s  : overlay fades to 0 → onComplete
     */
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      /* Intro: fade in + scale orb */
      tl.to(shaderState.current, {
        alpha:    1.0,
        intro:    1.0,
        duration: 0.6,
        ease:     'power2.out',
      }, 0);

      /* Ramp up swirl speed */
      tl.to(shaderState.current, {
        speed:    1.2,
        duration: 1.6,
        ease:     'power1.in',
      }, 0.3);

      /* Portal opens: orb radius expands ×5 */
      tl.to(shaderState.current, {
        open:     1.0,
        duration: 0.5,
        ease:     'power3.in',
      }, 2.0);

      /* Fade out overlay (background + canvas together) → call onComplete */
      tl.to(overlay, {
        opacity:    0,
        duration:   0.35,
        ease:       'power1.in',
        onComplete: onComplete,
      }, 2.15);
    }, overlay);

    return () => ctx.revert();
  }, [onComplete, reducedMotion]);

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999]"
      style={{ backgroundColor: PORTAL_CONFIG.background }}
      aria-hidden="true"
    >
      {reducedMotion ? (
        /*
         * Reduced-motion fallback: static CSS radial-gradient circle.
         * Matches the orb colors without any WebGL or animation.
         */
        <div
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            style={{
              width:        'clamp(180px, 26vmin, 300px)',
              height:       'clamp(180px, 26vmin, 300px)',
              borderRadius: '50%',
              background:   `radial-gradient(circle at center,
                ${PORTAL_CONFIG.coreColor} 0%,
                ${PORTAL_CONFIG.bodyColor} 20%,
                ${PORTAL_CONFIG.streakColor}88 65%,
                ${PORTAL_CONFIG.rimColorA}cc 82%,
                ${PORTAL_CONFIG.haloColor}44 100%)`,
              boxShadow: `0 0 60px 20px ${PORTAL_CONFIG.haloColor}33`,
            }}
          />
        </div>
      ) : (
        /*
         * Full shader: a full-screen R3F Canvas (alpha:true) drawn on top of
         * the solid background div.  Outside the orb fragAlpha=0 so the
         * #0a0a0a background shows through, giving a clean dark surround.
         */
        <PortalShader
          config={PORTAL_CONFIG}
          stateRef={shaderState}
        />
      )}
    </div>
  );
}
