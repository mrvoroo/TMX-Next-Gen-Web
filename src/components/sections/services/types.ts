import type { ServiceItemData } from '@/lib/content';

/** Props shared by the 4 pillar blocks (all data comes from Keystatic). */
export interface PillarBlockProps {
  title: string;
  sub: string;
  items: ServiceItemData[];
  /** Display number of the block among the visible pillars ("01", "02", …). */
  number: string;
}
