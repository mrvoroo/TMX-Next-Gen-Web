'use client';

/**
 * Every page starts at the top – after client-side navigation, reload and
 * back/forward – unless the URL has a #hash (SmoothScrollProvider handles
 * those). Two things fought this before:
 *  - the browser's own scroll restoration on reload / history navigation,
 *  - Lenis, which stays mounted across the (site) pages and kept the
 *    previous page's position.
 * The reset is re-applied a few times while layout settles (pins, fonts,
 * late images) and stops as soon as the visitor scrolls on their own.
 * No GSAP import, so pages without animations do not load it.
 */
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import type Lenis from 'lenis';

function toTop() {
  const lenis = (window as unknown as { lenis?: Lenis }).lenis;
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
}

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);

  useEffect(() => {
    if (window.location.hash) return;
    let active = true;
    const userScroll = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
    const stop = () => {
      active = false;
    };
    const again = () => active && toTop();

    toTop();
    const raf = requestAnimationFrame(again);
    const timers = [150, 400, 900].map((ms) => setTimeout(again, ms));
    userScroll.forEach((e) => window.addEventListener(e, stop, { once: true, passive: true }));

    return () => {
      stop();
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      userScroll.forEach((e) => window.removeEventListener(e, stop));
    };
  }, [pathname]);

  return null;
}
