'use client';

/**
 * /portfolio page body: hero → projects → CTA.
 *
 * Desktop variant (≥1024px, WebGL2, no reduced motion): ONE fixed canvas
 * (CorridorScene) behind three zones — the hero (its own pin), the corridor
 * (pinned, (N + 0.3) × 100vh) and the outro (CTA). A single scrubbed
 * ScrollTrigger maps "corridor enters the viewport" → "outro reaches the top"
 * to u (viewport heights, see corridorPath.ts); the scene and the HTML overlay
 * both derive the camera and the active project from it. The overlay is the
 * real ordered list of all projects (inactive items are transparent, not
 * hidden); focusing a project link scrolls the corridor to that project.
 *
 * Every other variant renders the previous layout unchanged.
 */

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Link } from '@/i18n/navigation';
import type { PortfolioPageData } from '@/lib/content';
import { cn } from '@/lib/utils';
import type { CorridorSceneProps } from '@/components/three/CorridorScene';
import {
  activeIndex,
  cameraZ,
  corridorUnits,
  dwellCenter,
  pinnedUnits,
  smoothRange,
  totalUnits,
} from '@/components/three/corridorPath';
import { useIdleReady } from '@/hooks/useIdleReady';
import { PortfolioHero, usePortfolioVariant } from './PortfolioHero';
import {
  pad,
  PortfolioSection,
  ProjectText,
  projectFocusProps,
  projectFocusRing,
} from './PortfolioSection';

gsap.registerPlugin(ScrollTrigger);

const CorridorScene = dynamic<CorridorSceneProps>(
  () => import('@/components/three/CorridorScene').then((m) => m.CorridorScene),
  { ssr: false, loading: () => null },
);

function heroScreens(data: PortfolioPageData) {
  return data.projects
    .map((p) => p.image.src)
    .filter((src) => src.startsWith('/') && !src.startsWith('//'))
    .slice(0, 4)
    .map((src) => `/_next/image?url=${encodeURIComponent(src)}&w=828&q=75`);
}

