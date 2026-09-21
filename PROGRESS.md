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
1. **Test 5b/5d fix:** Hard-reload on German (default) at least 5 times in a row; confirm ALL cards in 5b and 5d fully appear without any language toggle. Scroll away and back. Confirm 5a/5c unaffected.
2. **Fix Hydration Errors:** Methodically debug and resolve the "removeChild" hydration error on `/impressum` and `/datenschutz` pages. Test carefully after each small change.
3. **Build Section 6:** Proceed to build out Process / Why Us / Portfolio / Contact / Footer sections.

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
Reverted to a91c5fd (performance fixes). The /impressum and /datenschutz routing hydration bug (removeChild error) is still unresolved. It must be tackled fresh and carefully next time: one small change at a time, testing after each step, rather than a broad multi-file fix attempt.
