'use client';

/**
 * Portfolio — all texts and projects come from Keystatic (see
 * getPortfolioPage in src/lib/content.ts).
 *
 *  - Desktop ≥1024px, ≥2 projects, no reduced motion: the section is pinned and
 *    scrolling moves the slides horizontally (GSAP ScrollTrigger).
 *  - Mobile/tablet <1024px: vertical cards with scroll-driven 3D motion
 *    (CSS transforms driven by one scrubbed ScrollTrigger per card).
 *  - 1 project on desktop: vertical cards with the stagger reveal.
 *  - Reduced motion: static vertical cards (no transforms, no parallax).
 *
 * The server HTML and the first client render are always the vertical layout
 * (cards visible by default); the layout is switched after hydration.
 */

import { useRef, useSyncExternalStore, useCallback } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { useStaggerReveal } from '@/hooks/useStaggerReveal';
import { cn } from '@/lib/utils';
import type {
  PortfolioProjectData,
  PortfolioPageData,
} from '@/lib/content';
import { devForceReducedMotion } from '@/lib/devOverrides';

gsap.registerPlugin(ScrollTrigger);

type Mode = 'pending' | 'vertical' | 'cards3d' | 'static' | 'horizontal';

const DESKTOP_QUERY = '(min-width: 1024px)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  const queries = [DESKTOP_QUERY, REDUCED_QUERY].map((q) =>
    window.matchMedia(q),
  );
  queries.forEach((mq) => mq.addEventListener('change', onChange));
  return () =>
    queries.forEach((mq) => mq.removeEventListener('change', onChange));
}

/* ── Shared pieces ───────────────────────────────────────────────────────── */

export const pad = (n: number) => String(n).padStart(2, '0');

/** Keyboard stop for one project: labelled "01 / 03 Title", described by its text. */
export function projectFocusProps(
  project: PortfolioProjectData,
  index: number,
  count: number,
) {
  return {
    tabIndex: 0,
    role: 'group',
    'aria-label': `${pad(index + 1)} / ${pad(count)} ${project.title}`,
    'aria-describedby': project.description ? descriptionId(project) : undefined,
  } as const;
}

export const projectFocusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-solid focus-visible:outline-violet-400';

const descriptionId = (project: PortfolioProjectData) =>
  `project-${project.slug}-description`;

