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

    /*
     * Global ScrollTrigger.refresh() after window 'load'.
     * Fires once all resources (fonts, images, WebGL canvases) have fully
     * settled — corrects any scroll-position drift that per-component rAF
     * deferrals may not have caught if the section was above the fold.
     */
    const handleLoad = () => ScrollTrigger.refresh();
    if (document.readyState === 'complete') {
      // Already loaded (e.g. HMR re-mount) — schedule for next tick so
      // any pending ST registrations from this render cycle run first.
      requestAnimationFrame(() => ScrollTrigger.refresh());
    } else {
      window.addEventListener('load', handleLoad, { once: true });
    }

    return () => {
      window.removeEventListener('load', handleLoad);
      if (tickerCbRef.current) {
        gsap.ticker.remove(tickerCbRef.current);
        tickerCbRef.current = null;
      }
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as Record<string, unknown>).lenis;
    };
  }, [reducedMotion]);

  /*
   * Arriving on home with a hash (e.g. from /impressum via /#services): Next
   * scrolls to the target before the AboutSection pin-spacer exists, so it
   * lands short once layout settles. Re-apply the hash on every ScrollTrigger
   * refresh during the short settle window, then stop.
   */
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const toHash = () =>
      document.getElementById(id)?.scrollIntoView({ behavior: 'instant' });
    ScrollTrigger.addEventListener('refresh', toHash);
    const stop = setTimeout(
      () => ScrollTrigger.removeEventListener('refresh', toHash),
      800,
    );
    return () => {
      clearTimeout(stop);
      ScrollTrigger.removeEventListener('refresh', toHash);
    };
  }, []);

  return <>{children}</>;
}
