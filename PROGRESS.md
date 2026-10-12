# TMX Agency Website - Progress & Handoff

## RESUME FROM HERE

## State (main, pushed to origin)
- `b48ab54` cursor rules · `89438d2` footer copyright (MrVoroo credit removed by owner decision) · `3c81fc5` noindex via `SITE_INDEXABLE=false` · `864c20d` StatsStrip hidden (fake numbers, component kept)
- Merged `feat/i18n-routing`: `5a6f44a` next-intl URL routing (de at `/`, en at `/en`, `localeDetection` false, `localeCookie` false, localStorage removed) · `47212d4` locale-aware links + localized pathnames (`/en/legal-notice`, `/en/privacy-policy`, `/en/contact`) + toggle on legal pages · `1c956b8` `(site)` group with Lenis, legal pages single header, static, scroll to top · `08b2cea` per-locale metadata, canonical, hreflang, `SITE_URL` (env `NEXT_PUBLIC_SITE_URL`, fallback `tmx1.netlify.app`), `alternateLinks` false, helper `src/lib/seo.ts`

## Next
1. Test proxy on live Netlify: `/`, `/en`, `/en/legal-notice`, toggle, refresh keeps locale, no cookies, no browser-language redirect.
2. Legal texts verbatim from `docs/legal` (one locale per route, no DE+EN on the same page). Waiting for owner decision on Keystatic (content file format).
3. Then: official service names, remove fake claims (Portfolio nav link points to a missing section), cookie banner, contact form with grouped service chips, pillar pages `/leistungen/<pillar>#<service>`, Keystatic admin.

## Known issues / notes
- Legal page texts are agent-written drafts showing DE and EN on one page; to be replaced verbatim.
- Legal pages inherit the home meta description (temporary). `meta` keywords still German, to be removed in the SEO content step.
- `kontakt` has a server `layout.tsx` only for `generateMetadata` (page is `'use client'`).
- `SmoothScrollProvider` re-applies the URL hash on ScrollTrigger refresh.

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
| **Legal Route Group Layout** (`src/app/[locale]/(legal)/layout.tsx`) | **DONE** | No GSAP and no Lenis. Lenis lives only in `src/app/[locale]/(site)/layout.tsx` (home). `[locale]/layout.tsx` renders one Header and one Footer. Legal pages are static and open scrolled to the top (`1c956b8`). |
| **/impressum Page** (`src/app/[locale]/(legal)/impressum/page.tsx`) | **DRAFT** | Server Component. Agent-written DE/EN draft, not the final statutory text. Will be replaced verbatim from `docs/legal`. Company data from `src/config/company.ts`. |
| **/datenschutz Page** (`src/app/[locale]/(legal)/datenschutz/page.tsx`) | **DRAFT** | Server Component. Agent-written DE/EN draft, not the final GDPR text. Will be replaced verbatim from `docs/legal`. Company data from `src/config/company.ts`. |
| **/kontakt Page** (`src/app/[locale]/(legal)/kontakt/page.tsx`) | **DONE** | Client Component (`'use client'`). Server `kontakt/layout.tsx` exists only for `generateMetadata`. Full Web3Forms form (name, email, subject, message, GDPR checkbox, honeypot, error/success states). |
| **Global Footer** (`src/components/layout/Footer.tsx`) | **DONE** | Rendered in `src/app/[locale]/layout.tsx`, outside the `(site)` Lenis wrapper. Locale-aware links: `/impressum`, `/datenschutz`, `/kontakt` (EN: `/en/legal-notice`, `/en/privacy-policy`, `/en/contact`). Company copyright (`89438d2`); pending social URLs are disabled, not links. Stubbed "Cookie-Einstellungen" button with `TODO`. |
| **Header Hamburger Legal Links** (`src/components/layout/Header.tsx`) | **DONE** | Dead `href="#contact"` anchors replaced with locale-aware links to `/impressum` and `/datenschutz` (EN: `/en/legal-notice`, `/en/privacy-policy`). |
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
308d1c6 merge: next-intl URL routing, localized paths, legal layout cleanup, per-locale SEO
08b2cea feat(seo): per-locale metadata, canonical, hreflang, SITE_URL
1c956b8 refactor(layout): (site) group with Lenis, legal pages single header, static, scroll to top
47212d4 feat(i18n): locale-aware links, localized pathnames, toggle on legal pages
01c1270 docs: update PROGRESS.md
5a6f44a feat(i18n): next-intl URL routing (de at /, en at /en), remove localStorage locale
864c20d chore(home): hide StatsStrip until real stats exist
3c81fc5 chore(seo): noindex until launch via SITE_INDEXABLE flag
89438d2 chore(footer): replace dev credit with company copyright, disable pending social links
b48ab54 chore: add cursor project rules
```

---

## 6. Verification & Build Output
The route list below is from a `next build` before locale routing. Current URLs: `/` (de) and `/en` (en); legal pathnames `/impressum`, `/datenschutz`, `/kontakt` and EN `/en/legal-notice`, `/en/privacy-policy`, `/en/contact`. Home is `src/app/[locale]/(site)/`; legal pages are `src/app/[locale]/(legal)/`.
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
- **Isolate non-interactive legal routes:** After `1c956b8`, Lenis and GSAP live only in the `(site)` group. The `(legal)` layout has no SmoothScrollProvider. `[locale]/layout.tsx` does not wrap legal pages in Lenis. Legal pages use that layout's single header, stay static, and open scrolled to the top.
- **Centralize pending legal data:** Always put configurable legal placeholders into a single config file (`src/config/company.ts`) with clear `[[PENDING]]` flags instead of scattering them in page JSX.
