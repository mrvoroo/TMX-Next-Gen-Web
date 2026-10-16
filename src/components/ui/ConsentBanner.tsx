'use client';

/**
 * Consent banner (GDPR / § 25 TDDDG).
 *
 * - Texts come from Keystatic (content/legal/consent-banner.json) via props.
 * - Client only: nothing is rendered on the server or during hydration.
 * - First layer: Reject All · Settings · Accept All, identical styling.
 * - Settings layer: Necessary (locked), Analytics, Marketing (both OFF by default).
 * - Compact mode: on the privacy / legal-notice pages the first layer is a slim bottom bar
 *   (headline + buttons only, no focus steal, page gets bottom padding so nothing is hidden).
 * - Non-blocking: no cookie wall, no close button, Escape does not dismiss.
 * - Reopened from the footer via the "tmx:open-consent-settings" window event.
 * - On the home page it waits for the preloader ("tmx:preloader-done", max 3 s).
 */

import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, usePathname } from '@/i18n/navigation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import {
  getConsent,
  OPEN_SETTINGS_EVENT,
  setConsent,
  useConsent,
} from '@/lib/consent';

export interface ConsentBannerContent {
  headline: string;
  body: string;
  rejectAll: string;
  settings: string;
  acceptAll: string;
  settingsHeading: string;
  necessaryTitle: string;
  necessaryBadge: string;
  necessaryText: string;
  analyticsTitle: string;
  analyticsText: string;
  marketingTitle: string;
  marketingText: string;
  saveSelection: string;
  privacyLinkText: string;
  impressumLinkText: string;
}

const PRELOADER_START_EVENT = 'tmx:preloader-start';
const PRELOADER_DONE_EVENT = 'tmx:preloader-done';
const PRELOADER_FALLBACK_MS = 3000;

/** One class string for every banner button → identical size, color, weight. */
const BUTTON_CLASS =
  'inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-center text-sm font-semibold text-foreground transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-to sm:flex-1';

const LINK_CLASS =
  'underline underline-offset-2 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-to';

/** Internal (locale-independent) pathnames of the privacy and legal-notice pages. */
const LEGAL_PATHNAMES = new Set(['/datenschutz', '/impressum']);

const noopSubscribe = () => () => {};

function Toggle({
  id,
  checked,
  disabled = false,
  describedBy,
  onChange,
}: {
  id: string;
  checked: boolean;
  disabled?: boolean;
  describedBy: string;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <input
      id={id}
      type="checkbox"
      role="switch"
      checked={checked}
      disabled={disabled}
      aria-describedby={describedBy}
      onChange={(event) => onChange?.(event.target.checked)}
      className="relative h-6 w-11 shrink-0 cursor-pointer appearance-none rounded-full bg-white/15 transition-colors before:absolute before:left-0.5 before:top-0.5 before:h-5 before:w-5 before:rounded-full before:bg-white before:transition-transform before:content-[''] checked:bg-accent-from checked:before:translate-x-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-to disabled:cursor-not-allowed disabled:opacity-60"
    />
  );
}

function CategoryRow({
  baseId,
  title,
  badge,
  text,
  checked,
  disabled,
  onChange,
}: {
  baseId: string;
  title: string;
  badge?: string;
  text: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  const toggleId = `${baseId}-toggle`;
  const textId = `${baseId}-text`;
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor={toggleId} className="font-semibold text-foreground">
            {title}
          </label>
          {badge ? (
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-foreground-muted">
              {badge}
            </span>
          ) : null}
        </div>
        <p id={textId} className="mt-1 text-sm leading-relaxed text-foreground-muted">
          {text}
        </p>
      </div>
      <Toggle
        id={toggleId}
        checked={checked}
        disabled={disabled}
        describedBy={textId}
        onChange={onChange}
      />
    </div>
  );
}

