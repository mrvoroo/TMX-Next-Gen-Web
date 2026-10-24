'use client';

/**
 * Mobile-only replacement for the 3D object in the About section.
 * A scroll-driven story in three acts while the stage stays pinned (CSS
 * sticky, no WebGL):
 *   1. "Your ideas"   – a dozen loose ideas float around in chaos
 *   2. "We organise"  – they fly into three clear groups, linked by lines
 *   3. "One strong solution" – everything collapses into one glowing result
 * Only transform/opacity are animated. Reduced motion: the final state.
 */
import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { Check, Globe, Megaphone, Sparkles } from 'lucide-react';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

type Group = 0 | 1 | 2;

const T = {
  de: {
    steps: ['Ihre Ideen', 'Wir ordnen', 'Eine starke Lösung'],
    captions: [
      'Viele Ideen, viele Fragen – und noch kein Plan.',
      'Ich sortiere, verbinde und setze Prioritäten.',
      'Daraus entsteht eine klare, kreative Lösung aus einer Hand.',
    ],
    groups: ['Web', 'Werbung', 'KI'],
    ideas: ['Website?', 'Onlineshop', 'SEO', 'Fotos', 'Instagram', 'TikTok-Ads', 'Newsletter', 'Budget?', 'KI?', 'Chatbot', 'Termine', 'Automatik'],
    solution: 'Ihre Lösung',
    solutionRows: ['Website & Shop', 'Werbung, die wirkt', 'KI & Automatisierung'],
    label: 'Animation: aus verstreuten Ideen wird eine klare Lösung',
  },
  en: {
    steps: ['Your ideas', 'We organise', 'One strong solution'],
    captions: [
      'Lots of ideas, lots of questions – and no plan yet.',
      'I sort, connect and set priorities.',
      'The result: one clear, creative solution from a single source.',
    ],
    groups: ['Web', 'Ads', 'AI'],
    ideas: ['Website?', 'Online shop', 'SEO', 'Photos', 'Instagram', 'TikTok ads', 'Newsletter', 'Budget?', 'AI?', 'Chatbot', 'Bookings', 'Automation'],
    solution: 'Your solution',
    solutionRows: ['Website & shop', 'Ads that work', 'AI & automation'],
    label: 'Animation: scattered ideas become one clear solution',
  },
};

/** Chaos positions (% of the stage) and tilt per idea. */
const CHAOS: [number, number, number, number][] = [
  // x %, y %, tilt °, size
  [26, 14, -12, 1.1],
  [72, 20, 9, 0.9],
  [50, 38, -4, 1.25],
  [24, 62, 14, 0.85],
  [76, 52, -10, 1.15],
  [38, 86, 7, 0.9],
  [64, 72, -15, 1.05],
  [76, 88, 11, 0.85],
  [30, 32, 18, 0.95],
  [56, 10, -8, 0.8],
  [24, 44, -18, 1],
  [70, 36, 16, 0.9],
];
/** Ordered layout: idea i → group, row. */
const GROUP_OF: Group[] = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2];
const COL_X = [21, 50, 79];
const ROW_Y = [34, 48, 62, 76];
const GROUP_COLOR = ['#a78bfa', '#22d3ee', '#f0abfc'];

/** Scroll stops (0–1): chaos → order → solution. */
const S = { chaosEnd: 0.14, orderStart: 0.4, orderEnd: 0.52, solveStart: 0.8, merged: 0.88, end: 0.96 };