export function PortfolioStage({
  data,
  heroText,
}: {
  data: PortfolioPageData;
  heroText: ReactNode;
}) {
  const variant = usePortfolioVariant();
  const staged = variant === 'desktop';
  // Mount the WebGL corridor after first paint + idle (keeps FCP/LCP fast).
  const sceneReady = useIdleReady();
  const count = data.projects.length;

  const stageRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const corridorRef = useRef<HTMLElement>(null);
  const outroRef = useRef<HTMLElement>(null);
  const heroProgress = useRef(0);
  const corridorState = useRef({ u: 0 });
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [running, setRunning] = useState(true);

  const images = useMemo(() => data.projects.map((p) => p.image.src), [data.projects]);
  const innerScreens = useMemo(() => heroScreens(data), [data]);
  const corridorProjects = useMemo(
    () =>
      data.projects.map((p) => ({
        src: p.image.src,
        width: p.image.width,
        height: p.image.height,
        accent: p.accent,
      })),
    [data.projects],
  );

  const onHeroProgress = useCallback((p: number) => {
    heroProgress.current = p;
  }, []);

  const scheduleRefresh = useCallback(() => {
    clearTimeout(refreshTimer.current);
    refreshTimer.current = setTimeout(() => ScrollTrigger.refresh(), 150);
  }, []);
  useEffect(() => () => clearTimeout(refreshTimer.current), []);

  // Render only while the stage is on screen and the tab is visible.
  useEffect(() => {
    const stage = stageRef.current;
    if (!staged || !stage) return;
    let visible = true;
    let onScreen = true;
    const update = () => setRunning(visible && onScreen);
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      update();
    });
    const onVisibility = () => {
      visible = document.visibilityState === 'visible';
      update();
    };
    observer.observe(stage);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [staged]);

  useGSAP(
    () => {
      corridorState.current.u = 0;
      const corridor = corridorRef.current;
      const outro = outroRef.current;
      const layer = layerRef.current;
      if (!staged || !corridor || !outro || !layer) return;

      const overlay = corridor.querySelector<HTMLElement>('[data-corridor-overlay]');
      const items = gsap.utils.toArray<HTMLElement>('[data-corridor-item]', corridor);
      const cta = outro.querySelector<HTMLElement>('[data-outro-cta]');
      const end = corridorUnits(count);
      let active = -1;

      const apply = (u: number) => {
        corridorState.current.u = u;
        const index = activeIndex(cameraZ(u, count), count);
        if (index !== active) {
          active = index;
          items.forEach((el, i) => {
            el.toggleAttribute('data-active', i === index);
            el.setAttribute('aria-current', i === index ? 'true' : 'false');
          });
        }
        if (overlay) overlay.style.opacity = String(smoothRange(0.55, 1.15, u));
        if (cta) {
          const o = smoothRange(end + 0.35, end + 0.9, u);
          cta.style.opacity = String(o);
          cta.style.transform = `translateY(${(1 - o) * 24}px)`;
        }
      };

      ScrollTrigger.create({
        trigger: corridor,
        start: 'top top',
        end: () => `+=${pinnedUnits(count) * window.innerHeight}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });

      const proxy = { u: 0 };
      const tween = gsap.to(proxy, {
        u: totalUnits(count),
        ease: 'none',
        onUpdate: () => apply(proxy.u),
        scrollTrigger: {
          // A refresh reverts the tween (onUpdate fires with 0), then restores it silently.
          onRefresh: () => apply(proxy.u),
          trigger: corridor,
          start: 'top bottom',
          // = the outro reaching the top (scroll-in + pin + outro height).
          end: () => `+=${totalUnits(count) * window.innerHeight}`,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      // The fixed canvas leaves together with the outro, never over the footer.
      gsap.fromTo(
        layer,
        { y: 0 },
        {
          y: () => -window.innerHeight,
          ease: 'none',
          scrollTrigger: {
            trigger: outro,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );

      // Keyboard: focusing anything inside a project moves the corridor to it.
      // Deferred one frame so the browser's own focus scroll cannot cancel it.
      let focusFrame = 0;
      const focusHandlers = items.map((el, i) => {
        const onFocusIn = () => {
          const st = tween.scrollTrigger;
          if (!st) return;
          cancelAnimationFrame(focusFrame);
          focusFrame = requestAnimationFrame(() => {
            const y = st.start + (st.end - st.start) * (dwellCenter(i) / totalUnits(count));
            const { lenis } = window as unknown as {
              lenis?: { scrollTo: (y: number, o?: object) => void };
            };
            if (lenis) lenis.scrollTo(y, { duration: 0.9, force: true });
            else window.scrollTo({ top: y });
          });
        };
        el.addEventListener('focusin', onFocusIn);
        return onFocusIn;
      });

      apply(0);
      scheduleRefresh();
      return () => {
        cancelAnimationFrame(focusFrame);
        items.forEach((el, i) => el.removeEventListener('focusin', focusHandlers[i]));
      };
    },
    { scope: stageRef, dependencies: [staged, count, scheduleRefresh] },
  );

  const ctaLink = (
    <Link
      href="/kontakt"
      className="inline-flex items-center rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-3.5 text-sm font-semibold text-white transition-opacity duration-300 hover:opacity-90"
    >
      {data.ctaButton}
    </Link>
  );

  return (
    <div ref={stageRef} className="relative">
      {staged && (
        <div
          ref={layerRef}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 bg-[#050508]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_45%_42%,rgba(124,58,237,0.22),transparent_70%),radial-gradient(ellipse_40%_35%_at_58%_52%,rgba(6,182,212,0.14),transparent_70%)]" />
          {sceneReady && (
          <CorridorScene
            progressRef={heroProgress}
            corridorRef={corridorState}
            projects={corridorProjects}
            frameloop={running ? 'always' : 'never'}
            images={innerScreens}
            onReady={scheduleRefresh}
          />
          )}
        </div>
      )}

      <PortfolioHero images={images} onStageProgress={staged ? onHeroProgress : undefined}>
        {heroText}
      </PortfolioHero>

      {staged ? (
        <section
          ref={corridorRef}
          id="portfolio-showcase"
          aria-labelledby="portfolio-heading"
          className="relative h-screen"
        >
          <div className="mx-auto flex h-full max-w-7xl items-end px-8 pb-[11vh]">
            <ol
              data-corridor-overlay
              className="relative grid w-[min(26rem,30vw)] opacity-0"
            >
              {data.projects.map((project, i) => (
                <li
                  key={project.slug}
                  data-corridor-item
                  className="col-start-1 row-start-1 flex flex-col justify-end gap-4 opacity-0 transition-[opacity,transform] duration-500 ease-out translate-y-3 pointer-events-none data-[active]:pointer-events-auto data-[active]:translate-y-0 data-[active]:opacity-100 focus-within:opacity-100"
                >
                  <p
                    aria-hidden="true"
                    className="font-mono text-xs tracking-[0.3em] text-white/45"
                  >
                    <span className="text-white">{pad(i + 1)}</span> / {pad(count)}
                  </p>
                  <div
                    {...projectFocusProps(project, i, count)}
                    className={cn(
                      'rounded-3xl border border-white/[0.08] bg-[#050508]/70 p-7',
                      projectFocusRing,
                    )}
                  >
                    <ProjectText project={project} data={data} />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : (
        <div id="portfolio-showcase">
          <PortfolioSection data={data} />
        </div>
      )}

      {staged ? (
        <section ref={outroRef} className="relative h-screen">
          <div
            data-outro-cta
            className="mx-auto flex h-full max-w-3xl flex-col items-center justify-end gap-7 px-8 pb-[14vh] text-center opacity-0"
          >
            <h2 className="text-4xl font-black tracking-tight text-white lg:text-5xl">
              {data.ctaHeading}
            </h2>
            {ctaLink}
          </div>
        </section>
      ) : (
        <section className="relative bg-[#050508]">
          <div className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 sm:pb-32">
            <div className="flex flex-col items-start gap-6 rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-12">
              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                {data.ctaHeading}
              </h2>
              {ctaLink}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
