'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import {
  Search,
  Target,
  Share2,
  FileText,
  Mail,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { translations } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

/* ── Icon order matches translations.ts services.marketing.items order ────── */
const ICONS: LucideIcon[] = [Search, Target, Share2, FileText, Mail, TrendingUp];

/* ── Hub-and-spoke SVG geometry ─────────────────────────────────────────────
 *
 * viewBox "0 0 800 280"
 *   Hub   : (400, 140)
 *   Left  : (80, 55) | (80, 140) | (80, 225)   → items 0, 4, 5
 *   Right : (720, 55) | (720, 140) | (720, 225) → items 1, 2, 3
 *
 * sqrt(320²+85²) ≈ 331   (diagonal beams)
 * 320 px                  (horizontal beams)
 */
const HUB = { x: 400, y: 140 };

interface BeamNode {
  x: number;
  y: number;
  itemIdx: number;   // index into the items array
  abbr: string;      // language-agnostic 3-letter abbreviation shown in the SVG node
}

const LEFT_NODES: BeamNode[] = [
  { x: 80,  y: 55,  itemIdx: 0, abbr: 'SEO' },
  { x: 80,  y: 140, itemIdx: 4, abbr: 'EML' },
  { x: 80,  y: 225, itemIdx: 5, abbr: 'CVR' },
];

const RIGHT_NODES: BeamNode[] = [
  { x: 720, y: 55,  itemIdx: 1, abbr: 'SEA' },
  { x: 720, y: 140, itemIdx: 2, abbr: 'SMM' },
  { x: 720, y: 225, itemIdx: 3, abbr: 'CTM' },
];

/* All 6 beams as flat array: left nodes → hub first, then hub → right nodes */
const BEAMS = [
  ...LEFT_NODES.map(n => ({ x1: n.x, y1: n.y, x2: HUB.x, y2: HUB.y })),
  ...RIGHT_NODES.map(n => ({ x1: HUB.x, y1: HUB.y, x2: n.x, y2: n.y })),
];

