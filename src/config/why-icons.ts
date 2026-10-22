/**
 * Fixed list of lucide-react icon names selectable for a "Why TMX" card in
 * Keystatic. Names only (no React imports) so keystatic.config.ts can use it.
 * The name → component map lives in components/sections/WhyTmxSection.tsx.
 */
export const WHY_ICON_NAMES = [
  'Layers',
  'Sparkles',
  'Lightbulb',
  'Megaphone',
  'Languages',
  'ShieldCheck',
  'Rocket',
  'Zap',
  'Code',
  'Globe',
  'Bot',
  'Target',
  'Handshake',
  'Palette',
  'Gauge',
  'MessageCircle',
  'Cpu',
  'Compass',
  'BadgeCheck',
  'Heart',
] as const;

export type WhyIconName = (typeof WHY_ICON_NAMES)[number];
