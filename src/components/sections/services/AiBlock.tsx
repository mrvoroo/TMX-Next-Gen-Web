'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import {
  Brain,
  Cpu,
  MessageSquare,
  RefreshCw,
  Bot,
  BarChart2,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useStaggerReveal } from '@/hooks/useStaggerReveal';
import { translations } from '@/lib/i18n/translations';
import { cn } from '@/lib/utils';
import type { AiParticlesProps } from '@/components/three/AiParticles';

/*
 * Lazy-load the R3F canvas — same pattern as ParticleNetwork in HeroSection.
 * ssr: false is essential (Canvas is a browser-only API).
 */
const AiParticles = dynamic<AiParticlesProps>(
  () => import('@/components/three/AiParticles').then((m) => m.AiParticles),
  { ssr: false, loading: () => null },
);

/* ── Icon order matches translations.ts services.ai.items order ─────────── */
const ICONS: LucideIcon[] = [Brain, Cpu, MessageSquare, RefreshCw, Bot, BarChart2];

/* ── Individual card (extracted so Icon can be a capitalised JSX component) */
interface AiCardProps {
  Icon: LucideIcon;
  label: string;
  cardRef: (el: HTMLDivElement | null) => void;
}

function AiCard({ Icon, label, cardRef }: AiCardProps) {
  return (
    <div
      ref={cardRef}
      className={cn(
        'relative flex flex-col gap-4 rounded-2xl p-6',
        'border border-cyan-500/10 bg-cyan-500/[0.03]',
        'transition-all duration-300',
        'hover:border-cyan-400/20 hover:bg-cyan-500/[0.06] hover:shadow-lg hover:shadow-cyan-900/20',
      )}
    >
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600/20 to-violet-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
        <Icon size={19} strokeWidth={1.5} aria-hidden="true" />
      </div>
      <p className="text-sm font-semibold leading-snug text-white/80">{label}</p>
      <div
        className="absolute inset-x-0 bottom-0 h-px rounded-b-2xl bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}

export function AiBlock() {
  const { t, locale } = useTranslation();
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const items = translations[locale].services.ai.items;

  /*
   * Shared progressive-enhancement reveal hook.
   * The canvasReady gate has been removed — the hook's failsafe timers (+2 s/+4 s)
   * cover the WebGL paint lag without creating a dependency that could starve the
   * trigger from ever firing if the canvas fails to load.
   */
  useStaggerReveal(containerRef, { cardRefs, reduced });

  return (
    /*
     * Outer wrapper: relative so the absolute particle canvas fills it.
     * bg-[#070612] creates a slight blue-black contrast with the Dev block.
     */
    <div className="relative bg-[#070612] overflow-hidden">
      {/* Ambient particle canvas — absolute, behind cards, pointer-events-none */}
      {!reduced && (
        <AiParticles
          reducedMotion={reduced}
          onReady={() => {/* no-op: reveal no longer gated on canvas */}}
        />
      )}

      {/* Content sits above the canvas via relative z-10 */}
      <div
        ref={containerRef}
        className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24"
      >
        {/* Block header */}
        <div className="mb-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-400/60">
            02
          </p>
          <h3 className="mb-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {t('services.ai.title')}
          </h3>
          <p className="text-sm text-white/45 sm:text-base">
            {t('services.ai.sub')}
          </p>
        </div>

        {/* 6 cards — 2-col mobile → 3-col md+ */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {items.map((item, i) => (
            <AiCard
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
