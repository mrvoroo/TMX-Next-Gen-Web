'use client';

/**
 * Scroll reveal for the pillar pages. Wraps server-rendered content and
 * fades/lifts every `[data-reveal]` descendant in once it scrolls into view.
 *
 * Progressive enhancement: the markup is fully visible without JS. Only
 * elements below the fold are hidden (in JS) right before they animate, and
 * a failsafe reveals anything still hidden after load. Sections themselves
 * (the `id` hash targets) are never transformed, so hash links land exactly.
 * Reduced motion: nothing is hidden or animated. Cleanup via useGSAP scope.
 */

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function PillarReveal({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]');

      const reveal = (el: HTMLElement) =>
        gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          overwrite: true,
        });

      items.forEach((el) => {
        if (el.getBoundingClientRect().top > window.innerHeight) {
          gsap.set(el, { autoAlpha: 0, y: 32 });
        }
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () => reveal(el),
        });
      });

      // Failsafe: anything in or above the viewport must not stay hidden.
      const failsafe = window.setTimeout(() => {
        ScrollTrigger.refresh();
        items.forEach((el) => {
          const hidden = parseFloat(getComputedStyle(el).opacity) < 0.99;
          if (hidden && el.getBoundingClientRect().top < window.innerHeight) {
            reveal(el);
          }
        });
      }, 2000);

      return () => window.clearTimeout(failsafe);
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return <div ref={rootRef}>{children}</div>;
}
