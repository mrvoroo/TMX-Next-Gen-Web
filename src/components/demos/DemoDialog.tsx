'use client';

/**
 * Native <dialog> for demo actions (reserve, book, checkout, pre-order).
 * showModal() gives focus trapping, Escape and an inert background for free.
 */
import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DemoDialog({
  open,
  onClose,
  title,
  closeLabel,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label={title}
      className={cn(
        'm-auto w-[min(32rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl p-0 shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm',
        className,
      )}
    >
      <div className="relative p-6 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute right-4 top-4 rounded-full p-2 opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-current"
        >
          <X size={18} aria-hidden="true" />
        </button>
        <h2 className="pr-10 text-xl font-bold">{title}</h2>
        <div className="mt-5">{children}</div>
      </div>
    </dialog>
  );
}
