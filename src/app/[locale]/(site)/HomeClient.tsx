'use client';

import { useState } from 'react';
import { Preloader, hasPreloaderPlayed } from '@/components/sections/Preloader';
import { HeroSection }   from '@/components/sections/HeroSection';
import { AboutSection }    from '@/components/sections/AboutSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { ProcessSection }  from '@/components/sections/ProcessSection';
import { WhyTmxSection }   from '@/components/sections/WhyTmxSection';
import type {
  AboutSectionData,
  ProcessSectionData,
  ServicesSectionData,
  WhyUsSectionData,
} from '@/lib/content';

export default function HomeClient({
  about,
  services,
  process,
  whyUs,
}: {
  about: AboutSectionData | null;
  services: ServicesSectionData | null;
  process: ProcessSectionData | null;
  whyUs: WhyUsSectionData | null;
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
      {about && <AboutSection data={about} />}

      {/* SECTION 5 — Services (4 pillar sub-blocks) */}
      {services && <ServicesSection data={services} />}

      {/* SECTION 6 — How I work (pinned horizontal timeline on desktop) */}
      {process && <ProcessSection data={process} />}

      {/* SECTION 7 — Why TMX (bento grid) */}
      {whyUs && <WhyTmxSection data={whyUs} />}
    </>
  );
}