function BrowserFrame({
  project,
  sizes,
  parallax,
}: {
  project: PortfolioProjectData;
  sizes: string;
  parallax: boolean;
}) {
  const { src, width, height } = project.image;
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-white/[0.04] shadow-2xl shadow-violet-950/30 backdrop-blur-md">
      <div
        className="flex items-center gap-3 border-b border-white/[0.08] bg-white/[0.03] px-4 py-3"
        aria-hidden="true"
      >
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        </div>
        <div className="h-5 flex-1 rounded-full bg-white/[0.06]" />
      </div>
      <div className="aspect-[16/10] w-full overflow-hidden bg-[#0d0d14]">
        <div
          data-parallax={parallax ? '' : undefined}
          className={cn('h-full w-full', parallax && 'scale-[1.14]')}
        >
          <Image
            src={src}
            width={width}
            height={height}
            alt={project.imageAlt}
            sizes={sizes}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export function ProjectText({
  project,
  data,
}: {
  project: PortfolioProjectData;
  data: PortfolioPageData;
}) {
  return (
    <div className="flex min-w-0 flex-col items-start gap-4">
      {project.founder && (
        <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
          {data.founderBadge}
        </span>
      )}
      {project.concept && (
        <span className="inline-flex rounded-full border border-amber-300/35 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-200">
          {data.conceptBadge}
        </span>
      )}
      <h3 className="text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl md:max-lg:text-4xl">
        {project.title}
      </h3>
      <p
        id={descriptionId(project)}
        className="max-w-prose text-sm leading-[1.8] text-white/55 sm:text-base md:max-lg:text-lg md:max-lg:leading-[1.75]"
      >
        {project.description}
      </p>
      {project.techTags.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {project.techTags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60 md:max-lg:text-sm"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
      {project.demoHref && (
        // Plain <a>: the demos live outside the next-intl tree (own root layout).
        <a
          href={project.demoHref}
          className="group mt-2 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition-all duration-300 hover:shadow-violet-700/40"
        >
          {data.demoLabel}
          <ArrowUpRight
            size={15}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      )}
      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-2 inline-flex items-center gap-2.5 rounded-full border border-violet-500/35 bg-violet-600/10 px-6 py-3 text-sm font-semibold text-violet-300 transition-all duration-300 hover:border-violet-400/55 hover:bg-violet-600/20 hover:text-white"
        >
          {data.linkLabel}
          <ExternalLink
            size={14}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      )}
    </div>
  );
}

/* ── Vertical layout ─────────────────────────────────────────────────────── */

/** Glass card surface + accent glow border per project accent. */
const CARD_ACCENT: Record<PortfolioProjectData['accent'], string> = {
  violet:
    'border-violet-400/30 shadow-[0_0_44px_-14px_rgba(124,58,237,0.65),inset_0_1px_0_0_rgba(167,139,250,0.14)]',
  cyan:
    'border-cyan-400/30 shadow-[0_0_44px_-14px_rgba(6,182,212,0.6),inset_0_1px_0_0_rgba(103,232,249,0.14)]',
  mixed:
    'border-violet-300/25 shadow-[-18px_0_44px_-20px_rgba(124,58,237,0.6),18px_0_44px_-20px_rgba(6,182,212,0.55),inset_0_1px_0_0_rgba(196,181,253,0.14)]',
};

function VerticalCards({
  data,
  mode,
}: {
  data: PortfolioPageData;
  mode: Mode;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const scroll3d = mode === 'cards3d';

  // Cards are visible by default; the reveal only hides cards below the fold
  // (desktop single project). The 3D variant moves cards with transforms instead.
  useStaggerReveal(listRef, { cardRefs, reduced: mode !== 'vertical' });

  // Mobile/tablet: one scrubbed timeline per card. Cards start tilted back
  // (rotateX 14° → 0° as the card reaches the viewport center), then tilt away
  // slightly while leaving. Per-card transformPerspective (not one perspective
  // on the list) keeps each card's vanishing point at its own center, so cards
  // far up/down the list are not skewed. Only transform + opacity change;
  // will-change is set on cards that are in the viewport only.
  useGSAP(
    () => {
      const list = listRef.current;
      if (!scroll3d || !list) return;
      const cards = gsap.utils.toArray<HTMLElement>('[data-card]', list);

      cards.forEach((card) => {
        const img = card.querySelector<HTMLElement>('[data-parallax]');
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true, // Lenis already smooths the scroll
            invalidateOnRefresh: true,
            onToggle: (self) => {
              card.style.willChange = self.isActive ? 'transform, opacity' : 'auto';
            },
          },
        });
        // Progress 0.5 = card center at viewport center.
        tl.fromTo(
          card,
          { rotateX: 14, z: -140, scale: 0.9, opacity: 0.5, transformPerspective: 900 },
          { rotateX: 0, z: 0, scale: 1, opacity: 1, duration: 1, ease: 'sine.out' },
          0,
        ).to(
          card,
          { rotateX: -8, z: -90, scale: 0.95, opacity: 0.6, duration: 1, ease: 'sine.in' },
          1,
        );
        if (img) {
          tl.fromTo(img, { yPercent: -6 }, { yPercent: 6, duration: 2, ease: 'none' }, 0);
        }
      });

      return () => cards.forEach((card) => (card.style.willChange = ''));
    },
    { scope: listRef, dependencies: [scroll3d] },
  );

  return (
    <ul ref={listRef} className="flex flex-col gap-8 md:max-lg:gap-12">
      {data.projects.map((project, i) => (
        <li
          key={project.slug}
          data-card
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
        >
          <div
            {...projectFocusProps(project, i, data.projects.length)}
            className={cn(
              'grid gap-6 rounded-3xl border bg-white/[0.04] p-4 backdrop-blur-md sm:p-6 md:max-lg:gap-8 md:max-lg:p-8 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-10 lg:p-8',
              CARD_ACCENT[project.accent],
              projectFocusRing,
            )}
          >
            <BrowserFrame
              project={project}
              parallax={scroll3d}
              sizes="(min-width: 1280px) 700px, (min-width: 1024px) 55vw, 100vw"
            />
            <ProjectText project={project} data={data} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ── Main section ────────────────────────────────────────────────────────── */

export function PortfolioSection({ data }: { data: PortfolioPageData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const count = data.projects.length;

  const getSnapshot = useCallback((): Mode => {
    // ?motion=reduce is a dev-only test hook (see src/lib/devOverrides.ts).
    if (window.matchMedia(REDUCED_QUERY).matches || devForceReducedMotion()) {
      return 'static';
    }
    if (!window.matchMedia(DESKTOP_QUERY).matches) return 'cards3d';
    return count >= 2 ? 'horizontal' : 'vertical';
  }, [count]);
  const mode = useSyncExternalStore<Mode>(
    subscribe,
    getSnapshot,
    () => 'pending',
  );
  const horizontal = mode === 'horizontal';

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!horizontal || !section) return;

      const track = section.querySelector<HTMLElement>('[data-track]');
      const bar = section.querySelector<HTMLElement>('[data-progress]');
      if (!track || !bar) return;

      const distance = () => Math.max(0, track.scrollWidth - section.clientWidth);

      const scrollTween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            bar.style.transform = `scaleX(${self.progress})`;
          },
        },
      });

      // Subtle inner image parallax, tied to the horizontal movement.
      gsap.utils
        .toArray<HTMLElement>('[data-slide]', section)
        .forEach((slide) => {
          const img = slide.querySelector('[data-parallax]');
          if (!img) return;
          gsap.fromTo(
            img,
            { xPercent: -5 },
            {
              xPercent: 5,
              ease: 'none',
              scrollTrigger: {
                trigger: slide,
                containerAnimation: scrollTween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            },
          );
        });

      // Keyboard: focusing a slide scrubs the pinned track to it. The browser's
      // own focus scroll would shift the overflow-hidden section instead.
      const slides = gsap.utils.toArray<HTMLElement>('[data-slide]', section);
      let focusFrame = 0;
      const onFocusIn = (event: FocusEvent) => {
        section.scrollLeft = 0;
        const slide = (event.target as HTMLElement).closest<HTMLElement>('[data-slide]');
        const st = scrollTween.scrollTrigger;
        if (!slide || !st || slides.length === 0) return;
        const offset = slide.offsetLeft - slides[0].offsetLeft;
        const progress = Math.min(1, offset / Math.max(1, distance()));
        cancelAnimationFrame(focusFrame);
        focusFrame = requestAnimationFrame(() => {
          section.scrollLeft = 0;
          const y = st.start + (st.end - st.start) * progress;
          const { lenis } = window as unknown as {
            lenis?: { scrollTo: (y: number, o?: object) => void };
          };
          if (lenis) lenis.scrollTo(y, { duration: 0.9, force: true });
          else window.scrollTo({ top: y });
        });
      };
      section.addEventListener('focusin', onFocusIn);

      // Re-measure once images have settled.
      let refreshTimer: ReturnType<typeof setTimeout> | undefined;
      const scheduleRefresh = () => {
        clearTimeout(refreshTimer);
        refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 120);
      };
      const images = Array.from(section.querySelectorAll('img'));
      images.forEach((img) => {
        if (!img.complete) img.addEventListener('load', scheduleRefresh);
      });
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 250);

      return () => {
        cancelAnimationFrame(focusFrame);
        section.removeEventListener('focusin', onFocusIn);
        clearTimeout(refreshTimer);
        images.forEach((img) =>
          img.removeEventListener('load', scheduleRefresh),
        );
      };
    },
    { scope: sectionRef, dependencies: [horizontal] },
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="portfolio-heading"
      className={cn(
        'relative bg-[#050508]',
        horizontal && 'h-screen overflow-hidden',
      )}
    >
      {horizontal ? (
        <div className="flex h-full flex-col pb-8 pt-24">
          <div className="flex min-h-0 flex-1 items-center">
            <div
              data-track
              className="flex w-max shrink-0 items-center gap-10 will-change-transform"
              style={{
                paddingInline: 'max(1.25rem, calc((100% - 80rem) / 2 + 2rem))',
              }}
            >
              {data.projects.map((project, i) => (
                <article
                  key={project.slug}
                  data-slide
                  {...projectFocusProps(project, i, count)}
                  className={cn(
                    'grid w-[75vw] shrink-0 grid-cols-[1.35fr_1fr] items-center gap-10 rounded-3xl',
                    projectFocusRing,
                  )}
                >
                  <BrowserFrame project={project} parallax sizes="45vw" />
                  <ProjectText project={project} data={data} />
                </article>
              ))}
            </div>
          </div>
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
            <div
              className="h-[3px] w-full overflow-hidden rounded-full bg-white/10"
              aria-hidden="true"
            >
              <div
                data-progress
                className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-violet-600 to-cyan-500"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 sm:pb-24">
          <VerticalCards data={data} mode={mode} />
        </div>
      )}
    </section>
  );
}
