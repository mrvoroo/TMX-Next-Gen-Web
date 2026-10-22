# TMX Agency Website - Progress & Handoff

## RESUME FROM HERE

## New on main
- `e2f4aef` desktop 3D corridor (one page-level WebGL context; curved project screens with accent glow + light-wave transition; light frames, dust, reflective floor; HTML overlay synced; shards reassemble above CTA; 60 fps at DPR 1 and 1.75). `39a5117` keyboard focus: every project card is focusable (role="group"), link is the next Tab stop, focus scrolls the corridor. Desktop without WebGL2 still uses the horizontal track.

## Next
- Step 4 portfolio mobile/tablet (prompt ready, Sonnet 5.5): CSS 3D scroll cards, focused card straight, tablet hero layout at 768px, dev-only `?gl=0` and `?motion=reduce` hooks; real-device test.
- Then: About text, How We Work, Why Us (owner must provide real strengths: focus areas, languages, team size, differentiators), keyword research → pillar pages, Web3Forms + GA4 + Clarity, Keystatic GitHub mode, lint/hydration cleanup, sitemap/robots/404, performance (home runs 3–4 separate WebGL contexts — review), launch checklist.

## Notes
- Project titles/descriptions still placeholders (1st/2nd/3rd), project 1 description empty; no-WebGL path not tested in a real browser yet.

## Open owner data
- #18 text, About/strengths info, company data, GA/Clarity IDs, Web3Forms account, domain, hosting.

---

## 1. Project Overview & Rules
- **Stack:** Next.js 16.3.5 App Router (Turbopack), React 19, TypeScript, Tailwind v4, Framer Motion, GSAP 3 + ScrollTrigger, Lenis, @react-three/fiber.
- **Core Conventions:**
  - DE is primary/default language, EN secondary via `useTranslation` + `translations.ts`. URL locale is next-intl (`de` at `/`, `en` at `/en`).
  - GSAP cleanup strictly via `gsap.context()` or `@gsap/react` `useGSAP`.
  - **No `git push` without explicit user confirmation.**
  - **Always verify commit diffs before trusting commit messages.**

---

## 2. Verified Status of Step B Deliverables
| Deliverable | Status | Details |
|---|---|---|
| **Legal Route Group Layout** (`src/app/[locale]/(legal)/layout.tsx`) | **DONE** | No GSAP and no Lenis. Lenis lives only in `src/app/[locale]/(site)/layout.tsx` (home). `[locale]/layout.tsx` renders one Header and one Footer. Legal pages are static and open scrolled to the top (`1c956b8`). |
| **/impressum Page** (`src/app/[locale]/(legal)/impressum/page.tsx`) | **DONE** | Server Component. Verbatim from Keystatic `content/legal/impressum.json`, one locale per route (`9ec5291`). Company values from `content/settings/company.json`. `{{key}}` placeholders; `[[PENDING]]` renders as-is. |
| **/datenschutz Page** (`src/app/[locale]/(legal)/datenschutz/page.tsx`) | **DONE** | Server Component. Verbatim from Keystatic `content/legal/datenschutz.json` (`71d4bfd`, `82f554c`). Section 6 matches the consent banner (`tmx-cookie-consent` only). `showIf` / `highlight` fields, auto numbering. |
| **/kontakt Page** (`src/app/[locale]/(legal)/kontakt/page.tsx`) | **DONE** | Server Component. Verbatim section D from Keystatic `contactPage` (`4c9c6e3`). `kontakt/layout.tsx` exists only for `generateMetadata`. Form is client `ContactForm` (name, email, single service select with only "Allgemeine Anfrage", message, GDPR checkbox, honeypot, localized validation). Web3Forms key is `NEXT_PUBLIC_WEB3FORMS_KEY` (missing → no request, error shown). Grouped service chips are still open. |
| **Global Footer** (`src/components/layout/Footer.tsx`) | **DONE** | Rendered in `src/app/[locale]/layout.tsx`, outside the `(site)` Lenis wrapper. Locale-aware links: `/impressum`, `/datenschutz`, `/kontakt` (EN: `/en/legal-notice`, `/en/privacy-policy`, `/en/contact`). Company copyright (`89438d2`); pending social URLs are disabled, not links. "Cookie-Einstellungen" calls `openConsentSettings` (`4a335c1`). |
| **Header Hamburger Legal Links** (`src/components/layout/Header.tsx`) | **DONE** | Dead `href="#contact"` anchors replaced with locale-aware links to `/impressum` and `/datenschutz` (EN: `/en/legal-notice`, `/en/privacy-policy`). |
| **Header Nav Order & Contact Link** (`src/components/layout/Header.tsx`) | **DONE** | Reordered About before Services to match actual page section order; wired Contact to `/kontakt` (both desktop and mobile). |
| **Nav Unification & Mobile Nav Fix** (`src/config/nav.ts`, `Header.tsx`) | **DONE** | Unified desktop and mobile navigation into single shared `navLinks` config; fixed mobile Contact navigation by replacing `MotionLink` with native `Link` inside `motion.div`. Portfolio still points at `/#portfolio`, which has no section. |
| **Files Reverted in Step 2** | **NONE** | Created/modified files were kept. Lint is not clean: 23 pre-existing problems, plus one scoped eslint-disable in `ConsentBanner`. |

