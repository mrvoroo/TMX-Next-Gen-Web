'use client';

import type { ReactNode } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { PILLAR_PATHNAME, pillarSlug } from '@/config/pillars';
import { cn } from '@/lib/utils';
import type { PillarKey } from '@/config/pillars';

/** Localized href of a pillar page, optionally with a #service hash. */
function usePillarHref(pillar: PillarKey, hash?: string) {
  const locale = useLocale() as 'de' | 'en';
  return {
    pathname: PILLAR_PATHNAME,
    params: { pillar: pillarSlug(locale, pillar) ?? pillar },
    ...(hash ? { hash } : {}),
  };
}

/**
 * Invisible full-card link to `<pillar page>#<slug>`. Place inside a
 * `relative` card; the label stays the visible text of the card.
 */
export function ServiceCardLink({
  pillar,
  slug,
  label,
}: {
  pillar: PillarKey;
  slug: string;
  label: string;
}) {
  const href = usePillarHref(pillar, slug);
  return (
    <Link
      href={href}
      aria-label={label}
      className="absolute inset-0 z-20 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
    />
  );
}

/** Pillar block title linking to the pillar page. */
export function PillarTitleLink({
  pillar,
  children,
  className,
}: {
  pillar: PillarKey;
  children: ReactNode;
  className?: string;
}) {
  const href = usePillarHref(pillar);
  return (
    <Link
      href={href}
      className={cn(
        'rounded transition-colors hover:text-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500',
        className,
      )}
    >
      {children}
    </Link>
  );
}
