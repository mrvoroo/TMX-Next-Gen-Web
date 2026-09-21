'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Register GSAP plugin once at module level (safe to call multiple times)
gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  // Store the ticker callback so we can properly remove it on cleanup
  const tickerCbRef = useRef<((time: number) => void) | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      // Respect prefers-reduced-motion: use native scroll, no Lenis
      ScrollTrigger.normalizeScroll(false);
      return;
    }

    // Initialise Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Sync GSAP ScrollTrigger with Lenis scroll position
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis via GSAP ticker so they share the same RAF loop
    const tickerCb = (time: number) => lenis.raf(time * 1000);
    tickerCbRef.current = tickerCb;
    gsap.ticker.add(tickerCb);

    // Disable GSAP's own lagSmoothing so it doesn't fight Lenis
    gsap.ticker.lagSmoothing(0);

    // Expose lenis instance on window for scrollTo() calls from other components
    (window as unknown as Record<string, unknown>).lenis = lenis;

    return () => {
      if (tickerCbRef.current) {
        gsap.ticker.remove(tickerCbRef.current);
        tickerCbRef.current = null;
      }
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as Record<string, unknown>).lenis;
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
