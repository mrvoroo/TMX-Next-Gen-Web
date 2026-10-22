'use client';

/**
 * Portfolio — all texts and projects come from Keystatic (see
 * getPortfolioPage in src/lib/content.ts).
 *
 *  - Desktop ≥1024px, ≥2 projects, no reduced motion: the section is pinned and
 *    scrolling moves the slides horizontally (GSAP ScrollTrigger).
 *  - Otherwise (mobile, tablet, 1 project, reduced motion): vertical cards.
 *
 * The server HTML and the first client render are always the vertical layout
 * (cards visible by default); the layout is switched after hydration.
 */

import { useRef, useSyncExternalStore, useCallback } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ExternalLink } from 'lucide-react';
import { useStaggerReveal } from '@/hooks/useStaggerReveal';
import { cn } from '@/lib/utils';
import type {
  PortfolioProjectData,
  PortfolioPageData,
} from '@/lib/content';

gsap.registerPlugin(ScrollTrigger);

type Mode = 'pending' | 'vertical' | 'static' | 'horizontal';

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
      <h3 className="text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">
        {project.title}
      </h3>
      <p className="max-w-prose text-sm leading-[1.8] text-white/55 sm:text-base">
        {project.description}
      </p>
      {project.techTags.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {project.techTags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60"
            >
              {tag}
            </li>
          ))}
        </ul>
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

function VerticalCards({
  data,
  animate,
}: {
  data: PortfolioPageData;
  animate: boolean;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  // Cards are visible by default; the hook only hides cards below the fold.
  useStaggerReveal(listRef, { cardRefs, reduced: !animate });

  return (
    <ul ref={listRef} className="flex flex-col gap-8">
      {data.projects.map((project, i) => (
        <li
          key={project.slug}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          className="grid gap-6 rounded-3xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-md sm:p-6 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-10 lg:p-8"
        >
          <BrowserFrame
            project={project}
            parallax={false}
            sizes="(min-width: 1280px) 700px, (min-width: 1024px) 55vw, 100vw"
          />
          <ProjectText project={project} data={data} />
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
    if (window.matchMedia(REDUCED_QUERY).matches) return 'static';
    return window.matchMedia(DESKTOP_QUERY).matches && count >= 2
      ? 'horizontal'
      : 'vertical';
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
              {data.projects.map((project) => (
                <article
                  key={project.slug}
                  data-slide
                  className="grid w-[75vw] shrink-0 grid-cols-[1.35fr_1fr] items-center gap-10"
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
          <VerticalCards data={data} animate={mode === 'vertical'} />
        </div>
      )}
    </section>
  );
}
