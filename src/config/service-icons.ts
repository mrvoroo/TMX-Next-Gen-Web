/**
 * Fixed list of lucide-react icon names selectable for a service in Keystatic.
 * Names only (no React imports) so keystatic.config.ts can use it.
 * The name → component map lives in components/sections/services/icons.ts.
 */
export const SERVICE_ICON_NAMES = [
  'Globe',
  'Smartphone',
  'ShoppingCart',
  'LayoutDashboard',
  'MessageSquare',
  'Link',
  'Cloud',
  'Zap',
  'Brain',
  'Cpu',
  'Lightbulb',
  'GraduationCap',
  'Bot',
  'RefreshCw',
  'BarChart2',
  'Search',
  'Target',
  'Share2',
  'FileText',
  'Mail',
  'TrendingUp',
  'Megaphone',
  'MapPin',
  'Layers',
  'Shield',
  'Upload',
  'Server',
  'Settings',
  'Compass',
] as const;

export type ServiceIconName = (typeof SERVICE_ICON_NAMES)[number];

export const SERVICE_PILLARS = [
  'entwicklung',
  'ki',
  'digitales-marketing',
  'it-beratung',
] as const;

export type ServicePillar = (typeof SERVICE_PILLARS)[number];
