'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
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
   * Arriving on a page with a hash (e.g. /leistungen/entwicklung → /#services).
   * This provider lives in the (site) layout, so it stays mounted between
   * pillar pages, portfolio and home – the effect therefore re-runs on every
   * pathname change, not only on first mount. Next scrolls to the target
   * before the new page's ScrollTriggers (AboutSection pin-spacer) exist and
   * Lenis keeps its old position, so the jump is lost or lands short. Re-apply
   * the hash through Lenis (keeps its internal position in sync) after the
   * first frame and on every ScrollTrigger refresh in a short settle window.
   */
  const pathname = usePathname();
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const toHash = () => {
      const el = document.getElementById(id);
      if (!el) return;
      const lenis = (window as unknown as { lenis?: Lenis }).lenis;
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(el, { immediate: true, force: true });
      } else {
        el.scrollIntoView({ behavior: 'instant' });
      }
    };
    ScrollTrigger.addEventListener('refresh', toHash);
    const raf = requestAnimationFrame(() => {
      toHash();
      ScrollTrigger.refresh();
    });
    const late = setTimeout(toHash, 400);
    const stop = setTimeout(
      () => ScrollTrigger.removeEventListener('refresh', toHash),
      1500,
    );
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(late);
      clearTimeout(stop);
      ScrollTrigger.removeEventListener('refresh', toHash);
    };
  }, [pathname]);

  return <>{children}</>;
}
