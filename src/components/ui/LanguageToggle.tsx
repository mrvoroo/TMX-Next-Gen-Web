'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';
import { cn } from '@/lib/utils';

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useTranslation();

  return (
    <div
      className={cn(
        'flex items-center gap-0.5 rounded-full border border-white/20 bg-white/5 p-0.5 backdrop-blur-sm',
        className,
      )}
      role="group"
      aria-label="Language selection"
    >
      <button
        onClick={() => setLocale('de')}
        aria-pressed={locale === 'de'}
        aria-label="Deutsch"
        className={cn(
          'rounded-full px-3 py-1 text-xs font-semibold tracking-widest transition-all duration-200',
          locale === 'de'
            ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/25'
            : 'text-white/50 hover:text-white/80',
        )}
      >
        DE
      </button>
      <button
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
        aria-label="English"
        className={cn(
          'rounded-full px-3 py-1 text-xs font-semibold tracking-widest transition-all duration-200',
          locale === 'en'
            ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg shadow-violet-500/25'
            : 'text-white/50 hover:text-white/80',
        )}
      >
        EN
      </button>
    </div>
  );
}
