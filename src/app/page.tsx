'use client';

import { useState } from 'react';
import { Preloader }     from '@/components/sections/Preloader';
import { HeroSection }   from '@/components/sections/HeroSection';
import { StatsStrip }    from '@/components/sections/StatsStrip';
import { AboutSection }  from '@/components/sections/AboutSection';

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {/* Preloader — renders on top (z-[9999]) while assets load */}
      {loading && (
        <Preloader onComplete={() => setLoading(false)} />
      )}

      {/* SECTION 2 — Hero */}
      <HeroSection shouldAnimate={!loading} />

      {/* SECTION 3 — Stats strip */}
      <StatsStrip />

      {/* SECTION 4 — About (pinned scroll-driven assembly) */}
      <AboutSection />
    </>
  );
}