export function ConsentBanner({ content }: { content: ConsentBannerContent }) {
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const consent = useConsent();
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const baseId = useId();
  const titleId = `${baseId}-title`;
  const descId = `${baseId}-desc`;

  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  const [layer, setLayer] = useState<'first' | 'settings'>('first');
  const [reopened, setReopened] = useState(false);
  const [draft, setDraft] = useState({ analytics: false, marketing: false });
  const [preloaderDone, setPreloaderDone] = useState(false);

  /* Every route change closes the settings layer (it stays open only on the page where it was opened). */
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setLayer('first');
    setReopened(false);
  }

  /*
   * The banner never renders above the preloader: hidden on "tmx:preloader-start",
   * shown again on "tmx:preloader-done" (or after 3 s at the latest).
   * Initial state is "not done" so the very first paint on home is covered too.
   */
  const isHome = pathname === '/';
  useEffect(() => {
    let timer: number | undefined;
    const done = () => {
      window.clearTimeout(timer);
      setPreloaderDone(true);
    };
    const start = () => {
      window.clearTimeout(timer);
      setPreloaderDone(false);
      timer = window.setTimeout(done, PRELOADER_FALLBACK_MS);
    };
    window.addEventListener(PRELOADER_START_EVENT, start);
    window.addEventListener(PRELOADER_DONE_EVENT, done);
    timer = window.setTimeout(done, PRELOADER_FALLBACK_MS);
    return () => {
      window.removeEventListener(PRELOADER_START_EVENT, start);
      window.removeEventListener(PRELOADER_DONE_EVENT, done);
      window.clearTimeout(timer);
    };
  }, []);
  /* Client navigation onto home while the preloader overlay mounts: hide before paint. */
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- must sync with the DOM overlay before paint
    if (document.querySelector('[data-tmx-preloader]')) setPreloaderDone(false);
  }, [pathname]);
  const ready = !isHome || preloaderDone;

  /* Footer "Cookie-Einstellungen" → settings layer with the CURRENT choice. */
  useEffect(() => {
    const onOpen = () => {
      const active = document.activeElement;
      openerRef.current = active instanceof HTMLElement ? active : null;
      const current = getConsent();
      setDraft({
        analytics: current?.analytics ?? false,
        marketing: current?.marketing ?? false,
      });
      setLayer('settings');
      setReopened(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, onOpen);
  }, []);

  const visible = hydrated && ready && (consent === null || reopened);
  const compact = visible && layer === 'first' && LEGAL_PATHNAMES.has(pathname);

  /* Move focus to the banner when it opens / switches layer (not in compact: user is reading). */
  useEffect(() => {
    if (visible && !compact) dialogRef.current?.focus({ preventScroll: true });
  }, [visible, compact, layer]);

  /* Compact bar: reserve its height at the bottom of the page so the last lines stay readable. */
  useEffect(() => {
    const node = dialogRef.current;
    if (!compact || !node) return;
    const body = document.body;
    const previous = body.style.paddingBottom;
    const apply = () => {
      body.style.paddingBottom = `${Math.ceil(node.getBoundingClientRect().height)}px`;
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(node);
    return () => {
      observer.disconnect();
      body.style.paddingBottom = previous;
    };
  }, [compact]);

  if (!hydrated) return null;

  function choose(analytics: boolean, marketing: boolean) {
    setConsent({ analytics, marketing });
    setReopened(false);
    setLayer('first');
    const opener = openerRef.current;
    openerRef.current = null;
    opener?.focus();
  }

  function openSettings() {
    setDraft({
      analytics: consent?.analytics ?? false,
      marketing: consent?.marketing ?? false,
    });
    setLayer('settings');
  }

  const parts = content.body.split('{{privacyLink}}');

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="consent-banner"
          ref={dialogRef}
          role="dialog"
          aria-labelledby={titleId}
          aria-describedby={compact ? undefined : descId}
          tabIndex={-1}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={
            compact
              ? 'fixed inset-x-0 bottom-0 z-[10000] max-h-[calc(100dvh-1.5rem)] overflow-y-auto border-t border-white/10 bg-surface-1/85 p-3 shadow-2xl shadow-black/50 backdrop-blur-xl outline-none sm:max-h-24 sm:px-6'
              : 'fixed inset-x-3 bottom-3 z-[10000] mx-auto max-h-[calc(100dvh-1.5rem)] max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-surface-1/70 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl outline-none sm:bottom-5 sm:p-6'
          }
        >
          {compact ? (
            <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <h2 id={titleId} className="text-lg font-bold text-foreground">
                {content.headline}
              </h2>
              <div className="flex flex-col gap-3 sm:w-[30rem] sm:shrink-0 sm:flex-row">
                <button
                  type="button"
                  className={BUTTON_CLASS}
                  onClick={() => choose(false, false)}
                >
                  {content.rejectAll}
                </button>
                <button type="button" className={BUTTON_CLASS} onClick={openSettings}>
                  {content.settings}
                </button>
                <button
                  type="button"
                  className={BUTTON_CLASS}
                  onClick={() => choose(true, true)}
                >
                  {content.acceptAll}
                </button>
              </div>
            </div>
          ) : layer === 'first' ? (
            <>
              <h2 id={titleId} className="text-lg font-bold text-foreground">
                {content.headline}
              </h2>
              <p
                id={descId}
                className="mt-2 text-sm leading-relaxed text-foreground-muted"
              >
                {parts.map((part, index) => (
                  <Fragment key={index}>
                    {part}
                    {index < parts.length - 1 ? (
                      <Link href="/datenschutz" className={LINK_CLASS}>
                        {content.privacyLinkText}
                      </Link>
                    ) : null}
                  </Fragment>
                ))}
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className={BUTTON_CLASS}
                  onClick={() => choose(false, false)}
                >
                  {content.rejectAll}
                </button>
                <button type="button" className={BUTTON_CLASS} onClick={openSettings}>
                  {content.settings}
                </button>
                <button
                  type="button"
                  className={BUTTON_CLASS}
                  onClick={() => choose(true, true)}
                >
                  {content.acceptAll}
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 id={titleId} className="text-lg font-bold text-foreground">
                {content.settingsHeading}
              </h2>
              <div id={descId} className="mt-4 space-y-3">
                <CategoryRow
                  baseId={`${baseId}-necessary`}
                  title={content.necessaryTitle}
                  badge={content.necessaryBadge}
                  text={content.necessaryText}
                  checked
                  disabled
                />
                <CategoryRow
                  baseId={`${baseId}-analytics`}
                  title={content.analyticsTitle}
                  text={content.analyticsText}
                  checked={draft.analytics}
                  onChange={(analytics) =>
                    setDraft((previous) => ({ ...previous, analytics }))
                  }
                />
                <CategoryRow
                  baseId={`${baseId}-marketing`}
                  title={content.marketingTitle}
                  text={content.marketingText}
                  checked={draft.marketing}
                  onChange={(marketing) =>
                    setDraft((previous) => ({ ...previous, marketing }))
                  }
                />
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className={BUTTON_CLASS}
                  onClick={() => choose(draft.analytics, draft.marketing)}
                >
                  {content.saveSelection}
                </button>
                <button
                  type="button"
                  className={BUTTON_CLASS}
                  onClick={() => choose(true, true)}
                >
                  {content.acceptAll}
                </button>
              </div>
            </>
          )}

          {compact ? null : (
            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground-muted">
              <Link href="/datenschutz" className={LINK_CLASS}>
                {content.privacyLinkText}
              </Link>
              <Link href="/impressum" className={LINK_CLASS}>
                {content.impressumLinkText}
              </Link>
            </p>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
