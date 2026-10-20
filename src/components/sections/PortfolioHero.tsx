'use client';

/**
 * Portfolio hero — glass crystal behind the server-rendered hero text.
 *
 * Variant (decided after hydration, re-evaluated on debounced resize):
 *  - desktop  ≥1024px, WebGL2, no reduced motion: full scene, hero pinned,
 *             scroll shatters the crystal and flies the camera through it.
 *  - light    <1024px (or no WebGL2): lighter material and counts, the
 *             shatter plays over a short scroll range without pinning.
 *  - reduced  prefers-reduced-motion: static crystal, no pin, no shatter.
 *  - none     no WebGL: CSS/SVG glow only.
 *
 * Scroll progress lives in a ref read by the scene's useFrame; the text fade
 * is part of the same scrubbed timeline.
 */

import dynamic from 'next/dynamic';
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { CrystalSceneProps } from '@/components/three/CrystalScene';

gsap.registerPlugin(ScrollTrigger);

const CrystalScene = dynamic<CrystalSceneProps>(
  () => import('@/components/three/CrystalScene').then((m) => m.CrystalScene),
  { ssr: false, loading: () => null },
);

type Variant =
  | 'pending'
  | 'none'
  | 'desktop'
  | 'light'
  | 'reduced-desktop'
  | 'reduced-light';

const DESKTOP_QUERY = '(min-width: 1024px)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';
const MAX_SCREENS = 4;

/* ── Variant store ───────────────────────────────────────────────────────── */

let webglLevel: 0 | 1 | 2 | null = null;

function detectWebGL(): 0 | 1 | 2 {
  if (webglLevel !== null) return webglLevel;
  try {
    const canvas = document.createElement('canvas');
    const gl2 = canvas.getContext('webgl2');
    const gl = gl2 ?? canvas.getContext('webgl');
    webglLevel = gl2 ? 2 : gl ? 1 : 0;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    webglLevel = 0;
  }
  return webglLevel;
}

function computeVariant(): Variant {
  const gl = detectWebGL();
  if (gl === 0) return 'none';
  const desktop = window.matchMedia(DESKTOP_QUERY).matches && gl === 2;
  if (window.matchMedia(REDUCED_QUERY).matches) {
    return desktop ? 'reduced-desktop' : 'reduced-light';
  }
  return desktop ? 'desktop' : 'light';
}

let currentVariant: Variant | null = null;

function getSnapshot(): Variant {
  if (currentVariant === null) currentVariant = computeVariant();
  return currentVariant;
}

function subscribe(onChange: () => void) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const update = () => {
    const next = computeVariant();
    if (next === currentVariant) return;
    currentVariant = next;
    onChange();
  };
  const onResize = () => {
    clearTimeout(timer);
    timer = setTimeout(update, 200);
  };
  const reduced = window.matchMedia(REDUCED_QUERY);
  window.addEventListener('resize', onResize, { passive: true });
  reduced.addEventListener('change', update);
  return () => {
    clearTimeout(timer);
    window.removeEventListener('resize', onResize);
    reduced.removeEventListener('change', update);
  };
}

/* ── No-WebGL fallback ───────────────────────────────────────────────────── */

function CrystalFallback() {
  const id = useId();
  return (
    <svg
      viewBox="0 0 200 260"
      className="absolute left-1/2 top-[42%] h-[46vh] max-h-[420px] -translate-x-1/2 -translate-y-1/2 opacity-70"
      fill="none"
    >
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <path
        d="M100 6 L176 92 L160 168 L100 254 L40 168 L24 92 Z"
        fill={`url(#${id}-g)`}
        fillOpacity="0.12"
        stroke={`url(#${id}-g)`}
        strokeOpacity="0.6"
      />
      <path
        d="M100 6 L68 92 L100 168 L132 92 Z M24 92 H176 M40 168 H160 M68 92 L40 168 M132 92 L160 168 M100 168 V254"
        stroke={`url(#${id}-g)`}
        strokeOpacity="0.35"
      />
    </svg>
  );
}

/* ── Hero ────────────────────────────────────────────────────────────────── */

export function PortfolioHero({
  images,
  children,
}: {
  images: string[];
  children: ReactNode;
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [inView, setInView] = useState(true);

  const variant = useSyncExternalStore<Variant>(subscribe, getSnapshot, () => 'pending');
  const scroll = variant === 'desktop' || variant === 'light';
  const hasCanvas = variant !== 'pending' && variant !== 'none';
  const quality = variant === 'desktop' || variant === 'reduced-desktop' ? 'high' : 'low';

  const screens = useMemo(() => {
    const local = images.filter((src) => src.startsWith('/') && !src.startsWith('//'));
    return local.slice(0, MAX_SCREENS).map(
      (src) => `/_next/image?url=${encodeURIComponent(src)}&w=828&q=75`,
    );
  }, [images]);

  const scheduleRefresh = useCallback(() => {
    clearTimeout(refreshTimer.current);
    refreshTimer.current = setTimeout(() => ScrollTrigger.refresh(), 150);
  }, []);
  useEffect(() => () => clearTimeout(refreshTimer.current), []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '100px 0px' },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      progressRef.current = 0;
      const hero = heroRef.current;
      if (!scroll || !hero) return;

      const pinned = variant === 'desktop';
      const proxy = { p: 0 };
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        onUpdate: () => {
          progressRef.current = proxy.p;
        },
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: pinned ? '+=130%' : '+=60%',
          pin: pinned,
          scrub: pinned ? 0.6 : 0.4,
          anticipatePin: pinned ? 1 : 0,
          invalidateOnRefresh: true,
          // Sits above the showcase pin; refresh it first.
          refreshPriority: 1,
        },
      });
      tl.to(proxy, { p: 1, duration: 1 }, 0)
        .to(
          '[data-hero-text]',
          { autoAlpha: 0, y: -24, filter: 'blur(10px)', duration: 0.26, stagger: 0.02 },
          0,
        )
        .to('[data-hero-bg]', { autoAlpha: 0, duration: 0.12 }, 0.88);

      scheduleRefresh();
    },
    { scope: heroRef, dependencies: [variant, scroll, scheduleRefresh] },
  );

  const frameloop = !scroll ? 'demand' : inView ? 'always' : 'never';

  return (
    <div
      ref={heroRef}
      id="portfolio-hero"
      className="relative h-[100svh] min-h-[560px] overflow-hidden bg-[#050508]"
    >
      <div data-hero-bg aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_45%_42%,rgba(124,58,237,0.22),transparent_70%),radial-gradient(ellipse_40%_35%_at_58%_52%,rgba(6,182,212,0.14),transparent_70%)]" />
        {variant === 'none' && <CrystalFallback />}
        {hasCanvas && (
          <div className="absolute inset-0">
            <CrystalScene
              key={variant}
              progressRef={progressRef}
              quality={quality}
              animated={scroll}
              frameloop={frameloop}
              images={screens}
              onReady={scheduleRefresh}
            />
          </div>
        )}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#050508] via-[#050508]/75 to-transparent"
      />
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-14 sm:px-8 sm:pb-20">
        {children}
      </div>
    </div>
  );
}
