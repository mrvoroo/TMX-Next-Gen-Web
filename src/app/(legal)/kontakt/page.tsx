'use client';

/**
 * /kontakt  —  Kontakt / Contact
 *
 * Web3Forms integration (https://web3forms.com/).
 * The access key lives in src/config/company.ts → WEB3FORMS_ACCESS_KEY.
 * No server actions needed — Web3Forms handles submission via their API.
 *
 * Form fields: Name, E-Mail, Betreff, Nachricht, GDPR checkbox.
 * DE labels are primary; EN equivalents shown as placeholders/sublabels.
 *
 * Note: no existing Web3Forms integration was found anywhere in the codebase;
 * this is the first implementation.
 */

import { useState } from 'react';
import Link from 'next/link';
import { WEB3FORMS_ACCESS_KEY, COMPANY_EMAIL } from '@/config/company';

// Metadata cannot be exported from a 'use client' component.
// Create a separate metadata.ts or move to a server wrapper if needed.
// For now the <head> title is handled by the layout.

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function KontaktPage() {
  const [state, setState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('submitting');
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);

    // Web3Forms requires the access_key field in the payload.
    // It is already a hidden input in the form; FormData picks it up automatically.
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();

      if (json.success) {
        setState('success');
      } else {
        setErrorMsg(json.message ?? 'Unbekannter Fehler');
        setState('error');
      }
    } catch {
      setErrorMsg('Netzwerkfehler. Bitte versuchen Sie es erneut.');
      setState('error');
    }
  }

  /* ── Success screen ──────────────────────────────────────────────────── */
  if (state === 'success') {
    return (
      <div className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8">
        <div className="mb-6 text-5xl">✉️</div>
        <h1 className="mb-3 text-3xl font-black text-white">
          Nachricht gesendet! / Message sent!
        </h1>
        <p className="mb-8 text-white/60">
          Vielen Dank für Ihre Anfrage. Wir melden uns innerhalb von 24 Stunden.
          <br />
          <span className="text-white/40">
            Thank you for your enquiry. We will be in touch within 24 hours.
          </span>
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-violet-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
        >
          ← Zurück zur Startseite / Back to Home
        </Link>
      </div>
    );
  }

  /* ── Form ────────────────────────────────────────────────────────────── */
  return (
    <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
      <header className="mb-12">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-violet-400">
          Kontakt / Contact
        </p>
        <h1 className="text-4xl font-black text-white sm:text-5xl">
          Lassen Sie uns sprechen
        </h1>
        <p className="mt-3 text-white/50">
          Let&apos;s talk. Schreiben Sie uns — wir antworten innerhalb von 24 Stunden.
        </p>
        <p className="mt-2 text-sm text-white/40">
          Oder direkt per E-Mail:{' '}
          <a
            href={`mailto:${COMPANY_EMAIL}`}
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {COMPANY_EMAIL}
          </a>
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Hidden Web3Forms fields */}
        <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} />
        {/* Redirect back to the same page; Web3Forms ignores this for API calls */}
        <input type="hidden" name="redirect" value="false" />
        {/* Honeypot anti-spam */}
        <input
          type="checkbox"
          name="botcheck"
          className="hidden"
          style={{ display: 'none' }}
          tabIndex={-1}
          aria-hidden="true"
        />

        {/* Name */}
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-white/80">
            Name <span aria-hidden="true" className="text-violet-400">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Ihr vollständiger Name / Your full name"
            className="
              w-full rounded-xl border border-white/10 bg-white/5
              px-4 py-3 text-sm text-white placeholder-white/25
              transition-colors focus:border-violet-500 focus:outline-none
              focus:ring-1 focus:ring-violet-500
            "
          />
        </div>

        {/* E-Mail */}
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-white/80">
            E-Mail <span aria-hidden="true" className="text-violet-400">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="ihre@email.de / you@email.com"
            className="
              w-full rounded-xl border border-white/10 bg-white/5
              px-4 py-3 text-sm text-white placeholder-white/25
              transition-colors focus:border-violet-500 focus:outline-none
              focus:ring-1 focus:ring-violet-500
            "
          />
        </div>

        {/* Betreff */}
        <div>
          <label htmlFor="subject" className="mb-2 block text-sm font-medium text-white/80">
            Betreff / Subject <span aria-hidden="true" className="text-violet-400">*</span>
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            required
            placeholder="Womit können wir Ihnen helfen? / How can we help you?"
            className="
              w-full rounded-xl border border-white/10 bg-white/5
              px-4 py-3 text-sm text-white placeholder-white/25
              transition-colors focus:border-violet-500 focus:outline-none
              focus:ring-1 focus:ring-violet-500
            "
          />
        </div>

        {/* Nachricht */}
        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-medium text-white/80">
            Nachricht / Message <span aria-hidden="true" className="text-violet-400">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            placeholder="Beschreiben Sie Ihr Projekt oder Ihre Anfrage... / Describe your project or enquiry..."
            className="
              w-full resize-y rounded-xl border border-white/10 bg-white/5
              px-4 py-3 text-sm text-white placeholder-white/25
              transition-colors focus:border-violet-500 focus:outline-none
              focus:ring-1 focus:ring-violet-500
            "
          />
        </div>

        {/* GDPR checkbox */}
        <div className="flex items-start gap-3">
          <input
            id="gdpr"
            name="gdpr"
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-white/5 accent-violet-500"
          />
          <label htmlFor="gdpr" className="text-xs text-white/50 leading-relaxed">
            Ich habe die{' '}
            <Link
              href="/datenschutz"
              className="underline underline-offset-2 hover:text-white transition-colors"
            >
              Datenschutzerklärung
            </Link>{' '}
            gelesen und stimme der Verarbeitung meiner Daten zu.
            {' '}
            <span className="text-white/30">
              I have read the{' '}
              <Link
                href="/datenschutz"
                className="underline underline-offset-2 hover:text-white/50 transition-colors"
              >
                privacy policy
              </Link>{' '}
              and consent to the processing of my data.
            </span>
          </label>
        </div>

        {/* Error message */}
        {state === 'error' && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            Fehler beim Senden: {errorMsg}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={state === 'submitting'}
          className="
            w-full rounded-xl bg-violet-600 px-8 py-4 text-sm font-semibold
            text-white transition-all hover:bg-violet-500
            disabled:cursor-not-allowed disabled:opacity-50
            focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2
            focus:ring-offset-[#050508]
          "
        >
          {state === 'submitting'
            ? 'Wird gesendet… / Sending…'
            : 'Nachricht senden / Send message'}
        </button>
      </form>
    </div>
  );
}
