'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

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
      // In reduced-motion mode: jump straight to 100 and exit quickly
      if (counterRef.current) counterRef.current.textContent = '100%';
      if (barRef.current) barRef.current.style.width = '100%';
      const t = setTimeout(fadeOut, 300);
      return () => clearTimeout(t);
    }

    // Full GSAP counter animation
    const counter = { val: 0 };

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        // Phase 1: fast ramp to ~60% (0.9s)
        .to(counter, {
          val: 62,
          duration: 0.9,
          ease: 'power1.inOut',
          onUpdate: update,
        })
        // Phase 2: slow down as if "loading" (0.55s)
        .to(counter, {
          val: 88,
          duration: 0.55,
          ease: 'power1.out',
          onUpdate: update,
        })
        // Phase 3: snap to 100 and exit
        .to(counter, {
          val: 100,
          duration: 0.35,
          ease: 'power3.in',
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

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050508]"
      aria-hidden="true"
    >
      {/* Logo mark */}
      <div className="gradient-text mb-10 text-3xl font-black tracking-tight select-none">
        TMX
      </div>

      {/* Percentage counter */}
      <span
        ref={counterRef}
        className="tabular-nums text-7xl font-black leading-none text-white sm:text-8xl"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        0%
      </span>

      {/* Progress track */}
      <div
        ref={lineRef}
        className="mt-7 h-px w-48 overflow-hidden rounded-full bg-white/10 sm:w-64"
      >
        <div
          ref={barRef}
          className="h-full origin-left rounded-full bg-gradient-to-r from-violet-600 to-cyan-500"
          style={{ width: '0%' }}
        />
      </div>
    </div>
  );
}