/* Pre-computed straight-line length for each beam (strokeDasharray value) */
function lineLen(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/* ── ServiceCard sub-component (keeps Icon a capitalised symbol) ───────────── */
interface ServiceCardProps {
  Icon: LucideIcon;
  label: string;
  cardRef: (el: HTMLDivElement | null) => void;
}

function ServiceCard({ Icon, label, cardRef }: ServiceCardProps) {
  return (
    <div
      ref={cardRef}
      className={cn(
        'relative flex flex-col gap-4 rounded-2xl p-6 pl-5',
        /* Gradient left-border accent ties into the "beam / data-flow" theme */
        'border border-white/[0.06] bg-white/[0.02]',
        'transition-colors duration-300',
        'hover:border-white/[0.1]',
        /* Pseudo left accent via box-shadow (works without extra DOM nodes) */
        'shadow-[inset_2px_0_0_0_rgba(124,58,237,0.5)]',
        'hover:shadow-[inset_2px_0_0_0_rgba(6,182,212,0.7)]',
      )}
    >
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/15 to-cyan-500/10 text-violet-400 ring-1 ring-violet-500/15">
        <Icon size={19} strokeWidth={1.5} aria-hidden="true" />
      </div>
      <p className="text-sm font-semibold leading-snug text-white/80">{label}</p>
    </div>
  );
}

/* ── Traveling dot that loops along one beam path ─────────────────────────── */
interface TravelingDotProps {
  x1: number; y1: number;
  x2: number; y2: number;
  delay: number;
  reducedMotion: boolean;
}

function TravelingDot({ x1, y1, x2, y2, delay, reducedMotion }: TravelingDotProps) {
  if (reducedMotion) return null;
  return (
    <motion.circle
      r={3}
      fill="#7c3aed"
      initial={{ cx: x1, cy: y1, opacity: 0 }}
      animate={{
        cx:      [x1, x2,  x1],
        cy:      [y1, y2,  y1],
        opacity: [0,  1,   0 ],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'linear',
        delay,
        times: [0, 0.45, 1],
      }}
    />
  );
}

/* ── Exported block ───────────────────────────────────────────────────────── */
export function MarketingBlock() {
  const { t, locale } = useTranslation();
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const items = translations[locale].services.marketing.items;

  /* Staggered GSAP scroll-reveal for the card grid */
  useEffect(() => {
    if (reduced || !containerRef.current) return;
    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      gsap.from(cards, {
        opacity: 0,
        y: 42,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div className="bg-[#050508]" ref={containerRef}>
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        {/* Block header */}
        <div className="mb-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-violet-400/60">
            03
          </p>
          <h3 className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {t('services.marketing.title')}
          </h3>
          <p className="text-sm text-white/45 sm:text-base">
            {t('services.marketing.sub')}
          </p>
        </div>

        {/*
         * Hub-and-spoke SVG — visible only on md+ screens.
         * On mobile the card grid below provides the full information.
         */}
        <div className="mb-12 hidden md:block" aria-hidden="true">
          <svg
            viewBox="0 0 800 280"
            className="w-full max-w-2xl mx-auto overflow-visible"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Left-to-right gradient for beams */}
              <linearGradient id="mkt-beam" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#7c3aed" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.9} />
              </linearGradient>
              {/* Hub inner fill */}
              <radialGradient id="mkt-hub-fill" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="#1e0a4a" />
                <stop offset="100%" stopColor="#0c0b18" />
              </radialGradient>
            </defs>

            {/* ── Animated beam lines ── */}
            {BEAMS.map((b, i) => {
              const len = lineLen(b.x1, b.y1, b.x2, b.y2);
              return (
                <motion.path
                  key={i}
                  d={`M ${b.x1} ${b.y1} L ${b.x2} ${b.y2}`}
                  stroke="url(#mkt-beam)"
                  strokeWidth={1.2}
                  fill="none"
                  strokeDasharray={len}
                  initial={{ strokeDashoffset: len, opacity: 0 }}
                  whileInView={{ strokeDashoffset: 0, opacity: reduced ? 0.6 : 0.65 }}
                  transition={{ duration: 1.2, delay: reduced ? 0 : i * 0.18, ease: 'easeOut' }}
                  viewport={{ once: true, margin: '0px 0px -80px 0px' }}
                />
              );
            })}

            {/* ── Traveling dots (one per beam, staggered) ── */}
            {BEAMS.map((b, i) => (
              <TravelingDot
                key={`dot-${i}`}
                x1={b.x1} y1={b.y1}
                x2={b.x2} y2={b.y2}
                delay={i * 0.4 + 1.4}
                reducedMotion={reduced}
              />
            ))}

            {/* ── Hub circle ── */}
            <circle cx={HUB.x} cy={HUB.y} r={50} fill="url(#mkt-hub-fill)" />
            <circle cx={HUB.x} cy={HUB.y} r={50} fill="none" stroke="#7c3aed" strokeWidth={1} strokeOpacity={0.45} />
            {/* Pulsing outer ring */}
            {!reduced && (
              <motion.circle
                cx={HUB.x} cy={HUB.y} r={54}
                fill="none"
                stroke="#7c3aed"
                strokeWidth={1.5}
                animate={{ r: [50, 62, 50], strokeOpacity: [0.45, 0, 0.45] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            <text x={HUB.x} y={HUB.y - 6}  textAnchor="middle" fill="white"   fontSize={9} fontWeight="bold"   fontFamily="Inter, sans-serif" opacity={0.95}>MARKETING</text>
            <text x={HUB.x} y={HUB.y + 10} textAnchor="middle" fill="#7c3aed" fontSize={8} fontFamily="Inter, sans-serif" opacity={0.8}>HUB</text>

            {/* ── Left nodes ── */}
            {LEFT_NODES.map((n) => (
              <g key={`l-${n.itemIdx}`}>
                <circle cx={n.x} cy={n.y} r={26} fill="#0c0b18" stroke="#7c3aed" strokeWidth={0.8} strokeOpacity={0.35} />
                <text x={n.x} y={n.y + 4} textAnchor="middle" fill="#c4b5fd" fontSize={8} fontWeight="bold" fontFamily="Inter, sans-serif">
                  {n.abbr}
                </text>
              </g>
            ))}

            {/* ── Right nodes ── */}
            {RIGHT_NODES.map((n) => (
              <g key={`r-${n.itemIdx}`}>
                <circle cx={n.x} cy={n.y} r={26} fill="#0c0b18" stroke="#06b6d4" strokeWidth={0.8} strokeOpacity={0.35} />
                <text x={n.x} y={n.y + 4} textAnchor="middle" fill="#67e8f9" fontSize={8} fontWeight="bold" fontFamily="Inter, sans-serif">
                  {n.abbr}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* ── Card grid (always visible — the SVG above is decorative) ─────── */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {items.map((item, i) => (
            <ServiceCard
              key={item}
              Icon={ICONS[i]}
              label={item}
              cardRef={(el) => { cardRefs.current[i] = el; }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
