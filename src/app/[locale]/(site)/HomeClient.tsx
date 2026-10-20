'use client';

import { useState } from 'react';
import { Preloader, hasPreloaderPlayed } from '@/components/sections/Preloader';
import { HeroSection }   from '@/components/sections/HeroSection';
import { AboutSection }    from '@/components/sections/AboutSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { PortfolioSection } from '@/components/sections/PortfolioSection';
import type { PortfolioSectionData, ServicesSectionData } from '@/lib/content';

export default function HomeClient({
  services,
  portfolio,
}: {
  services: ServicesSectionData | null;
  portfolio: PortfolioSectionData | null;
}) {
  const [loading, setLoading] = useState(() => !hasPreloaderPlayed());

  return (
    <>
      {/* Preloader — renders on top (z-[9999]) while assets load */}
      {loading && (
        <Preloader onComplete={() => setLoading(false)} />
      )}

      {/* SECTION 2 — Hero */}
      <HeroSection shouldAnimate={!loading} />

      {/* SECTION 3 — Stats strip */}
      {/* StatsStrip hidden: fake numbers (UWG risk). Re-add with real stats later. */}

      {/* SECTION 4 — About (pinned scroll-driven assembly) */}
      <AboutSection />

      {/* SECTION 5 — Services (4 pillar sub-blocks) */}
      {services && <ServicesSection data={services} />}

      {/* SECTION 6 — Portfolio (hidden while no project is shown) */}
      {portfolio && <PortfolioSection data={portfolio} />}
    </>
  );
}
