'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/navigation';
import { PILLAR_PATHNAME, translatePillarSlug } from '@/config/pillars';

export function LanguageToggle({ className }: { className?: string }) {
  const { locale } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ pillar?: string }>();
  const switchTo = (next: 'de' | 'en') => {
    if (pathname === PILLAR_PATHNAME) {
      // The pillar slug is localized: map it to the other language.
      const slug = translatePillarSlug(String(params.pillar ?? ''), locale, next);
      if (slug) {
        router.replace(
          { pathname: PILLAR_PATHNAME, params: { pillar: slug } },
          { locale: next },
        );
      }
      return;
    }
    router.replace(pathname as Exclude<typeof pathname, typeof PILLAR_PATHNAME>, {
      locale: next,
    });
  };

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
        onClick={() => switchTo('de')}
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
        onClick={() => switchTo('en')}
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
