'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { PortalConfig, PortalShaderProps } from '@/components/three/PortalShader';

/* ── Lazy-load the WebGL shader — never blocks first paint ────────────────── */
const PortalShader = dynamic<PortalShaderProps>(
  () => import('@/components/three/PortalShader').then((m) => m.PortalShader),
  { ssr: false, loading: () => null },
);

/* ── Visual config — colours match the site's design-token palette ────────── */
const PORTAL_CONFIG: PortalConfig = {
  primaryColor:       '#7c3aed', // --color-accent-from (violet-600)
  secondaryColor:     '#06b6d4', // --color-accent-to   (cyan-500)
  centerColor:        '#67e8f9', // cyan-300 — soft glowing core
  background:         '#050508', // --color-surface-0
  speed:              0.3,
  density:            1.0,
  layerCount:         10,        // reduced to 6 on mobile (see below)
  scale:              0.8,
  brightness:         1.0,
  waveAmplitude:      1.0,
  waveFrequency:      0.75,
  verticalDistortion: 0.50,
  depthIntensity:     0.75,
};

/* Mobile config — same object but layerCount lowered for GPU budget */
const PORTAL_CONFIG_MOBILE: PortalConfig = { ...PORTAL_CONFIG, layerCount: 6 };

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const overlayRef  = useRef<HTMLDivElement>(null);
  const counterRef  = useRef<HTMLSpanElement>(null);
  const barRef      = useRef<HTMLDivElement>(null);
  const shaderRef   = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();

  /* Determine mobile for layerCount at mount time (WebGL perf concern, not CSS).
   * useState lazy initialiser runs only on the client — window is safe here. */
  const [isMobile] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768,
  );

  /*
   * shaderReady: flips to true when the Canvas fires onCreated.
   * We fade the shader div in at that point so the solid background
   * is always visible first — no flash of transparent WebGL.
   */
  const [shaderReady, setShaderReady] = useState(false);

  /* Fade the shader overlay in once the GL context is ready */
  useEffect(() => {
    if (!shaderReady || !shaderRef.current || reducedMotion) return;
    gsap.fromTo(
      shaderRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: 'power2.out' },
    );
  }, [shaderReady, reducedMotion]);

  /* ── Main animation sequence ──────────────────────────────────────────── */
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const fadeOut = () => {
      gsap.to(overlay, {
        opacity: 0,
        duration: reducedMotion ? 0.1 : 0.55,
        ease: 'power2.inOut',
        onComplete: onComplete,
      });
    };

    if (reducedMotion) {
      /* Reduced motion: skip all animation, jump straight to 100% and exit */
      if (counterRef.current) counterRef.current.textContent = '100%';
      if (barRef.current) barRef.current.style.width = '100%';
      const t = setTimeout(fadeOut, 300);
      return () => clearTimeout(t);
    }

    /* Full GSAP 3-phase counter animation (unchanged from original) */
    const counter = { val: 0 };

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        /* Phase 1: fast ramp to ~62% (0.9 s) */
        .to(counter, {
          val:      62,
          duration: 0.9,
          ease:     'power1.inOut',
          onUpdate: update,
        })
        /* Phase 2: slow down as if "loading" (0.55 s) */
        .to(counter, {
          val:      88,
          duration: 0.55,
          ease:     'power1.out',
          onUpdate: update,
        })
        /* Phase 3: snap to 100 and exit */
        .to(counter, {
          val:      100,
          duration: 0.35,
          ease:     'power3.in',
          onUpdate: update,
          onComplete: fadeOut,
        });
    }, overlay);

    function update() {
      const v = Math.round(counter.val);
      if (counterRef.current) counterRef.current.textContent = `${v}%`;
      if (barRef.current) barRef.current.style.width = `${counter.val}%`;
    }

    return () => ctx.revert();
  }, [onComplete, reducedMotion]);

  const portalConfig = isMobile ? PORTAL_CONFIG_MOBILE : PORTAL_CONFIG;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ backgroundColor: PORTAL_CONFIG.background }}
      aria-hidden="true"
    >
      {/* ── Portal shader — absolute behind all UI, fades in when GL is ready */}
      {!reducedMotion && (
        <div
          ref={shaderRef}
          className="absolute inset-0"
          style={{ opacity: 0 }}
          aria-hidden="true"
        >
          <PortalShader
            config={portalConfig}
            onReady={() => setShaderReady(true)}
          />
        </div>
      )}

      {/* ── Foreground UI — always visible immediately, above the shader ──── */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo mark */}
        <div className="gradient-text mb-10 text-3xl font-black tracking-tight select-none">
          TMX
        </div>

        {/* Percentage counter — text-shadow ensures legibility over the shader */}
        <span
          ref={counterRef}
          className="tabular-nums text-7xl font-black leading-none text-white sm:text-8xl"
          style={{
            fontVariantNumeric: 'tabular-nums',
            textShadow: '0 0 24px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.7)',
          }}
          dangerouslySetInnerHTML={{ __html: reducedMotion ? '100%' : '0%' }}
        />

        {/* Progress track */}
        <div
          className="mt-7 h-px w-48 overflow-hidden rounded-full sm:w-64"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        >
          <div
            ref={barRef}
            className="h-full origin-left rounded-full"
            style={{
              width: '0%',
              background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
