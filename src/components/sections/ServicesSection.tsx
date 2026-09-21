'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';
import { DevBlock }       from './services/DevBlock';
import { AiBlock }        from './services/AiBlock';
import { MarketingBlock } from './services/MarketingBlock';

export function ServicesSection() {
  const { t } = useTranslation();

  return (
    <section id="services" className="relative bg-[#050508]">
      {/* ── Section header ──────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-5 pb-0 pt-24 sm:px-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-violet-400/70">
          {t('services.sub')}
        </p>
        <h2 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
          {t('services.heading').split(' ').map((word, i, arr) =>
            i === arr.length - 1 ? (
              <span key={i} className="gradient-text">{word}</span>
            ) : (
              <span key={i} className="text-white">{word}{' '}</span>
            ),
          )}
        </h2>
      </div>

      {/* ── 5a: Development (tilt cards) ────────────────────────────────── */}
      <div className="border-t border-white/[0.05] mt-16">
        <DevBlock />
      </div>

      {/* ── 5b: AI (ambient particle background) ───────────────────────── */}
      <div className="border-t border-white/[0.05]">
        <AiBlock />
      </div>

      {/* ── 5c: Marketing (SVG beam hub-and-spoke + card grid) ──────────── */}
      <div className="border-t border-white/[0.05]">
        <MarketingBlock />
      </div>

      {/* 5d block will be added in the next commit */}
    </section>
  );
}
