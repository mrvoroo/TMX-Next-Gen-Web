'use client';

/**
 * KI-Potenzial-Check – three questions, then an assessment with ideas and a
 * first step per task. The mode (demo | live) comes from the server; in demo
 * mode only the fixed choices are sent (no free text, no consent needed).
 */

import { useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Bot, Check, Info, Loader2, RotateCcw, Sparkles } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';
import {
  AI_INDUSTRIES,
  AI_SIZES,
  AI_TASKS,
  MAX_NOTE,
  MAX_TASKS,
  type AiCheckResult,
  type AiIndustry,
  type AiLevel,
  type AiLocale,
  type AiSize,
  type AiTask,
} from '@/lib/ai-check/schema';
import { aiCheckTexts } from '@/lib/ai-check/texts';

const LEVEL_STEPS: Record<AiLevel, number> = { low: 1, medium: 2, high: 3 };

function Legend({ children, hint }: { children: string; hint?: string }) {
  return (
    <legend className="mb-3 flex w-full flex-wrap items-baseline justify-between gap-2 text-sm font-semibold text-white">
      {children}
      {hint ? <span className="text-[11px] font-normal text-white/40">{hint}</span> : null}
    </legend>
  );
}

function Chip({
  type,
  name,
  checked,
  disabled,
  onChange,
  children,
}: {
  type: 'radio' | 'checkbox';
  name: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  children: string;
}) {
  return (
    <label
      className={cn(
        'relative inline-flex cursor-pointer select-none items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-violet-500',
        checked ? 'border-violet-400/60 bg-violet-500/20 text-white' : 'border-white/10 bg-white/[0.03] text-white/65 hover:text-white',
        disabled && !checked && 'cursor-not-allowed opacity-40 hover:text-white/65',
      )}
    >
      <input type={type} name={name} checked={checked} disabled={disabled && !checked} onChange={onChange} className="sr-only" />
      {checked ? <Check size={12} aria-hidden="true" /> : null}
      {children}
    </label>
  );
}

