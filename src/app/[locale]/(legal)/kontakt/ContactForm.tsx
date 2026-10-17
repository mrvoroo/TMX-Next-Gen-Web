'use client';

/**
 * Contact form (client). Texts arrive as props from the server page.
 *
 * Web3Forms: the access key comes from NEXT_PUBLIC_WEB3FORMS_KEY. Without it
 * no request is sent and the error message is shown. A request to
 * api.web3forms.com happens only on submit, never on page load.
 * Form content is never logged.
 */

import { Fragment, useState } from 'react';
import { Link } from '@/i18n/navigation';

export interface ContactFormTexts {
  fieldName: string;
  fieldEmail: string;
  fieldService: string;
  serviceDefault: string;
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

export function ContactForm({ texts }: { texts: ContactFormTexts }) {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});

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
    const service = String(data.get('service') ?? '');
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
          ...(service ? { service } : {}),
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

      <div>
        <label htmlFor="contact-service" className={LABEL_CLASS}>
          {texts.fieldService}
        </label>
        <select
          id="contact-service"
          name="service"
          defaultValue=""
          className={`${INPUT_CLASS} [&>option]:bg-[#050508]`}
        >
          <option value="">{texts.serviceDefault}</option>
          <option value={texts.serviceGeneral}>{texts.serviceGeneral}</option>
        </select>
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
