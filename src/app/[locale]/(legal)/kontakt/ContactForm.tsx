'use client';

/**
 * Contact form (client). Texts arrive as props from the server page.
 *
 * Web3Forms: the access key comes from NEXT_PUBLIC_WEB3FORMS_KEY. Without it
 * no request is sent and the error message is shown. A request to
 * api.web3forms.com happens only on submit, never on page load.
 * Form content is never logged.
 */

import {
  Fragment,
  Suspense,
  useEffect,
  useId,
  useState,
  useSyncExternalStore,
} from 'react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface ContactServiceItem {
  slug: string;
  /** Name for the current page language. */
  label: string;
  /** Official German name – the value sent in the payload. */
  nameDe: string;
}

export interface ContactServiceGroup {
  id: string;
  /** Pillar title for the current page language. */
  title: string;
  items: ContactServiceItem[];
}

export interface ContactFormTexts {
  fieldName: string;
  fieldEmail: string;
  fieldService: string;
  serviceGeneral: string;
  fieldMessage: string;
  checkbox: string;
  privacyLinkText: string;
  hint: string;
  button: string;
  sending: string;
  success: string;
  /** Already filled with the company e-mail. */
  error: string;
  valRequired: string;
  valEmail: string;
  valCheckbox: string;
}

type Status = 'idle' | 'sending' | 'success' | 'error';
type FieldKey = 'name' | 'email' | 'message' | 'privacy';
type Errors = Partial<Record<FieldKey, string>>;

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INPUT_CLASS =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/25 transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 aria-[invalid=true]:border-red-400';
const LABEL_CLASS = 'mb-2 block text-sm font-medium text-white/80';
const ERROR_CLASS = 'mt-2 text-sm text-red-400';
const LINK_CLASS =
  'underline underline-offset-2 transition-colors hover:text-white';

const DESKTOP_QUERY = '(min-width: 768px)';

/** true from the md breakpoint up; false on the server (mobile-first). */
function useIsDesktop(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(DESKTOP_QUERY);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
}

const CHIP_BASE =
  'block max-w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm leading-snug text-white/70 [hyphens:auto] [overflow-wrap:anywhere] peer-focus-visible:ring-2 peer-focus-visible:ring-violet-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#050508]';
const CHIP_HOVER = 'hover:border-white/25 hover:text-white';
/* Selected: translucent accent fill over a solid base, accent gradient border. */
const CHIP_CHECKED =
  'peer-checked:border-transparent peer-checked:text-white peer-checked:[background-image:linear-gradient(rgb(124_58_237/0.3),rgb(6_182_212/0.2)),linear-gradient(#0d0d14,#0d0d14),linear-gradient(135deg,var(--color-accent-from),var(--color-accent-to))] peer-checked:[background-origin:border-box] peer-checked:[background-clip:padding-box,padding-box,border-box]';

function Chip({
  label,
  value,
  checked,
  onToggle,
  animate,
}: {
  label: string;
  value: string;
  checked: boolean;
  onToggle: (value: string) => void;
  animate: boolean;
}) {
  return (
    <label className="relative block max-w-full cursor-pointer">
      <input
        type="checkbox"
        name="services"
        value={value}
        checked={checked}
        onChange={() => onToggle(value)}
        className="peer sr-only"
      />
      <span
        className={`${CHIP_BASE} ${CHIP_HOVER} ${CHIP_CHECKED} ${animate ? 'transition-colors duration-200' : ''}`}
      >
        {label}
      </span>
    </label>
  );
}

