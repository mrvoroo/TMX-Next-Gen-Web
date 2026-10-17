import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Card grid for any card count (2…6) without empty holes or a lone stretched
 * card: flex-wrap + centred rows, every direct child gets a fixed column
 * width (1 / 2 / 3 per row), so an incomplete last row is centred at the same
 * card width as the rows above. Cards in a row share the same height.
 *
 * `maxCols` = 2 gives 2 wider cards per row on md+ (used for the 2-card block).
 */
export function ServiceGrid({
  children,
  maxCols = 3,
}: {
  children: ReactNode;
  maxCols?: 2 | 3;
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap justify-center gap-4',
        '*:w-full *:min-w-0 sm:*:w-[calc((100%-1rem)/2)]',
        maxCols === 3 && 'md:*:w-[calc((100%-2rem)/3)]',
        maxCols === 2 && 'mx-auto max-w-4xl',
      )}
    >
      {children}
    </div>
  );
}
