'use client';

import { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useStaggerReveal } from '@/hooks/useStaggerReveal';
import { cn } from '@/lib/utils';
import { getServiceIcon } from './icons';
import { ServiceGrid } from './ServiceGrid';
import { PillarTitleLink, ServiceCardLink } from './links';
import type { PillarKey } from '@/config/pillars';
import type { PillarBlockProps } from './types';

/* ── Hub-and-spoke SVG geometry ─────────────────────────────────────────────
 *
 * viewBox "0 0 800 280", hub at (400, 140). One node per visible service,
 * alternating left (x=80) / right (x=720); each side is spread evenly on
 * y (85 px apart, centred on the hub). The node shows the service's icon —
 * no service-specific text, so it can never contradict the official names.
 */
const HUB = { x: 400, y: 140 };

interface BeamNode {
  x: number;
  y: number;
  itemIdx: number;   // index into the items array
  side: 'left' | 'right';
}

function buildNodes(count: number): BeamNode[] {
  const leftCount = Math.ceil(count / 2);
  const rightCount = count - leftCount;
  const place = (side: 'left' | 'right', sideCount: number): BeamNode[] =>
    Array.from({ length: sideCount }, (_, k) => ({
      x: side === 'left' ? 80 : 720,
      y: HUB.y + (k - (sideCount - 1) / 2) * 85,
      itemIdx: side === 'left' ? k * 2 : k * 2 + 1,
      side,
    }));
  return [...place('left', leftCount), ...place('right', rightCount)];
}

/* Pre-computed straight-line length for each beam (strokeDasharray value) */
function lineLen(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/* ── ServiceCard sub-component (keeps Icon a capitalised symbol) ───────────── */
interface ServiceCardProps {
  Icon: LucideIcon;
  label: string;
  pillar: PillarKey;
  slug: string;
  cardRef: (el: HTMLDivElement | null) => void;
}

function ServiceCard({ Icon, label, pillar, slug, cardRef }: ServiceCardProps) {
  return (
    <div
      ref={cardRef}
      id={slug}
      data-slug={slug}
      className={cn(
        'relative flex flex-col gap-4 rounded-2xl p-6 pl-5 min-w-0',
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
      <p className="text-sm font-semibold leading-snug text-white/80 [hyphens:auto] [overflow-wrap:anywhere]">{label}</p>
      <ServiceCardLink pillar={pillar} slug={slug} label={label} />
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
export function MarketingBlock({ pillar, title, sub, items, number }: PillarBlockProps) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const nodes = useMemo(() => buildNodes(items.length), [items.length]);
  const leftNodes = nodes.filter((n) => n.side === 'left');
  const rightNodes = nodes.filter((n) => n.side === 'right');
  /* beams: left nodes → hub first, then hub → right nodes */
  const beams = [
    ...leftNodes.map((n) => ({ x1: n.x, y1: n.y, x2: HUB.x, y2: HUB.y })),
    ...rightNodes.map((n) => ({ x1: HUB.x, y1: HUB.y, x2: n.x, y2: n.y })),
  ];

  /* Staggered scroll-triggered reveal — shared hook, progressive enhancement */
  useStaggerReveal(containerRef, { cardRefs, reduced });

  return (
    <div className="bg-[#050508]" ref={containerRef}>
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        {/* Block header */}
        <div className="mb-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-violet-400/60">
            {number}
          </p>
          <h3 className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            <PillarTitleLink pillar={pillar}>{title}</PillarTitleLink>
          </h3>
          <p className="text-sm text-white/45 sm:text-base">
            {sub}
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
            {beams.map((b, i) => {
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
            {beams.map((b, i) => (
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
            {leftNodes.map((n) => {
              const NodeIcon = getServiceIcon(items[n.itemIdx].icon);
              return (
                <g key={`l-${n.itemIdx}`}>
                  <circle cx={n.x} cy={n.y} r={26} fill="#0c0b18" stroke="#7c3aed" strokeWidth={0.8} strokeOpacity={0.35} />
                  <NodeIcon x={n.x - 10} y={n.y - 10} width={20} height={20} strokeWidth={1.5} color="#c4b5fd" />
                </g>
              );
            })}

            {/* ── Right nodes ── */}
            {rightNodes.map((n) => {
              const NodeIcon = getServiceIcon(items[n.itemIdx].icon);
              return (
                <g key={`r-${n.itemIdx}`}>
                  <circle cx={n.x} cy={n.y} r={26} fill="#0c0b18" stroke="#06b6d4" strokeWidth={0.8} strokeOpacity={0.35} />
                  <NodeIcon x={n.x - 10} y={n.y - 10} width={20} height={20} strokeWidth={1.5} color="#67e8f9" />
                </g>
              );
            })}
          </svg>
        </div>

        {/* ── Card grid (always visible — the SVG above is decorative) ─────── */}
        <ServiceGrid>
          {items.map((item, i) => (
            <ServiceCard
              key={item.slug}
              pillar={pillar}
              slug={item.slug}
              Icon={getServiceIcon(item.icon)}
              label={item.name}
              cardRef={(el) => { cardRefs.current[i] = el; }}
            />
          ))}
        </ServiceGrid>
      </div>
    </div>
  );
}
