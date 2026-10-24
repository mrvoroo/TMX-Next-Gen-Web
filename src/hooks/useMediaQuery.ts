'use client';

import { useSyncExternalStore } from 'react';

/**
 * Media query as state. null on the server and during hydration (unknown),
 * so callers render neither variant until the real value is known – no
 * hydration mismatch and no heavy desktop-only component flashing on phones.
 */
export function useMediaQuery(query: string): boolean | null {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => null,
  );
}

/** Phones and small tablets (< 768px, Tailwind `md`). */
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
