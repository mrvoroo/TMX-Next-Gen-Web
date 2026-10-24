'use client';

/**
 * Shared pieces of the marketing chart examples: platform colours (validated
 * categorical palette for the dark surface, fixed order), a panel shell with
 * the "fictional data" label, segmented controls and an optional table view.
 */

import { useId, useState, type ReactNode } from 'react';
import { Table2 } from 'lucide-react';
import type { Platform } from '@/lib/i18n/marketing-examples';
import { useMarketingText } from '@/lib/i18n/marketing-examples';
import { cn } from '@/lib/utils';

/** Validated (dataviz validator, dark surface #100f17): CVD ≥ 8.4, normal ≥ 19.3, contrast ≥ 3:1. */
export const PLATFORM_COLORS: Record<Platform, string> = {
  instagram: '#3987e5',
  facebook: '#d95926',
  tiktok: '#199e70',
  snapchat: '#c98500',
  pinterest: '#d55181',
  linkedin: '#008300',
};

export function ChartPanel({
  title,
  controls,
  children,
  note,
  table,
}: {
  title: string;
  controls?: ReactNode;
  children: ReactNode;
  note?: string;
  table?: ReactNode;
}) {
  const t = useMarketingText().common;
  const [showTable, setShowTable] = useState(false);
  const tableId = useId();
  return (
    <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#100f17] shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4 border-b border-white/[0.06] p-5 sm:p-6">
        <div className="min-w-0">
          <p className="text-base font-semibold text-white">{title}</p>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-amber-200/70">{t.fictional}</p>
        </div>
        {controls ? <div className="flex min-w-0 flex-wrap items-end gap-4">{controls}</div> : null}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
      {table ? (
        <div className="border-t border-white/[0.06] px-5 py-3 sm:px-6">
          <button
            type="button"
            aria-expanded={showTable}
            aria-controls={tableId}
            onClick={() => setShowTable((s) => !s)}
            className="inline-flex items-center gap-1.5 rounded-md text-xs text-white/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            <Table2 size={13} aria-hidden="true" />
            {showTable ? t.hideTable : t.showTable}
          </button>
          <div id={tableId} hidden={!showTable} className="mt-3 overflow-x-auto">
            {table}
          </div>
        </div>
      ) : null}
      {note ? <p className="border-t border-white/[0.06] px-5 py-3 text-[11px] leading-relaxed text-white/40 sm:px-6">{note}</p> : null}
    </div>
  );
}

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="min-w-0">
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">{label}</p>
      <div className="flex flex-wrap rounded-lg bg-white/[0.04] p-0.5">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              'rounded-md px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500',
              value === o.value ? 'bg-violet-500/30 text-white' : 'text-white/50 hover:text-white',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function DataTable({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <table className="w-full min-w-[18rem] text-left text-xs">
      <thead>
        <tr className="text-white/40">
          {head.map((h, i) => (
            <th key={h} scope="col" className={cn('py-1.5 pr-4 font-medium', i > 0 && 'text-right')}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="tabular-nums text-white/75">
        {rows.map((r) => (
          <tr key={String(r[0])} className="border-t border-white/[0.05]">
            {r.map((c, i) =>
              i === 0 ? (
                <th key={i} scope="row" className="py-1.5 pr-4 font-normal">
                  {c}
                </th>
              ) : (
                <td key={i} className="py-1.5 pr-4 text-right">
                  {c}
                </td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Swatch({ color }: { color: string }) {
  return <span aria-hidden="true" className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: color }} />;
}
