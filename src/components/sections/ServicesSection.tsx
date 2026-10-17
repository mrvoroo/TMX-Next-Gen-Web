'use client';

import { DevBlock }       from './services/DevBlock';
import { AiBlock }        from './services/AiBlock';
import { MarketingBlock } from './services/MarketingBlock';
import { ItBlock }        from './services/ItBlock';
import type { ServicesSectionData } from '@/lib/content';

export function ServicesSection({ data }: { data: ServicesSectionData }) {
  /* A pillar without visible services hides its whole block. */
  const blocks = [
    { key: 'dev',       pillar: data.dev,       Block: DevBlock },
    { key: 'ai',        pillar: data.ai,        Block: AiBlock },
    { key: 'marketing', pillar: data.marketing, Block: MarketingBlock },
    { key: 'it',        pillar: data.it,        Block: ItBlock },
  ].filter((b) => b.pillar.items.length > 0);

  return (
    <section id="services" className="relative bg-[#050508]">
      {/* ── Section header ──────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-5 pb-0 pt-24 sm:px-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-violet-400/70">
          {data.sub}
        </p>
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
          {data.heading.split(' ').map((word, i, arr) =>
            i === arr.length - 1 ? (
              <span key={i} className="gradient-text">{word}</span>
            ) : (
              <span key={i} className="text-white">{word}{' '}</span>
            ),
          )}
        </h2>
      </div>

      {/* 5a Development (tilt cards) · 5b AI (particles) · 5c Marketing (SVG beams)
          · 5d IT & Consulting (glass + spotlight) */}
      {blocks.map(({ key, pillar, Block }, i) => (
        <div
          key={key}
          className={i === 0 ? 'border-t border-white/[0.05] mt-16' : 'border-t border-white/[0.05]'}
        >
          <Block
            title={pillar.title}
            sub={pillar.sub}
            items={pillar.items}
            number={String(i + 1).padStart(2, '0')}
          />
        </div>
      ))}
    </section>
  );
}
