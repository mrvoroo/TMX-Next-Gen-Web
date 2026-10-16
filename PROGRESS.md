# TMX Agency Website - Progress & Handoff

## RESUME FROM HERE

## State
- `main` (pushed, `ee97e71` = `origin/main`): `b48ab54` cursor rules · `89438d2` footer copyright · `3c81fc5` noindex (`SITE_INDEXABLE=false`) · `864c20d` StatsStrip hidden · `5a6f44a` next-intl URL routing (de at `/`, en at `/en`, no cookie, no detection) · `47212d4` localized pathnames (`/en/legal-notice`, `/en/privacy-policy`, `/en/contact`) · `1c956b8` `(site)` group with Lenis, legal pages without · `08b2cea` per-locale SEO (canonical, hreflang, `SITE_URL`), `src/lib/seo.ts`. i18n merge: `308d1c6`.
- `feat/keystatic` [merged: yes (`ee97e71`), pushed: yes — that merge is `origin/main`; no `origin/feat/keystatic`]:
  · `9e2fae8` Keystatic local mode + Company singleton (admin only in dev; `/keystatic` + `/api/keystatic` return 404 in production)
  · `6e0c1c4` `docs/legal/` source texts committed (`legal-content.md` v2, `Cookie_Banner_Content_DE_EN.md`)
  · `9ec5291` Impressum verbatim via Keystatic (one locale per route, `{{key}}` placeholders, conditional blocks)
  · `71d4bfd` + `82f554c` Datenschutz verbatim via Keystatic; section 6 rewritten (`tmx-locale` removed, only `tmx-cookie-consent`); fields `showIf`/`highlight` instead of positions; auto numbering
  · `4a335c1` consent banner + `src/lib/consent.ts` + empty registry `src/config/consent-services.ts` + footer reopen
  · `63d622f` mojibake fix in keystatic labels
  · `b36e34f` compact banner on legal pages
  · `2b84970` settings close on navigation, banner never above preloader, preloader once per page load (in-memory flag)

## Next (in order)
1. Clean build, then test live (banner, legal pages per locale, `/keystatic` = 404). Merge into `main` and push are done (`ee97e71`).
2. Kontakt page verbatim from `docs/legal` section D (service chips later).
3. Official 18 services in Keystatic (pillars 5/6/5/2). Owner must provide the exact German text of #18 and whether "(Chat Funnel)" / "(Online-Marketing)" belong to the terms; otherwise #18 = `[[PENDING]]`.
4. Google Analytics 4 + Microsoft Clarity via the consent registry (load ONLY after consent, Clarity ConsentV2, input masking), plus new Datenschutz sections. Owner must provide GA Measurement ID (`G-...`) and Clarity Project ID.
5. New About text (owner must provide), Portfolio as Keystatic collection (title, short description DE/EN, preview image, optional link, visible toggle, order; section + nav hidden while empty; screenshots only, no iframes; client permission required).
6. Pillar pages `/leistungen/<pillar>#<service>`, keyword research first; decision pending on an "Anfrage zu dieser Leistung" button per service.
7. Contact form: grouped multi-select service chips, Web3Forms account + delivery test.
8. How We Work, Why Us sections; Keystatic GitHub mode on live (GitHub App, env vars on host, owner enables GitHub 2FA); lint cleanup (23); Next.js update.
9. Pre-launch: hosting + domain decision, company data, DPA checks, zero third-party requests before consent, sitemap/robots, 404, LCP/CLS, real-device test, lawyer review, then `SITE_INDEXABLE=true`.

## Known issues / notes
- All legal `[[...]]` to-dos and `[[PENDING]]` company data render visibly by design.
- Legal texts in `content/legal/*.json` are legally binding: any edit needs lawyer review.
- Footer social icons render non-clickable while URLs are `[[PENDING]]`; Portfolio nav link points to a missing section.
- `SmoothScrollProvider` re-applies URL hash for 800 ms after ScrollTrigger refresh; re-test when more pinned sections are added.
- Never run `npm run build` while `npm run dev` is running (shared `.next`). If dev shows Internal Server Error: stop dev, delete `.next`, restart.
- Lint: 23 pre-existing problems (plus one scoped eslint-disable in `ConsentBanner`). Build passes.
- Code must stay host-agnostic (hosting not final).
- A freelancer quote for the project exists (MrVoroo, 30.000 € net fixed price) — outside the repo.

