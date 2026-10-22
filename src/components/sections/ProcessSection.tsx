'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { ProcessSectionData } from '@/lib/content';

gsap.registerPlugin(ScrollTrigger);

/*
 * "How I work" timeline.
 *
 *  - ≥1024px and motion allowed: the section is pinned and the track of step
 *    cards scrolls horizontally. A gradient line fills with progress, the
 *    numbered nodes light up and each card slides in as the line reaches it.
 *  - <1024px or reduced motion: plain vertical timeline, no pin. Everything is
 *    visible by default; with motion allowed the line fills on scroll and
 *    cards below the fold get a gentle reveal.
 *
 * Layout switches are pure CSS (`lg:motion-safe:`), GSAP only mirrors the same
 * media queries — so the SSR markup is already correct and nothing is hidden
 * unless JS runs.
 */

/* Column width in the horizontal layout is 22rem (`lg:motion-safe:w-[22rem]`, also used in the line's `right-[calc(22rem-1.25rem)]`). */
const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export function ProcessSection({ data }: { data: ProcessSectionData }) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || reduced) return;

      const track = section.querySelector<HTMLElement>('[data-track]');
      const list = section.querySelector<HTMLElement>('[data-list]');
      const fill = section.querySelector<HTMLElement>('[data-fill]');
      const nodes = gsap.utils.toArray<HTMLElement>('[data-node]', section);
      const cards = gsap.utils.toArray<HTMLElement>('[data-card]', section);
      if (!track || !list || !fill || cards.length === 0) return;

      const mm = gsap.matchMedia();

      /* ── Desktop: pinned horizontal timeline ─────────────────────────── */
      mm.add(
        '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
        () => {
          let dist = 0; // horizontal travel of the track (px)
          let scrollLen = 1; // vertical scroll distance of the pin (px)
          let nodeX: number[] = []; // node centres, in track coordinates

          const measure = () => {
            const vw = document.documentElement.clientWidth;
            dist = Math.max(0, track.offsetWidth - vw);
            scrollLen = Math.max(1, dist + window.innerHeight * 0.35);
            const trackLeft = track.getBoundingClientRect().left;
            nodeX = nodes.map((n) => {
              const r = n.getBoundingClientRect();
              return r.left - trackLeft + r.width / 2;
            });
          };

          const setTrackX = gsap.quickSetter(track, 'x', 'px');
          const setFill = gsap.quickSetter(fill, 'scaleX');
          const lit = new Array<boolean>(nodes.length).fill(true);

          const render = (progress: number) => {
            if (nodeX.length === 0) return;
            const q = dist > 0 ? Math.min(1, (progress * scrollLen) / dist) : 1;
            setTrackX(-dist * q);

            const first = nodeX[0];
            const span = nodeX[nodeX.length - 1] - first;
            const lead = Math.min(200, span);
            const edge = first + lead + (span - lead) * q;
            setFill(span > 0 ? clamp((edge - first) / span) : 1);

            cards.forEach((card, i) => {
              const a = clamp((edge - nodeX[i] + 100) / 100);
              gsap.set(card, { autoAlpha: a, x: (1 - a) * 60 });
              const on = edge >= nodeX[i] - 1;
              if (lit[i] !== on) {
                lit[i] = on;
                nodes[i].dataset.active = String(on);
              }
            });
          };

          const trigger = ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: () => {
              measure();
              return `+=${Math.round(scrollLen)}`;
            },
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // After About (2): its pin-spacer must exist before this start is measured.
            refreshPriority: 1,
            onRefresh: (self) => render(self.progress),
            onUpdate: (self) => render(self.progress),
          });

          measure();
          render(trigger.progress);
          // One more refresh once Lenis / layout settled (About refreshes at 160 ms).
          const timer = setTimeout(() => ScrollTrigger.refresh(), 240);

          return () => {
            clearTimeout(timer);
            gsap.set([track, fill, ...cards], { clearProps: 'all' });
            nodes.forEach((n) => delete n.dataset.active);
          };
        },
      );

      /* ── <1024px: vertical timeline, gentle reveal ───────────────────── */
      mm.add(
        '(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)',
        () => {
          gsap.fromTo(
            fill,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: list,
                start: 'top 70%',
                end: 'bottom 60%',
                scrub: true,
              },
            },
          );

          cards.forEach((card) => {
            // Progressive enhancement: only hide what is still below the fold.
            if (card.getBoundingClientRect().top > window.innerHeight) {
              gsap.set(card, { autoAlpha: 0, y: 28 });
            }
            gsap.to(card, {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: { trigger: card, start: 'top 88%', once: true },
            });
          });

          return () => {
            gsap.set([fill, ...cards], { clearProps: 'all' });
          };
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [reduced], revertOnUpdate: true },
  );

  const words = data.heading.split(' ');

  return (
    <section
      ref={sectionRef}
      id="process"
      aria-labelledby="process-heading"
      className="relative overflow-hidden bg-[#050508] py-24 lg:motion-safe:flex lg:motion-safe:h-screen lg:motion-safe:flex-col lg:motion-safe:justify-center lg:motion-safe:py-0"
    >
      <div
        className="pointer-events-none absolute -left-24 top-1/4 h-96 w-96 rounded-full bg-violet-800/10 blur-3xl"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-violet-400/70">
          {data.sub}
        </p>
        <h2
          id="process-heading"
          className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl"
        >
          {words.map((word, i) =>
            i === words.length - 1 ? (
              <span key={i} className="gradient-text">
                {word}
              </span>
            ) : (
              <span key={i} className="text-white">
                {word}{' '}
              </span>
            ),
          )}
        </h2>
      </div>

      {/* Track */}
      <div className="relative z-10 mt-14 lg:motion-safe:mt-14">
        <div
          data-track
          className="mx-auto max-w-7xl px-5 sm:px-8 lg:motion-safe:mx-0 lg:motion-safe:flex lg:motion-safe:w-max lg:motion-safe:max-w-none lg:motion-safe:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:motion-safe:pr-12 lg:motion-safe:will-change-transform"
        >
          <ol
            data-list
            className="relative flex flex-col gap-8 lg:motion-safe:flex-row lg:motion-safe:gap-8"
          >
            {/* Progress line (vertical <1024px / reduced motion, horizontal otherwise) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-5 left-5 top-5 w-px bg-white/10 lg:motion-safe:bottom-auto lg:motion-safe:left-5 lg:motion-safe:right-[calc(22rem-1.25rem)] lg:motion-safe:top-5 lg:motion-safe:h-px lg:motion-safe:w-auto"
            >
              <div
                data-fill
                className="absolute inset-0 origin-top bg-gradient-to-b from-violet-500 to-cyan-400 lg:motion-safe:origin-left lg:motion-safe:bg-gradient-to-r"
              />
            </div>

            {data.steps.map((step, i) => (
              <li
                key={i}
                className="relative pl-16 lg:motion-safe:w-[22rem] lg:motion-safe:shrink-0 lg:motion-safe:pl-0"
              >
                <span
                  data-node
                  className="absolute left-0 top-0 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-violet-400/60 bg-[#0b0a18] text-xs font-bold tabular-nums text-white shadow-[0_0_22px_rgba(124,58,237,0.45)] transition-[border-color,color,box-shadow] duration-300 data-[active=false]:border-white/15 data-[active=false]:text-white/35 data-[active=false]:shadow-none"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div
                  data-card
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-md lg:motion-safe:mt-16"
                >
                  <h3 className="mb-2 text-lg font-bold tracking-tight text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/55">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
