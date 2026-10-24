import type { ServiceItemData } from '@/lib/content';
import type { PillarKey } from '@/config/pillars';

/** Props shared by the 4 pillar blocks (all data comes from Keystatic). */
export interface PillarBlockProps {
  /** Pillar this block shows; target of the title and card links. */
  pillar: PillarKey;
  title: string;
  sub: string;
  items: ServiceItemData[];
  /** Display number of the block among the visible pillars ("01", "02", …). */
  number: string;
}