function Chip({
  i,
  text,
  p,
  size,
}: {
  i: number;
  text: string;
  p: MotionValue<number>;
  size: { w: number; h: number };
}) {
  const [cx, cy, rot, size0] = CHAOS[i];
  const g = GROUP_OF[i];
  const row = i % 4;
  const ox = COL_X[g];
  const oy = ROW_Y[row];
  // ordered until solveStart, then a quick merge into the centre
  const stops = [0, S.chaosEnd, S.orderStart, S.solveStart, S.merged, S.end];
  const px = (v: number) => (v / 100) * size.w;
  const py = (v: number) => (v / 100) * size.h;

  const x = useTransform(p, stops, [px(cx), px(cx), px(ox), px(ox), px(50), px(50)]);
  const y = useTransform(p, stops, [py(cy), py(cy), py(oy), py(oy), py(50), py(50)]);
  const rotate = useTransform(p, stops, [rot, rot, 0, 0, 0, 0]);
  const scale = useTransform(p, [0, S.chaosEnd, S.orderStart, S.solveStart, S.merged], [size0, size0, 1, 1, 0.25]);
  const opacity = useTransform(p, [0, S.solveStart + 0.03, S.merged], [1, 1, 0]);
  const tint = useTransform(p, [S.chaosEnd, S.orderStart], [0, 1]);
  const borderColor = useTransform(tint, [0, 1], ['rgba(255,255,255,0.14)', `${GROUP_COLOR[g]}99`]);
  const color = useTransform(tint, [0, 1], ['rgba(255,255,255,0.7)', '#ffffff']);

  return (
    <motion.span
      aria-hidden="true"
      style={{ x, y, rotate, scale, opacity }}
      className="absolute left-0 top-0 will-change-transform"
    >
      <motion.span
        // animationDelay staggers the idle float per chip
        style={{ borderColor, color, animationDelay: `${(i % 6) * -0.7}s` }}
        className="idea-float block [transform:translate(-50%,-50%)] whitespace-nowrap rounded-full border bg-[#15131f] px-2 py-1 text-[10px] font-semibold min-[380px]:text-[11px]"
      >
        {text}
      </motion.span>
    </motion.span>
  );
}

function Links({ p }: { p: MotionValue<number> }) {
  const draw = useTransform(p, [S.orderStart + 0.02, S.orderEnd + 0.06], [0, 1]);
  const opacity = useTransform(p, [S.orderStart, S.orderStart + 0.04, S.solveStart - 0.02, S.solveStart + 0.02], [0, 1, 1, 0]);
  return (
    <motion.svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" style={{ opacity }}>
      {COL_X.map((x, g) => (
        <motion.path
          key={g}
          d={`M${x} ${ROW_Y[0]} L${x} ${ROW_Y[3]}`}
          stroke={GROUP_COLOR[g]}
          strokeWidth="0.5"
          strokeDasharray="1.5 1.5"
          vectorEffect="non-scaling-stroke"
          fill="none"
          style={{ pathLength: draw }}
        />
      ))}
      {/* the three groups converge towards the centre */}
      {COL_X.map((x, g) => (
        <motion.path
          key={`c${g}`}
          d={`M${x} ${ROW_Y[3] + 6} Q${x} 94 50 94`}
          stroke={GROUP_COLOR[g]}
          strokeOpacity="0.6"
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
          fill="none"
          style={{ pathLength: draw }}
        />
      ))}
    </motion.svg>
  );
}

function GroupLabels({ p, labels }: { p: MotionValue<number>; labels: string[] }) {
  const opacity = useTransform(p, [S.orderStart - 0.04, S.orderStart + 0.06, S.solveStart - 0.02, S.solveStart + 0.02], [0, 1, 1, 0]);
  const y = useTransform(p, [S.orderStart - 0.04, S.orderStart + 0.06], [10, 0]);
  return (
    <motion.div aria-hidden="true" style={{ opacity, y }} className="absolute inset-x-0 top-[17%]">
      {labels.map((l, g) => {
        const Icon = [Globe, Megaphone, Sparkles][g];
        return (
          <span
            key={l}
            className="absolute flex -translate-x-1/2 items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ left: `${COL_X[g]}%`, color: GROUP_COLOR[g] }}
          >
            <Icon size={12} />
            {l}
          </span>
        );
      })}
    </motion.div>
  );
}

