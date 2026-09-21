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
- **Last Commit Hash:** `a91c5fdfd288a82609b36cf17fab488792c32ffa` (fix: LCP opacity and CLS font/layout shifts)
- **Remote Status:** Local branch is up to date with `origin/main` (GitHub remote was successfully updated/force-pushed to match the reset).

## 4. Known Unresolved Bugs
- **/impressum and /datenschutz hydration error:** 
  - **Details:** Causes a "removeChild... not a child of this node" error. 
  - **Status:** Confirmed NOT to be caused by browser extensions. The root cause is not yet fixed. A previous fix attempt broke other sections and was therefore reverted. It must be tackled fresh, one small change at a time, testing after each step.
- **Sections 5b (AI) and 5d (IT) rendering issue:**
  - **Details:** Cards fail to render or appear very faint on a direct German-locale page load.
  - **Reproduction:** Confirmed reproducible on repeated hard refreshes. Fixed only by toggling the language to EN and back.
  - **Root Cause Hypothesis:** ScrollTrigger timing race condition with heavy canvas/visual elements.
  - **Status:** No fix has been completed or attempted yet since the reversion.

## 5. Next Steps (Priority Order)
1. **Fix 5b and 5d rendering issues:** Address the ScrollTrigger timing race condition causing cards to be faint on direct load.
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
