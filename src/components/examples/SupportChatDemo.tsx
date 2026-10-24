'use client';

/**
 * Interactive example for "Einrichtung von Chat- und Support-Systemen": a
 * support chat widget with suggested questions and pre-written replies.
 * No AI and no network requests — everything stays in the browser.
 */

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, RotateCcw, Send } from 'lucide-react';
import { useExamplesText } from '@/lib/i18n/examples';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

type Msg = { id: number; from: 'bot' | 'user'; text: string };
const MAX_INPUT = 200;

export function SupportChatDemo() {
  const t = useExamplesText().chat;
  const reduced = useReducedMotion();
  const [messages, setMessages] = useState<Msg[]>([{ id: 0, from: 'bot', text: t.greeting }]);
  const [typing, setTyping] = useState(false);
  const [used, setUsed] = useState<number[]>([]);
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    // Scroll only the message list, never the page (Lenis).
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
  }, [messages, typing, reduced]);

  const ask = (question: string, answer: string) => {
    if (typing) return;
    setMessages((m) => [...m, { id: nextId.current++, from: 'user', text: question }]);
    setTyping(true);
    timer.current = window.setTimeout(
      () => {
        setTyping(false);
        setMessages((m) => [...m, { id: nextId.current++, from: 'bot', text: answer }]);
      },
      reduced ? 200 : 950,
    );
  };

  const onSuggestion = (i: number) => {
    setUsed((u) => (u.includes(i) ? u : [...u, i]));
    ask(t.suggestions[i].q, t.suggestions[i].a);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim().slice(0, MAX_INPUT);
    if (!text) return;
    setInput('');
    ask(text, t.fallback);
  };

  const reset = () => {
    window.clearTimeout(timer.current);
    setTyping(false);
    setUsed([]);
    setMessages([{ id: nextId.current++, from: 'bot', text: t.greeting }]);
  };

  const pop = reduced
    ? { initial: false as const }
    : { initial: { opacity: 0, y: 10, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { duration: 0.25 } };

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0f0e16] shadow-2xl">
      <div className="flex items-center gap-3 bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white">
          <MessageCircle size={18} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{t.brand}</p>
          <p className="flex items-center gap-1.5 text-[11px] text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" aria-hidden="true" />
            {t.status}
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          aria-label={t.reset}
          title={t.reset}
          className="rounded-full p-1.5 text-white/80 hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <RotateCcw size={15} aria-hidden="true" />
        </button>
      </div>

      <div
        ref={listRef}
        aria-live="polite"
        aria-relevant="additions"
        className="h-72 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
        data-lenis-prevent
      >
        {messages.map((m) => (
          <motion.div key={m.id} {...pop} className={cn('flex', m.from === 'user' ? 'justify-end' : 'justify-start')}>
            <p
              className={cn(
                'max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed [overflow-wrap:anywhere]',
                m.from === 'user'
                  ? 'rounded-br-md bg-violet-600 text-white'
                  : 'rounded-bl-md bg-white/[0.06] text-white/85',
              )}
            >
              {m.text}
            </p>
          </motion.div>
        ))}
        <AnimatePresence>
          {typing && (
            <motion.div
              key="typing"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              className="flex items-center gap-2 text-xs text-white/40"
            >
              <span className="flex gap-1 rounded-2xl rounded-bl-md bg-white/[0.06] px-3 py-3" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={cn('h-1.5 w-1.5 rounded-full bg-white/50', !reduced && 'animate-bounce')}
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </span>
              <span className="sr-only">{t.typing}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap gap-2 px-4 pb-3">
        {t.suggestions.map((s, i) =>
          used.includes(i) ? null : (
            <button
              key={s.q}
              type="button"
              disabled={typing}
              onClick={() => onSuggestion(i)}
              className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-200 transition-colors hover:bg-violet-500/20 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              {s.q}
            </button>
          ),
        )}
      </div>

      <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-white/[0.06] p-3">
        <label htmlFor="support-chat-demo-input" className="sr-only">
          {t.placeholder}
        </label>
        <input
          id="support-chat-demo-input"
          value={input}
          maxLength={MAX_INPUT}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.placeholder}
          autoComplete="off"
          className="min-w-0 flex-1 rounded-xl bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || typing}
          aria-label={t.send}
          className="rounded-xl bg-violet-600 p-2.5 text-white transition-opacity hover:bg-violet-500 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <Send size={16} aria-hidden="true" />
        </button>
      </form>
      <p className="px-4 pb-3 text-[11px] text-white/35">{t.scriptedNote}</p>
    </div>
  );
}