function Solution({ p, title, rows, reduced }: { p: MotionValue<number>; title: string; rows: string[]; reduced: boolean }) {
  const scale = useTransform(p, [S.solveStart + 0.04, S.end], [0.5, 1]);
  const opacity = useTransform(p, [S.solveStart + 0.04, S.merged + 0.02], [0, 1]);
  const ring = useTransform(p, [S.merged - 0.02, 1], [0.2, 1.7]);
  const ringOpacity = useTransform(p, [S.merged - 0.02, S.merged + 0.02, 1], [0, 0.8, 0]);
  return (
    <>
      <motion.span
        aria-hidden="true"
        style={reduced ? { opacity: 0 } : { scale: ring, opacity: ringOpacity }}
        className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-violet-400/60"
      />
      <motion.div
        style={reduced ? undefined : { scale, opacity }}
        className="absolute left-1/2 top-1/2 w-[78%] max-w-[17rem] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative rounded-3xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 p-px shadow-[0_0_60px_-12px_rgba(124,58,237,0.75)]">
          <div className="rounded-[calc(1.5rem-1px)] bg-[#0b0a14]/95 p-5">
            <p className="flex items-center gap-2 text-sm font-black text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400">
                <Sparkles size={14} aria-hidden="true" />
              </span>
              {title}
            </p>
            <ul className="mt-4 space-y-2.5">
              {rows.map((r, i) => (
                <li key={r} className="flex items-center gap-2.5 text-[13px] text-white/80">
                  <Check size={14} aria-hidden="true" style={{ color: GROUP_COLOR[i] }} />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export function IdeasStory({ reduced }: { reduced: boolean }) {
  const locale = useLocale() === 'en' ? 'en' : 'de';
  const t = T[locale];
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 320, h: 320 });
  const [step, setStep] = useState(reduced ? 2 : 0);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start 15%', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });
  const fixed = useTransform(scrollYProgress, () => 1);
  const p = reduced ? fixed : smooth;

  useMotionValueEvent(p, 'change', (v) => {
    const s = v < 0.3 ? 0 : v < S.solveStart + 0.02 ? 1 : 2;
    setStep((prev) => (prev === s ? prev : s));
  });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={trackRef} data-ideas-track className={cn('relative', reduced ? '' : 'h-[230vh]')}>
      <style>{`
        @keyframes idea-float { 0%,100% { transform: translate(-50%,-50%) translateY(0) } 50% { transform: translate(-50%,-50%) translateY(-5px) } }
        .idea-float { animation: idea-float 3.6s ease-in-out infinite }
        @media (prefers-reduced-motion: reduce) { .idea-float { animation: none } }
      `}</style>
      <div className={cn('flex flex-col items-center', !reduced && 'sticky top-16 h-[calc(100svh-4rem)] justify-center')}>
        <div
          ref={stageRef}
          role="img"
          aria-label={t.label}
          className="relative aspect-square w-full max-w-[22rem] overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[radial-gradient(circle_at_50%_45%,rgba(124,58,237,0.18),transparent_65%)]"
        >
          {!reduced && (
            <>
              <Links p={p} />
              <GroupLabels p={p} labels={t.groups} />
              {t.ideas.map((idea, i) => (
                <Chip key={idea} i={i} text={idea} p={p} size={size} />
              ))}
            </>
          )}
          <Solution p={p} title={t.solution} rows={t.solutionRows} reduced={reduced} />
        </div>

        {/* step indicator + caption (live for screen readers) */}
        <ol className="mt-6 flex w-full max-w-[22rem] gap-2" aria-label={t.label}>
          {t.steps.map((s, i) => (
            <li key={s} aria-current={step === i ? 'step' : undefined} className="flex-1">
              <span className={cn('block h-1 rounded-full transition-colors duration-500', i <= step ? 'bg-gradient-to-r from-violet-500 to-cyan-400' : 'bg-white/10')} />
              <span className={cn('mt-2 block text-[11px] font-semibold transition-colors duration-500', step === i ? 'text-white' : 'text-white/45')}>
                {i + 1} · {s}
              </span>
            </li>
          ))}
        </ol>
        <p aria-live="polite" className="mt-3 min-h-[2.5rem] w-full max-w-[22rem] text-sm leading-relaxed text-white/65">
          {t.captions[step]}
        </p>
      </div>
    </div>
  );
}
