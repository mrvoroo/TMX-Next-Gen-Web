/**
 * Dev-only test hooks for the portfolio fallbacks.
 *
 *   /portfolio?gl=0             forces the no-WebGL variant (SVG hero, no canvas)
 *   /portfolio?motion=reduce    forces the reduced-motion variant
 *
 * Active ONLY when NODE_ENV !== 'production' (`next dev`). In production
 * builds the NODE_ENV check is inlined at build time, so the parameters are
 * ignored and the branches are removed from the bundle. Server render is never
 * affected: these are read in the browser after hydration only.
 */

function devParam(name: string, value: string): boolean {
  if (process.env.NODE_ENV === 'production') return false;
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get(name) === value;
}

/** `?gl=0` — pretend WebGL is unavailable (dev only). */
export const devForceNoWebGL = () => devParam('gl', '0');

/** `?motion=reduce` — pretend prefers-reduced-motion is set (dev only). */
export const devForceReducedMotion = () => devParam('motion', 'reduce');