## Open owner decisions / data
Text #18 · GA + Clarity IDs · About text · company data · domain · final hosting · "Anfrage" button per service · Portfolio projects + client permissions.

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
| **/kontakt Page** (`src/app/[locale]/(legal)/kontakt/page.tsx`) | **DONE** | Client Component (`'use client'`). Server `kontakt/layout.tsx` exists only for `generateMetadata`. Full Web3Forms form (name, email, subject, message, GDPR checkbox, honeypot, error/success states). Verbatim section D and service chips are still open. |
| **Global Footer** (`src/components/layout/Footer.tsx`) | **DONE** | Rendered in `src/app/[locale]/layout.tsx`, outside the `(site)` Lenis wrapper. Locale-aware links: `/impressum`, `/datenschutz`, `/kontakt` (EN: `/en/legal-notice`, `/en/privacy-policy`, `/en/contact`). Company copyright (`89438d2`); pending social URLs are disabled, not links. "Cookie-Einstellungen" calls `openConsentSettings` (`4a335c1`). |
| **Header Hamburger Legal Links** (`src/components/layout/Header.tsx`) | **DONE** | Dead `href="#contact"` anchors replaced with locale-aware links to `/impressum` and `/datenschutz` (EN: `/en/legal-notice`, `/en/privacy-policy`). |
| **Header Nav Order & Contact Link** (`src/components/layout/Header.tsx`) | **DONE** | Reordered About before Services to match actual page section order; wired Contact to `/kontakt` (both desktop and mobile). |
| **Nav Unification & Mobile Nav Fix** (`src/config/nav.ts`, `Header.tsx`) | **DONE** | Unified desktop and mobile navigation into single shared `navLinks` config; fixed mobile Contact navigation by replacing `MotionLink` with native `Link` inside `motion.div`. Portfolio still points at `/#portfolio`, which has no section. |
| **Files Reverted in Step 2** | **NONE** | Created/modified files were kept. Lint is not clean: 23 pre-existing problems, plus one scoped eslint-disable in `ConsentBanner`. |

---

## 3. `[[PENDING]]` Company Data
Impressum and Datenschutz read `content/settings/company.json` (Keystatic Company singleton). These string fields are `[[PENDING]]` and render visibly: `name`, `legalForm`, `street`, `zip`, `city`, `representative`, `email`, `phone`, `registerCourt`, `registerNumber`, `vatId`, `emailProvider`, `supervisoryAuthority`, `logRetention`, `lastUpdated`, `socialLinkedin`, `socialInstagram`, `socialXing`. Set values: `brand` = `TMX`, `showMstvResponsible` = true, `showConsumerDispute` = false, `hasSocialProfiles` = false.

`src/config/company.ts` is no longer the legal-page source. Footer still reads `SOCIAL_LINKEDIN`, `SOCIAL_INSTAGRAM`, `SOCIAL_XING` from it (non-clickable while `[[PENDING]]`). Kontakt still reads `COMPANY_EMAIL` and `WEB3FORMS_ACCESS_KEY` from it. The other `[[PENDING]]` constants in that file are unused by the legal pages.

---

## 4. What Is NOT Built Yet
- **Home sections still missing:** How We Work, Why Us, Portfolio, on-page contact. Home currently renders Preloader, Hero, About, Services. StatsStrip stays hidden (`864c20d`).
- **Real company values:** `[[PENDING]]` in `content/settings/company.json` and the remaining `src/config/company.ts` constants (section 3).
- **Official 18 services in Keystatic**, pillar pages, GA4/Clarity loaders, Portfolio collection, Kontakt verbatim text, service chips. See Next.

Consent banner, `src/lib/consent.ts`, and the empty registry `src/config/consent-services.ts` exist (`4a335c1`). No analytics scripts load yet.

---

## 5. Recent Git Commits (Last 10)
```text
ee97e71 merge: keystatic CMS, legal pages verbatim, consent banner
2b84970 fix(consent): close settings on navigation, never above preloader; preloader once per page load
b36e34f feat(consent): compact banner on legal pages so they stay readable
63d622f fix: repair mis-encoded characters
4a335c1 feat(consent): consent banner + consent core with empty service registry, footer reopen
82f554c fix(legal): datenschutz section 6 for consent banner, field-based section rules
71d4bfd feat(legal): datenschutz verbatim via keystatic, section 6 reflects no browser storage
9ec5291 feat(legal): impressum verbatim via keystatic, one locale per route
6e0c1c4 docs: add legal source texts (legal-content v2, cookie banner)
9e2fae8 feat(cms): keystatic local mode + company settings singleton
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
