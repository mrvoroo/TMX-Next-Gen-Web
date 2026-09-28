'use client';

/**
 * useStaggerReveal — shared, robust scroll-driven card reveal for Section 5 blocks.
 *
 * Design principles (progressive enhancement):
 *  1. Cards are ALWAYS visible in the initial HTML/CSS — no opacity:0 ever applied
 *     in markup or SSR. The hook applies the hidden start state imperatively, in JS,
 *     only to cards whose bounding box is currently below the viewport fold.
 *  2. Per-container ScrollTrigger with `once: true` + `invalidateOnRefresh: true`.
 *     `once: true` means once visible, always visible — no re-hiding on scroll back.
 *  3. At window 'load' + 2 s and again at +4 s, any card that is still at opacity < 1
 *     AND whose container is in or above the viewport is force-revealed. This covers
 *     hard-reload race conditions where ST fires before heavy assets (WebGL canvas,
 *     backdrop-blur layers) finish painting.
 *  4. Cleanup via gsap.context() + ctx.revert() — safe in React Strict Mode.
 *  5. Reduced motion: skip entirely — cards are never hidden.
 */

import { useEffect, RefObject } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StaggerRevealOptions {
  /** Refs to the individual card DOM elements (may contain null gaps). */
  cardRefs: RefObject<(HTMLElement | null)[]>;
  /**
   * Whether the user prefers reduced motion.
   * When true the hook is a no-op — cards remain visible at all times.
   */
  reduced: boolean;
  /** GSAP stagger between successive cards (default 0.1 s). */
  stagger?: number;
  /** Duration of the individual card fade+lift animation (default 0.6 s). */
  duration?: number;
  /**
   * ScrollTrigger start string (default 'top 82%').
   * Adjust per block if the section sits higher or lower on screen.
   */
  start?: string;
}

export function useStaggerReveal(
  containerRef: RefObject<HTMLElement | null>,
  options: StaggerRevealOptions,
): void {
  const {
    cardRefs,
    reduced,
    stagger = 0.1,
    duration = 0.6,
    start = 'top 82%',
  } = options;

  useEffect(() => {
    // In reduced-motion mode: progressive enhancement means cards are already
    // visible — do nothing at all.
    if (reduced) return;

    const container = containerRef.current;
    if (!container) return;

    // Collect valid card elements.
    const cards = (cardRefs.current ?? []).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (cards.length === 0) return;

    /**
     * isContainerInView — true when the container's top edge has passed the
     * viewport bottom (i.e. we're already scrolled past the trigger point).
     */
    function isContainerInView(): boolean {
      if (!container) return false;
      const { top } = container.getBoundingClientRect();
      return top < window.innerHeight;
    }

    /**
     * Apply the hidden start state only to cards that are currently below the
     * viewport fold. Cards already on screen are left visible — this is the
     * progressive-enhancement contract.
     */
    function applyInitialHide(): void {
      const viewportH = window.innerHeight;
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        // Card is below the fold — safe to hide for animation.
        if (rect.top > viewportH) {
          gsap.set(card, { autoAlpha: 0, y: 42 });
        }
      });
    }

    /**
     * Force-reveal any card in this hook's set that is still invisible
     * and whose container is at or above the viewport. Used as a failsafe.
     */
    function forceRevealIfNeeded(): void {
      if (!isContainerInView()) return;
      const invisible = cards.filter((card) => {
        const computed = parseFloat(
          window.getComputedStyle(card).opacity ?? '1',
        );
        return computed < 0.99;
      });
      if (invisible.length === 0) return;
      gsap.to(invisible, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.06 });
    }

    // Apply the initial hide state synchronously (before first paint of this
    // effect), so there's never a flash of invisible-then-visible for cards
    // already below the fold.
    applyInitialHide();

    // Build the GSAP context so cleanup (ctx.revert) is scoped and safe.
    const ctx = gsap.context(() => {
      gsap.to(cards, {
        autoAlpha: 1,
        y: 0,
        duration,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start,
          once: true,              // revealed once — never re-hidden on scroll back
          invalidateOnRefresh: true,
          onEnter() {
            // Belt-and-suspenders: if ST fires, immediately reveal all invisible cards.
            forceRevealIfNeeded();
          },
        },
      });
    }, container);

    // ── Failsafe timers ────────────────────────────────────────────────────────
    // At load +2 s and +4 s, force-reveal any card still invisible in a section
    // that is already in view. Covers hard-refresh races (WebGL canvas, backdrop-
    // blur, Lenis settling) where ST measured the wrong trigger start position.
    let t2: ReturnType<typeof setTimeout>;
    let t4: ReturnType<typeof setTimeout>;

    function scheduleFailsafe(): void {
      t2 = setTimeout(() => {
        ScrollTrigger.refresh(true);
        forceRevealIfNeeded();
      }, 2000);
      t4 = setTimeout(() => {
        forceRevealIfNeeded();
      }, 4000);
    }

    if (document.readyState === 'complete') {
      scheduleFailsafe();
    } else {
      window.addEventListener('load', scheduleFailsafe, { once: true });
    }

    // Resize: ST handles position recalculation via invalidateOnRefresh, but
    // we also call forceRevealIfNeeded in case a resize brings the container
    // into view without a new scroll event.
    function onResize(): void {
      forceRevealIfNeeded();
    }
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      ctx.revert();
      clearTimeout(t2);
      clearTimeout(t4);
      window.removeEventListener('resize', onResize);
      // Clean up the load listener if it never fired.
      window.removeEventListener('load', scheduleFailsafe);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, containerRef, cardRefs, stagger, duration, start]);
}