function ServicePillar({
  group,
  selected,
  onToggle,
  open,
  onOpenChange,
  isDesktop,
  animate,
}: {
  group: ContactServiceGroup;
  selected: Set<string>;
  onToggle: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDesktop: boolean;
  animate: boolean;
}) {
  const panelId = useId();
  const count = group.items.filter((item) => selected.has(item.nameDe)).length;

  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className="mb-3 w-full p-0">
        {isDesktop ? (
          <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">
            {group.title}
          </span>
        ) : (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => onOpenChange(!open)}
            className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-violet-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            <span className="min-w-0 break-words">{group.title}</span>
            <span className="flex shrink-0 items-center gap-2">
              {count > 0 ? (
                <span className="rounded-full bg-violet-500/30 px-2 py-0.5 text-[11px] font-semibold tracking-normal text-white">
                  {count}
                </span>
              ) : null}
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className={`h-3 w-3 ${animate ? 'transition-transform duration-200' : ''} ${open ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6l5 5 5-5" />
              </svg>
            </span>
          </button>
        )}
      </legend>
      <div
        id={panelId}
        className={`${open ? 'flex' : 'hidden'} flex-wrap gap-2 md:flex`}
      >
        {group.items.map((item) => (
          <Chip
            key={item.slug}
            label={item.label}
            value={item.nameDe}
            checked={selected.has(item.nameDe)}
            onToggle={onToggle}
            animate={animate}
          />
        ))}
      </div>
    </fieldset>
  );
}

/**
 * Reads ?service=<slug> and reports the matching visible service once.
 * Own component so useSearchParams sits in a Suspense boundary and the page
 * stays static. Unknown or hidden slugs are not in `groups` and are ignored.
 */
function ServiceFromQuery({
  groups,
  onMatch,
}: {
  groups: ContactServiceGroup[];
  onMatch: (groupId: string, nameDe: string) => void;
}) {
  const slug = useSearchParams().get('service');

  useEffect(() => {
    if (!slug) return;
    for (const group of groups) {
      const item = group.items.find((i) => i.slug === slug);
      if (item) {
        onMatch(group.id, item.nameDe);
        return;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return null;
}

export function ContactForm({
  texts,
  groups,
  generalNameDe,
  locale,
}: {
  texts: ContactFormTexts;
  groups: ContactServiceGroup[];
  /** German "general inquiry" text – always sent in German. */
  generalNameDe: string;
  locale: 'de' | 'en';
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => new Set());
  const isDesktop = useIsDesktop();
  const reducedMotion = useReducedMotion();
  const animate = !reducedMotion;

  function toggleService(value: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  function setGroupOpen(id: string, open: boolean) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (open) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function preselect(groupId: string, nameDe: string) {
    setSelected((prev) => new Set(prev).add(nameDe));
    setGroupOpen(groupId, true);
  }

  function clearError(key: FieldKey) {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function withPrivacyLink(text: string) {
    const parts = text.split('{{privacyLink}}');
    return parts.map((part, index) => (
      <Fragment key={index}>
        {part}
        {index < parts.length - 1 ? (
          <Link href="/datenschutz" className={LINK_CLASS}>
            {texts.privacyLinkText}
          </Link>
        ) : null}
      </Fragment>
    ));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'sending') return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    // Official German names, always German, in DOM order.
    const services = data
      .getAll('services')
      .map((value) => String(value))
      .join('; ');
    const privacy = data.get('privacy') === 'on';
    const botcheck = data.get('botcheck') === 'on';

    const next: Errors = {};
    if (!name) next.name = texts.valRequired;
    if (!email) next.email = texts.valRequired;
    else if (!EMAIL_PATTERN.test(email)) next.email = texts.valEmail;
    if (!message) next.message = texts.valRequired;
    if (!privacy) next.privacy = texts.valCheckbox;

    setErrors(next);
    const firstInvalid = (['name', 'email', 'message', 'privacy'] as const).find(
      (key) => next[key],
    );
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    if (!accessKey) {
      setStatus('error');
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name,
          email,
          message,
          ...(services ? { services } : {}),
          page_language: locale,
          botcheck,
        }),
      });
      const json = (await response.json()) as { success?: boolean };
      if (response.ok && json.success) {
        form.reset();
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <p
        role="status"
        className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-300"
      >
        {texts.success}
      </p>
    );
  }

  const sending = status === 'sending';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Web3Forms honeypot: hidden, not focusable, must stay unchecked. */}
      <input
        type="checkbox"
        name="botcheck"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div>
        <label htmlFor="contact-name" className={LABEL_CLASS}>
          {texts.fieldName}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          aria-required="true"
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          onChange={() => clearError('name')}
          className={INPUT_CLASS}
        />
        {errors.name ? (
          <p id="contact-name-error" className={ERROR_CLASS}>
            {errors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-email" className={LABEL_CLASS}>
          {texts.fieldEmail}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          aria-required="true"
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          onChange={() => clearError('email')}
          className={INPUT_CLASS}
        />
        {errors.email ? (
          <p id="contact-email-error" className={ERROR_CLASS}>
            {errors.email}
          </p>
        ) : null}
      </div>

      <div role="group" aria-labelledby="contact-service-label">
        <p id="contact-service-label" className={LABEL_CLASS}>
          {texts.fieldService}
        </p>
        <Suspense fallback={null}>
          <ServiceFromQuery groups={groups} onMatch={preselect} />
        </Suspense>
        <div className="space-y-5">
          {groups.map((group) => (
            <ServicePillar
              key={group.id}
              group={group}
              selected={selected}
              onToggle={toggleService}
              open={openGroups.has(group.id)}
              onOpenChange={(open) => setGroupOpen(group.id, open)}
              isDesktop={isDesktop}
              animate={animate}
            />
          ))}
          <div className="flex">
            <Chip
              label={texts.serviceGeneral}
              value={generalNameDe}
              checked={selected.has(generalNameDe)}
              onToggle={toggleService}
              animate={animate}
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className={LABEL_CLASS}>
          {texts.fieldMessage}
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          aria-required="true"
          aria-invalid={errors.message ? 'true' : 'false'}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          onChange={() => clearError('message')}
          className={`${INPUT_CLASS} resize-y`}
        />
        {errors.message ? (
          <p id="contact-message-error" className={ERROR_CLASS}>
            {errors.message}
          </p>
        ) : null}
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            id="contact-privacy"
            name="privacy"
            type="checkbox"
            defaultChecked={false}
            aria-required="true"
            aria-invalid={errors.privacy ? 'true' : 'false'}
            aria-describedby={errors.privacy ? 'contact-privacy-error' : undefined}
            onChange={() => clearError('privacy')}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-white/5 accent-violet-500"
          />
          <label
            htmlFor="contact-privacy"
            className="text-sm leading-relaxed text-white/60"
          >
            {withPrivacyLink(texts.checkbox)}
          </label>
        </div>
        {errors.privacy ? (
          <p id="contact-privacy-error" className={ERROR_CLASS}>
            {errors.privacy}
          </p>
        ) : null}
      </div>

      {status === 'error' ? (
        <p
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {texts.error}
        </p>
      ) : null}

      <div>
        <button
          type="submit"
          disabled={sending}
          className="w-full rounded-xl bg-violet-600 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[#050508] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? texts.sending : texts.button}
        </button>
        <p className="mt-3 text-xs leading-relaxed text-white/50">
          {withPrivacyLink(texts.hint)}
        </p>
      </div>
    </form>
  );
}