export function AiPotentialCheck({ mode }: { mode: 'demo' | 'live' }) {
  const locale = useLocale() as AiLocale;
  const t = aiCheckTexts[locale] ?? aiCheckTexts.de;
  const reduced = useReducedMotion();
  const live = mode === 'live';

  const [industry, setIndustry] = useState<AiIndustry | null>(null);
  const [size, setSize] = useState<AiSize | null>(null);
  const [tasks, setTasks] = useState<AiTask[]>([]);
  const [note, setNote] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'rate'>('idle');
  const [result, setResult] = useState<AiCheckResult | null>(null);
  // AnimatePresence mounts the next view after the exit animation, so focus
  // is moved from a ref callback once the heading actually exists.
  const focusNext = useRef<'result' | 'form' | null>(null);
  const focusIfPending = (which: 'result' | 'form') => (el: HTMLHeadingElement | null) => {
    if (el && focusNext.current === which) {
      focusNext.current = null;
      el.focus();
    }
  };

  const toggleTask = (task: AiTask) =>
    setTasks((list) => (list.includes(task) ? list.filter((x) => x !== task) : list.length >= MAX_TASKS ? list : [...list, task]));

  const ready = Boolean(industry && size && tasks.length > 0 && (!live || consent));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!ready || status === 'loading') return;
    setStatus('loading');
    try {
      const res = await fetch('/api/ai-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          industry,
          size,
          tasks,
          ...(live ? { note: note.trim() || undefined, consent } : {}),
        }),
      });
      if (res.status === 429) {
        setStatus('rate');
        return;
      }
      const data = (await res.json()) as { result?: AiCheckResult };
      if (!res.ok || !data.result) throw new Error('bad response');
      focusNext.current = 'result';
      setResult(data.result);
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  };

  const restart = () => {
    setResult(null);
    setConsent(false);
    setStatus('idle');
    focusNext.current = 'form';
  };

  const fade = reduced
    ? { initial: false as const }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.35 } };

  return (
    <section aria-labelledby="ai-check-title" className="min-w-0">
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
          <Sparkles size={12} aria-hidden="true" />
          {live ? t.badgeLive : t.badgeDemo}
        </span>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c0b12] shadow-[0_40px_120px_-40px_rgba(6,182,212,0.3)]">
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-violet-600/15 blur-3xl" />
        <div className="relative p-5 sm:p-8">
          <AnimatePresence mode="wait" initial={false}>
            {!result ? (
              <motion.form key="form" {...fade} onSubmit={onSubmit} noValidate>
                <h3 id="ai-check-title" ref={focusIfPending('form')} tabIndex={-1} className="text-xl font-bold tracking-tight text-white focus:outline-none sm:text-2xl">
                  {t.title}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">{t.intro}</p>

                <div className="mt-8 space-y-7">
                  <fieldset>
                    <Legend>{`1 · ${t.industry}`}</Legend>
                    <div className="flex flex-wrap gap-2">
                      {AI_INDUSTRIES.map((k) => (
                        <Chip key={k} type="radio" name="ai-industry" checked={industry === k} onChange={() => setIndustry(k)}>
                          {t.industries[k]}
                        </Chip>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset>
                    <Legend>{`2 · ${t.size}`}</Legend>
                    <div className="flex flex-wrap gap-2">
                      {AI_SIZES.map((k) => (
                        <Chip key={k} type="radio" name="ai-size" checked={size === k} onChange={() => setSize(k)}>
                          {t.sizes[k]}
                        </Chip>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset>
                    <Legend hint={`${t.tasksHint} · ${tasks.length}/${MAX_TASKS} ${t.selected}`}>{`3 · ${t.tasks}`}</Legend>
                    <div className="flex flex-wrap gap-2">
                      {AI_TASKS.map((k) => (
                        <Chip
                          key={k}
                          type="checkbox"
                          name="ai-tasks"
                          checked={tasks.includes(k)}
                          disabled={tasks.length >= MAX_TASKS}
                          onChange={() => toggleTask(k)}
                        >
                          {t.taskNames[k]}
                        </Chip>
                      ))}
                    </div>
                  </fieldset>

                  {live ? (
                    <div>
                      <label htmlFor="ai-check-note" className="mb-2 block text-sm font-semibold text-white">
                        {t.note}
                      </label>
                      <textarea
                        id="ai-check-note"
                        value={note}
                        maxLength={MAX_NOTE}
                        rows={3}
                        onChange={(e) => setNote(e.target.value)}
                        aria-describedby="ai-check-note-hint"
                        className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                      />
                      <p id="ai-check-note-hint" className="mt-1.5 flex justify-between gap-3 text-[11px] text-amber-200/70">
                        <span>{t.noteHint}</span>
                        <span className="shrink-0 tabular-nums text-white/35">
                          {note.length}/{MAX_NOTE}
                        </span>
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="mt-8 flex gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5 text-xs leading-relaxed text-white/60">
                  <Info size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-cyan-300" />
                  <p>
                    {live ? t.noticeLive : t.noticeDemo}{' '}
                    <Link href="/datenschutz" className="underline decoration-white/30 underline-offset-2 hover:text-white">
                      {t.privacyLink}
                    </Link>
                  </p>
                </div>

                {live ? (
                  <label className="mt-4 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-white/70">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      required
                      className="mt-0.5 h-4 w-4 shrink-0 accent-violet-500"
                    />
                    <span>{t.consent}</span>
                  </label>
                ) : null}

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    disabled={!ready || status === 'loading'}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    {status === 'loading' ? <Loader2 size={16} aria-hidden="true" className="animate-spin" /> : <Bot size={16} aria-hidden="true" />}
                    {status === 'loading' ? t.loading : t.submit}
                  </button>
                  <p role="status" aria-live="polite" className="text-xs text-rose-300">
                    {status === 'error' ? t.errorGeneric : status === 'rate' ? t.errorRate : ''}
                  </p>
                </div>
              </motion.form>
            ) : (
              <motion.div key="result" {...fade}>
                <p
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium',
                    result.source === 'live' ? 'bg-cyan-400/10 text-cyan-200' : 'bg-amber-300/10 text-amber-200',
                  )}
                >
                  {result.source === 'live' ? <Bot size={12} aria-hidden="true" /> : <Info size={12} aria-hidden="true" />}
                  {result.source === 'live' ? t.resultLive : t.resultDemo}
                </p>

                <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
                  <div className="min-w-0 max-w-2xl">
                    <h3 ref={focusIfPending('result')} tabIndex={-1} className="text-xl font-bold tracking-tight text-white focus:outline-none sm:text-2xl">
                      {t.levels[result.level]}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">{result.summary}</p>
                  </div>
                  <div aria-label={`${t.potential}: ${t.levels[result.level]}`} role="img" className="shrink-0">
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">{t.potential}</p>
                    <div className="flex gap-1">
                      {[1, 2, 3].map((s) => (
                        <motion.span
                          key={s}
                          initial={reduced ? false : { scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: reduced ? 0 : 0.15 * s, duration: reduced ? 0 : 0.4 }}
                          className={cn(
                            'h-2 w-10 origin-left rounded-full',
                            s <= LEVEL_STEPS[result.level] ? 'bg-gradient-to-r from-violet-500 to-cyan-400' : 'bg-white/[0.08]',
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                  {result.items.map((it, i) => (
                    <motion.li
                      key={it.task}
                      initial={reduced ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: reduced ? 0 : 0.2 + i * 0.08 }}
                      className="flex min-w-0 flex-col rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-white">{it.title}</p>
                        <span className="shrink-0 rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-white/60">
                          {t.effort}: {t.efforts[it.effort]}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-white/60">
                        <span className="font-semibold text-white/80">{t.idea}: </span>
                        {it.idea}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-white/60">
                        <span className="font-semibold text-cyan-200/90">{t.firstStep}: </span>
                        {it.firstStep}
                      </p>
                    </motion.li>
                  ))}
                </ul>

                <p className="mt-6 text-sm text-white/65">{result.nextStep}</p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link
                    href={{ pathname: '/kontakt', query: { service: 'ki-beratung' } }}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    {t.cta}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                  <button
                    type="button"
                    onClick={restart}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2.5 text-xs font-medium text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                  >
                    <RotateCcw size={13} aria-hidden="true" />
                    {t.restart}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
