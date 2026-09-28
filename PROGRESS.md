# TMX Agency Website - Comprehensive Handoff Document

## 1. Project Overview
- **Stack:** Next.js 16 App Router, TypeScript, Tailwind v4, Framer Motion, GSAP + ScrollTrigger, Lenis, @react-three/fiber + drei.
- **Core Conventions:**
  - Translation dictionary pattern via `t()`.
  - GSAP cleanup pattern using `gsap.context()`.
  - German (DE) is the default language, with English (EN) available via toggle.
  - **No `git push` without explicit user permission.**

## 2. Completed Features / Current State
Reflecting current state after git reset to `a91c5fd`:
- **Section 1:** Hero section
- **Section 2:** Introduction / About
- **Section 3:** Services Overview
- **Section 4:** Detailed Services Introduction
- **Section 5:** Services Breakdown
  - 5a: Web Development
  - 5b: AI Particle Cards
  - 5c: Marketing Beams
  - 5d: IT Glassmorphism Spotlight
- **Performance Fixes:** LCP (Largest Contentful Paint) opacity and CLS (Cumulative Layout Shift) font/layout shifts fixed.
- **Footer / Legal:** Footer legal links and cookie consent routing.

## 3. Current Git State
- **Last Commit Hash:** `d7c4f64` (fix: resolve 5b/5d ScrollTrigger race on German direct load)
- **Previous:** `a91c5fd` (fix: LCP opacity and CLS font/layout shifts)
- **Remote Status:** Local branch is ahead of `origin/main` by 1 commit (not pushed — per convention, no push without explicit permission).

## 4. Known Unresolved Bugs
- **/impressum and /datenschutz hydration error:** 
  - **Details:** Causes a "removeChild... not a child of this node" error. 
  - **Status:** Confirmed NOT to be caused by browser extensions. The root cause is not yet fixed. A previous fix attempt broke other sections and was therefore reverted. It must be tackled fresh, one small change at a time, testing after each step.
- **Sections 5b (AI) and 5d (IT) rendering issue — FIXED (commit `d7c4f64`):**
  - **Root Cause Confirmed:** ScrollTrigger position calculations ran before heavy visual elements finished mounting — the `AiParticles` WebGL canvas (lazy-loaded via `next/dynamic ssr:false`) had zero height when the `useEffect` fired, and `ItBlock`'s `backdrop-blur` compositing hadn't settled. Both caused ST to measure the wrong trigger position, freezing cards mid-animation.
  - **Fix Applied:**
    1. **AiBlock (`AiBlock.tsx` + `AiParticles.tsx`):** Added `onReady` prop to `AiParticles`, fired from R3F `Canvas.onCreated`. `AiBlock` holds `canvasReady` state; ScrollTrigger creation is gated behind it (GSAP `useEffect` deps: `[reduced, canvasReady]`). Added `invalidateOnRefresh: true`.
    2. **ItBlock (`ItBlock.tsx`):** ScrollTrigger creation deferred behind two `requestAnimationFrame` ticks — first rAF waits for paint commit, second waits for Lenis/ST setup in the same tick to complete. Added `invalidateOnRefresh: true`. Cleanup cancels both rAFs + calls `ctx.revert()`.
    3. **SmoothScrollProvider (`SmoothScrollProvider.tsx`):** Added a `window 'load'` listener calling `ScrollTrigger.refresh()` once as a global catch-all. If `document.readyState === 'complete'` already (HMR), falls back to a single rAF to let pending ST registrations run first.

## 5. Next Steps (Priority Order)
1. **Verify useStaggerReveal fix:** Hard-reload on DE at least 10x at 5b and 5d; confirm all 6 cards visible every time at 375px and 1440px. Scroll mid-section. (commit: "fix: shared reveal hook for section 5 cards")
2. **CSS fix applied (commit: "fix: long German words overflow in service cards"):** All 5a–5d cards now have `hyphens:auto`, `overflow-wrap:anywhere`, `min-w-0`; grids switch to 1-col on mobile (<640px), 2-col sm, 3-col md+. `LocaleContext` now also syncs `html[lang]` on initial load from localStorage (was only syncing on toggle).
3. **Hydration / DOM error fix applied (commit: "fix: removeChild error on legal page navigation (GSAP pinning and textContent overrides)"):** Replaced `useEffect` with `@gsap/react`'s `useGSAP` in `AboutSection.tsx` to ensure the `.pin-spacer` is synchronously reverted before React unmounts the `<section>`. Also switched `StatsStrip.tsx` and `Preloader.tsx` to use `dangerouslySetInnerHTML` so GSAP's `textContent` animations don't orphan React-managed text nodes.
4. **Portal orb preloader — v1 (commit: "feat: custom portal shader preloader"):** Created `PortalShader.tsx` with layered wavy rings. Rejected by design review (tearing artifact, wrong visual).
5. **Portal orb preloader — v2 / FINAL (commit: "feat: portal orb preloader (custom shader, no counter)"):** Rewrote `PortalShader.tsx` with single-pass GLSL: twisted polar coordinates + value noise → sharp angular streak slashes, ragged-edge rim, soft blue halo. `Preloader.tsx` is now text-free (no counter, no bar, no label). GSAP timeline drives `shaderState.current` (plain object) → `useFrame` pushes to GPU each tick; zero React re-renders during the 2.5 s animation. Reduced-motion fallback shows a static CSS gradient ring. Orb diameter: `clamp(180px, 26vmin, 300px)`. *Update*: tweaked color mix in GLSL and config to use a dark violet-cyan cohesive palette, eliminating the jarring bright white core.
6. **Build Section 6:** Proceed to build out Process / Why Us / Portfolio / Contact / Footer sections.

## 6. Working Conventions & Lessons Learned
- Always clean up GSAP ScrollTrigger instances with `gsap.context()` to prevent memory leaks and React strict-mode double-firing issues.
- Always test issues in an incognito window before assuming browser extensions are causing hydration or DOM errors.
- Commit granularly after completing each sub-task to allow for easy rollbacks.
- **Always ask before force-pushing to the remote.**

---

### Previous Checkpoint History

# Section 5 Services — Build Progress

Building in order. One commit per sub-block. Resume from the last line of this file.

5a done — next: 5b AI particle cards
5b done — next: 5c marketing beams
5c done — next: 5d IT glassmorphism spotlight
5d done — Section 5 complete. Next session: Section 6 (Process / Why Us / Portfolio / Contact / Footer).
Reverted to a91c5fd (performance fixes).
The `/impressum` and `/datenschutz` routing hydration bug (`removeChild` error) is fixed.
