import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

/**
 * Wrapper for every interactive example on the pillar pages: a clear
 * "example" badge on top and a note that brand and data are fictional
 * (never presented as client work).
 */
export function ExampleFrame({
  label,
  note,
  children,
}: {
  label: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <figure className="relative min-w-0">
      {label ? (
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-300">
            <Sparkles size={12} aria-hidden="true" />
            {label}
          </span>
        </div>
      ) : null}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c0b12] p-3 shadow-[0_40px_120px_-40px_rgba(124,58,237,0.35)] sm:p-5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl"
        />
        <div className="relative">{children}</div>
      </div>
      {note ? (
        <figcaption className="mt-3 text-xs text-white/40">{note}</figcaption>
      ) : null}
    </figure>
  );
}

/** Minimal browser window chrome used inside the examples. */
export function BrowserChrome({
  url,
  children,
  className,
}: {
  url: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/[0.08] bg-[#13111c] ${className ?? ''}`}
    >
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </div>
        <div className="min-w-0 flex-1 truncate rounded-md bg-white/[0.04] px-3 py-1 text-[11px] text-white/35">
          {url}
        </div>
      </div>
      {children}
    </div>
  );
}
