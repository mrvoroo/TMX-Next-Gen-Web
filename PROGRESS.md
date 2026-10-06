# TMX Agency Website - Progress & Handoff

## RESUME FROM HERE
**Next single action for next session:**
Build the **CookieConsent** banner component (`src/components/ui/CookieConsent.tsx`), wire its localStorage key (`"tmx-cookie-consent"`), mount it in the root layout, and wire the stubbed `"Cookie-Einstellungen"` button in `src/components/layout/Footer.tsx` (line 98) to trigger the banner opening.
After that: Proceed to Section 6 build-out (Process, Why Us, Portfolio, Contact section on home).

---

## 1. Project Overview & Rules
- **Stack:** Next.js 16.3.5 App Router (Turbopack), React 19, TypeScript, Tailwind v4, Framer Motion, GSAP 3 + ScrollTrigger, Lenis, @react-three/fiber.
- **Core Conventions:**
  - DE is primary/default language, EN secondary via `useTranslation` + `translations.ts`.
  - GSAP cleanup strictly via `gsap.context()` or `@gsap/react` `useGSAP`.
  - **No `git push` without explicit user confirmation.**
  - **Always verify commit diffs before trusting commit messages.**

---

## 2. Verified Status of Step B Deliverables
| Deliverable | Status | Details |
|---|---|---|
| **Legal Route Group Layout** (`src/app/(legal)/layout.tsx`) | **DONE** | Minimal layout without SmoothScrollProvider/GSAP/Lenis. Lightweight, fast. |
| **/impressum Page** (`src/app/(legal)/impressum/page.tsx`) | **DONE** | Server Component. Complete DE and EN statutory legal notice. Imports all data from `src/config/company.ts`. |
| **/datenschutz Page** (`src/app/(legal)/datenschutz/page.tsx`) | **DONE** | Server Component. Complete DE and EN GDPR privacy policy. Imports data from `src/config/company.ts`. |
| **/kontakt Page** (`src/app/(legal)/kontakt/page.tsx`) | **DONE** | Client Component. Full Web3Forms form (name, email, subject, message, GDPR checkbox, honeypot, error/success states). |
| **Global Footer** (`src/components/layout/Footer.tsx`) | **DONE** | Rendered in root `layout.tsx` outside Lenis. Links to `/impressum`, `/datenschutz`, `/kontakt`, MrVoroo credit, social icons. Includes stubbed "Cookie-Einstellungen" button with `TODO` comment. |
| **Header Hamburger Legal Links** (`src/components/layout/Header.tsx`) | **DONE** | Replaced dead `href="#contact"` anchor tags with real Next.js `<Link>` to `/impressum` and `/datenschutz`. |
| **Header Nav Order & Contact Link** (`src/components/layout/Header.tsx`) | **DONE** | Reordered About before Services to match actual page section order; wired Contact to `/kontakt` (both desktop and mobile). |
| **Nav Unification & Mobile Nav Fix** (`src/config/nav.ts`, `Header.tsx`) | **DONE** | Unified desktop and mobile navigation into single shared `navLinks` config; fixed mobile Contact navigation by replacing `MotionLink` with native `Link` inside `motion.div`. |
| **Files Reverted in Step 2** | **NONE** | All created/modified files were complete, compile cleanly, and pass lint with 0 errors. |

---

## 3. List of `[[PENDING]]` Placeholders in `src/config/company.ts`
All company details are centralized in `src/config/company.ts`. The following 17 keys currently hold `"[[PENDING]]"`:
1. `COMPANY_NAME`
2. `COMPANY_FORM`
3. `COMPANY_FULL_NAME`
4. `COMPANY_STREET`
5. `COMPANY_CITY`
6. `COMPANY_EMAIL`
7. `COMPANY_PHONE`
8. `COMPANY_WEBSITE`
9. `COMPANY_REGISTER_ENTRY`
10. `COMPANY_REGISTER_COURT`
11. `COMPANY_MANAGING_DIRECTOR`
12. `COMPANY_VAT_ID`
13. `COMPANY_DPO_EMAIL` (relevant only if `COMPANY_DPO_NAME` is configured)
14. `SOCIAL_LINKEDIN`
15. `SOCIAL_INSTAGRAM`
16. `SOCIAL_XING`
17. `WEB3FORMS_ACCESS_KEY`

---

## 4. What Is NOT Built Yet
- **CookieConsent component:** Neither `CookieConsent.tsx` nor the `"tmx-cookie-consent"` localStorage logic exists yet.
- **Section 6 on Home:** Process, Why Us, Portfolio, Contact sections on `page.tsx`.
- **Real company values:** The 17 `[[PENDING]]` placeholders in `src/config/company.ts`.
- **Official service terminology & claim stats validation:** Pending final review.

---

## 5. Recent Git Commits (Last 10)
```text
7f752ab feat: global footer component and header legal links
823e9c2 feat: kontakt page with web3forms integration
8150c25 feat: impressum and datenschutz legal pages
4d56d77 feat: company config and legal route group layout
72c4b61 style: portal preloader dark violet-cyan palette
fbb1b83 feat: portal orb preloader (custom shader, no counter)
c98b138 feat: custom portal shader preloader
a7faa20 docs: update PROGRESS.md with removeChild error fix details
598d30c fix: removeChild error on legal page navigation (GSAP pinning and textContent overrides)
d25401f fix: long German words overflow in service cards
```

---

## 6. Verification & Build Output
Production build verified with `next build` (exit code 0):
```text
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /datenschutz
├ ○ /impressum
└ ○ /kontakt

○ (Static) prerendered as static content
TypeScript: Finished in 6.7s with 0 errors
ESLint: Passed with 0 errors, 0 warnings
```

---

## 7. Lessons Learned & Working Conventions
- **Verify commit scope against actual diffs:** A commit message's stated scope was wrong in a prior session (`598d30c` claimed to fix "legal page navigation" when no legal pages existed; it actually addressed GSAP pin cleanup in `AboutSection` and text node ownership in `StatsStrip`). Always verify `git show <commit> --stat` before trusting commit descriptions.
- **Isolate non-interactive legal routes:** Keep legal routes in a dedicated `(legal)` route group layout without SmoothScrollProvider, Lenis, or GSAP ScrollTrigger to avoid hydration and DOM reparenting issues.
- **Centralize pending legal data:** Always put configurable legal placeholders into a single config file (`src/config/company.ts`) with clear `[[PENDING]]` flags instead of scattering them in page JSX.