---

## 3. `[[PENDING]]` Company Data
Impressum and Datenschutz read `content/settings/company.json` (Keystatic Company singleton). These string fields are `[[PENDING]]` and render visibly: `name`, `legalForm`, `street`, `zip`, `city`, `representative`, `email`, `phone`, `registerCourt`, `registerNumber`, `vatId`, `emailProvider`, `supervisoryAuthority`, `logRetention`, `lastUpdated`, `socialLinkedin`, `socialInstagram`, `socialXing`. Set values: `brand` = `TMX`, `showMstvResponsible` = true, `showConsumerDispute` = false, `hasSocialProfiles` = false.

`src/config/company.ts` is no longer the legal-page source. Footer still reads `SOCIAL_LINKEDIN`, `SOCIAL_INSTAGRAM`, `SOCIAL_XING` from it (non-clickable while `[[PENDING]]`). Kontakt reads the company e-mail from `content/settings/company.json`. `WEB3FORMS_ACCESS_KEY` was removed (`4c9c6e3`); the form uses `NEXT_PUBLIC_WEB3FORMS_KEY`. `COMPANY_EMAIL` in `company.ts` is unused. The other `[[PENDING]]` constants in that file are unused by the legal pages.

---

## 4. What Is NOT Built Yet
- **Home sections still missing:** How We Work, Why Us, Portfolio, on-page contact. Home currently renders Preloader, Hero, About, Services. StatsStrip stays hidden (`864c20d`).
- **Real company values:** `[[PENDING]]` in `content/settings/company.json` and the remaining `src/config/company.ts` constants (section 3).
- **Still open:** pillar pages, GA4/Clarity loaders, Portfolio collection, grouped service chips. Official 18 services (`40d0b02`) and Kontakt verbatim text (`4c9c6e3`) are done. See Next.

Consent banner, `src/lib/consent.ts`, and the empty registry `src/config/consent-services.ts` exist (`4a335c1`). No analytics scripts load yet.

---

## 5. Recent Git Commits (Last 10)
```text
18b040c merge: kontakt page via keystatic
8ef7a66 refactor(cms): contact page english-first localized fields
85636b5 merge: feat/kontakt
cb606ea merge: 18 official services, english-first CMS
9fe1a77 refactor(cms): english-first admin, EN+DE side by side per field
40d0b02 feat(services): 18 official services via keystatic, generic names removed
4c9c6e3 feat(contact): kontakt page verbatim via keystatic, localized validation, env-based web3forms key
969c2fd docs: update PROGRESS.md (keystatic, legal pages, consent banner)
ee97e71 merge: keystatic CMS, legal pages verbatim, consent banner
2b84970 fix(consent): close settings on navigation, never above preloader; preloader once per page load
```

---

## 6. Verification & Build Output
The route list below is from a `next build` before locale routing and before Keystatic. It is not the current route table.

Current URLs: `/` (de) and `/en` (en); legal pathnames `/impressum`, `/datenschutz`, `/kontakt` and EN `/en/legal-notice`, `/en/privacy-policy`, `/en/contact`. Home is `src/app/[locale]/(site)/`; legal pages are `src/app/[locale]/(legal)/`. `/keystatic` and `/api/keystatic` exist in dev and return 404 in production (`9e2fae8`). Per-locale canonical and hreflang come from `src/lib/seo.ts` (`08b2cea`). Impressum and Datenschutz set their own meta description from Keystatic; they do not reuse the home description.
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
- **Legal copy is Keystatic JSON:** Impressum, Datenschutz, and the consent banner live in `content/legal/*.json`. Company values for those pages live in `content/settings/company.json`. Do not rephrase them. `[[PENDING]]` and `[[...]]` render visibly until the owner replaces them.
