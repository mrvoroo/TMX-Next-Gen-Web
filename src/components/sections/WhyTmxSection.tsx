'use client';

import { useCallback, useRef } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import {
  Layers,
  Sparkles,
  Lightbulb,
  Megaphone,
  Languages,
  ShieldCheck,
  Rocket,
  Zap,
  Code,
  Globe,
  Bot,
  Target,
  Handshake,
  Palette,
  Gauge,
  MessageCircle,
  Cpu,
  Compass,
  BadgeCheck,
  Heart,
  type LucideIcon,
} from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useStaggerReveal } from '@/hooks/useStaggerReveal';
import { cn } from '@/lib/utils';
import type { WhyUsSectionData } from '@/lib/content';
import type { WhyIconName } from '@/config/why-icons';

const WHY_ICONS: Record<WhyIconName, LucideIcon> = {
  Layers,
  Sparkles,
  Lightbulb,
  Megaphone,
  Languages,
  ShieldCheck,
  Rocket,
  Zap,
  Code,
  Globe,
  Bot,
  Target,
  Handshake,
  Palette,
  Gauge,
  MessageCircle,
  Cpu,
  Compass,
  BadgeCheck,
  Heart,
};

function getWhyIcon(name: string): LucideIcon {
  return WHY_ICONS[name as WhyIconName] ?? Layers;
}

export function WhyTmxSection({ data }: { data: WhyUsSectionData }) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  /* Cursor spotlight — same technique as the IT block (no re-render per move). */
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${mouseX}px ${mouseY}px, rgba(124,58,237,0.11), transparent 70%)`;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (reduced || !sectionRef.current) return;
      const r = sectionRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - r.left);
      mouseY.set(e.clientY - r.top);
    },
    [reduced, mouseX, mouseY],
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(-1000);
    mouseY.set(-1000);
  }, [mouseX, mouseY]);

  useStaggerReveal(sectionRef, { cardRefs, reduced, start: 'top 70%' });

  const words = data.heading.split(' ');

  return (
    <section
      ref={sectionRef}
      id="why"
      aria-labelledby="why-heading"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden border-t border-white/[0.05] bg-[#070612]"
    >
      {!reduced && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          style={{ background: spotlight as any }}
          aria-hidden="true"
        />
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-28">
        <div className="mb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-violet-400/70">
            {data.sub}
          </p>
          <h2
            id="why-heading"
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

        {/* Bento: 1 col mobile → 2 cols tablet → 4 cols desktop; wide = span 2 */}
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {data.cards.map((card, i) => {
            const Icon = getWhyIcon(card.icon);
            return (
              <li
                key={i}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={cn(
                  'group relative flex min-w-0 flex-col gap-4 rounded-2xl p-6 sm:p-7',
                  'backdrop-blur-md border border-white/[0.08] bg-white/[0.03]',
                  'transition-all duration-300',
                  'hover:border-violet-500/25 hover:bg-violet-500/[0.05] hover:shadow-lg hover:shadow-violet-900/20',
                  card.wide && 'md:col-span-2',
                )}
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 to-cyan-500/10 text-violet-400 ring-1 ring-violet-500/20">
                  <Icon size={19} strokeWidth={1.5} aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold leading-snug tracking-tight text-white [overflow-wrap:anywhere]">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/55">
                  {card.text}
                </p>
                <div
                  className="absolute inset-x-0 bottom-0 h-px rounded-b-2xl bg-gradient-to-r from-transparent via-violet-500/25 to-transparent"
                  aria-hidden="true"
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
