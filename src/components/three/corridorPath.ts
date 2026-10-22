/**
 * Camera path of the portfolio corridor, shared by the DOM (active project,
 * keyboard scroll targets) and the WebGL scene so both always agree.
 *
 * u = scroll distance in viewport heights since the corridor section entered
 * the viewport: 1 unit scroll-in below the hero, 0.3 pinned entry, 1 unit per
 * project (pinned), then 1 unit outro (crystal reassembly above the CTA).
 */

export const HERO_END_Z = -3;
export const FIRST_SCREEN_Z = -16;
export const SCREEN_SPACING = 8;
export const VIEW_DISTANCE = 6.5;
export const ENTRY_UNITS = 1.3;
export const CRYSTAL_DISTANCE = 7;
const HALF_DWELL = 0.2;
const DWELL_OFFSET = 0.4;
const FINAL_OVERSHOOT = 3;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};
export const smoothRange = (e0: number, e1: number, v: number) => ease((v - e0) / (e1 - e0));

export const screenZ = (i: number) => FIRST_SCREEN_Z - i * SCREEN_SPACING;
const viewZ = (i: number) => screenZ(i) + VIEW_DISTANCE;

/** Pinned length in viewport heights (entry included, scroll-in excluded). */
export const pinnedUnits = (n: number) => ENTRY_UNITS - 1 + Math.max(1, n);
/** End of the corridor (start of the outro) in u. */
export const corridorUnits = (n: number) => ENTRY_UNITS + Math.max(1, n);
/** Total u range: scroll-in + pinned corridor + outro. */
export const totalUnits = (n: number) => corridorUnits(n) + 1;

/** u at which project i is centred in front of the camera. */
export const dwellCenter = (i: number) => ENTRY_UNITS + i + DWELL_OFFSET;

export const finalCameraZ = (n: number) => screenZ(Math.max(1, n) - 1) - FINAL_OVERSHOOT;
export const outroCrystalZ = (n: number) => finalCameraZ(n) - CRYSTAL_DISTANCE;
export const outroProgress = (u: number, n: number) => clamp01(u - corridorUnits(n));

export function cameraZ(u: number, n: number): number {
  const count = Math.max(1, n);
  let prevU = 0;
  let prevZ = HERO_END_Z;
  for (let i = 0; i < count; i++) {
    const a = dwellCenter(i) - HALF_DWELL;
    const z = viewZ(i);
    if (u < a) return prevZ + (z - prevZ) * ease((u - prevU) / (a - prevU));
    prevU = dwellCenter(i) + HALF_DWELL;
    prevZ = z;
    if (u <= prevU) return z;
  }
  const end = totalUnits(count);
  return prevZ + (finalCameraZ(count) - prevZ) * ease((u - prevU) / (end - prevU));
}

/** Project whose viewing position is nearest to the camera. */
export function activeIndex(camZ: number, n: number): number {
  const i = Math.round((viewZ(0) - camZ) / SCREEN_SPACING);
  return Math.min(Math.max(1, n) - 1, Math.max(0, i));
}

/** 0 → 1 while the hero hands over to the corridor (fog, visibility). */
export function corridorBlend(heroP: number, u: number): number {
  return u > 0 ? 1 : smoothRange(0.5, 1, heroP);
}
