'use client';

import { useSyncExternalStore } from 'react';

/**
 * "Now" for time-dependent demo UI (opening status, next free days).
 * null in the static HTML and during hydration, the real time right after –
 * no hydration mismatch and no setState-in-effect. Fixed per page load.
 */
let cached: number | null = null;
const subscribe = () => () => {};
const getSnapshot = () => (cached ??= Date.now());
const getServerSnapshot = () => null;

export function useClientNow(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
