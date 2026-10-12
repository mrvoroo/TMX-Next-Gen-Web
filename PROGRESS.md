# TMX Agency Website - Progress & Handoff

## RESUME FROM HERE
**main** (`864c20d`):
- `b48ab54` cursor rules
- `89438d2` footer copyright
- `3c81fc5` noindex (`SITE_INDEXABLE=false`)
- `864c20d` StatsStrip hidden (fake numbers)

**feat/i18n-routing** (not pushed, not merged):
- `5a6f44a` next-intl URL routing (de at `/`, en at `/en`, no cookie, no detection, localStorage removed)

**Next:**
1. Step 2: locale-aware links + localized pathnames + toggle on legal pages
2. Step 3: legal pages open scrolled to bottom (Lenis)
3. Step 4: per-locale metadata, hreflang, fix metadataBase (`https://tmx.de` is a placeholder)

**Known:**
- Legal page texts are agent-written drafts; they will be replaced verbatim from `docs/legal`.
- Lint has 23 pre-existing problems (not 0).

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
| **Legal Route Group Layout** (`src/app/[locale]/(legal)/layout.tsx`) | **DONE** | The legal layout file itself has no GSAP. Parent `src/app/[locale]/layout.tsx` still wraps these pages in SmoothScrollProvider, so they currently run inside Lenis (step 3). |
| **/impressum Page** (`src/app/[locale]/(legal)/impressum/page.tsx`) | **DRAFT** | Server Component. Agent-written DE/EN draft, not the final statutory text. Will be replaced verbatim from `docs/legal`. Company data from `src/config/company.ts`. |
| **/datenschutz Page** (`src/app/[locale]/(legal)/datenschutz/page.tsx`) | **DRAFT** | Server Component. Agent-written DE/EN draft, not the final GDPR text. Will be replaced verbatim from `docs/legal`. Company data from `src/config/company.ts`. |
| **/kontakt Page** (`src/app/[locale]/(legal)/kontakt/page.tsx`) | **DONE** | Client Component. Full Web3Forms form (name, email, subject, message, GDPR checkbox, honeypot, error/success states). |
| **Global Footer** (`src/components/layout/Footer.tsx`) | **DONE** | Rendered in `src/app/[locale]/layout.tsx` outside Lenis. Links to `/impressum`, `/datenschutz`, `/kontakt`. Company copyright (`89438d2`); pending social URLs are disabled, not links. Stubbed "Cookie-Einstellungen" button with `TODO`. |
| **Header Hamburger Legal Links** (`src/components/layout/Header.tsx`) | **DONE** | Replaced dead `href="#contact"` anchor tags with real Next.js `<Link>` to `/impressum` and `/datenschutz`. |
| **Header Nav Order & Contact Link** (`src/components/layout/Header.tsx`) | **DONE** | Reordered About before Services to match actual page section order; wired Contact to `/kontakt` (both desktop and mobile). |
| **Nav Unification & Mobile Nav Fix** (`src/config/nav.ts`, `Header.tsx`) | **DONE** | Unified desktop and mobile navigation into single shared `navLinks` config; fixed mobile Contact navigation by replacing `MotionLink` with native `Link` inside `motion.div`. |
| **Files Reverted in Step 2** | **NONE** | Created/modified files were kept. Lint is not clean: 23 pre-existing problems. |

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
5a6f44a feat(i18n): next-intl URL routing (de at /, en at /en), remove localStorage locale
864c20d chore(home): hide StatsStrip until real stats exist
3c81fc5 chore(seo): noindex until launch via SITE_INDEXABLE flag
89438d2 chore(footer): replace dev credit with company copyright, disable pending social links
b48ab54 chore: add cursor project rules
fdf1d6d fix: sync mobile nav menu with desktop (order + dead Contact link), unify into single navLinks source
16a4d8b fix: nav order (About before Services) + contact link to /kontakt page
8ce156d docs: rewrite PROGRESS.md with verified status and legal routes
7f752ab feat: global footer component and header legal links
823e9c2 feat: kontakt page with web3forms integration
```

---

## 6. Verification & Build Output
The route list below is from a `next build` before locale routing. Current routes are `/` (de) and `/en` (en); legal pages live under `src/app/[locale]/(legal)/`.
```text
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /datenschutz
├ ○ /impressum
└ ○ /kontakt

○ (Static) prerendered as static content
TypeScript: Finished in 6.7s with 0 errors
ESLint: 23 pre-existing problems (not 0 errors / 0 warnings)
```

---

## 7. Lessons Learned & Working Conventions
- **Verify commit scope against actual diffs:** A commit message's stated scope was wrong in a prior session (`598d30c` claimed to fix "legal page navigation" when no legal pages existed; it actually addressed GSAP pin cleanup in `AboutSection` and text node ownership in `StatsStrip`). Always verify `git show <commit> --stat` before trusting commit descriptions.
- **Isolate non-interactive legal routes:** The `(legal)` layout itself has no Lenis or GSAP. After `5a6f44a`, `src/app/[locale]/layout.tsx` still wraps those pages in SmoothScrollProvider, so the isolation does not currently hold (legal pages open scrolled to the bottom).
- **Centralize pending legal data:** Always put configurable legal placeholders into a single config file (`src/config/company.ts`) with clear `[[PENDING]]` flags instead of scattering them in page JSX.
