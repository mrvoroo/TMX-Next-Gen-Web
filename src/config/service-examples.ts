/**
 * Interactive examples that can be shown under a service on its pillar page.
 * Names only (no React imports) so keystatic.config.ts can use the list.
 * The name → component map lives in components/examples/ServiceExample.tsx.
 */
export const SERVICE_EXAMPLE_NAMES = [
  'none',
  'hero-builder',
  'shop-cart',
  'dashboard-live',
  'support-chat',
] as const;

export type ServiceExampleName = (typeof SERVICE_EXAMPLE_NAMES)[number];

export const SERVICE_EXAMPLE_LABELS: Record<ServiceExampleName, string> = {
  none: 'None',
  'hero-builder': 'Website hero builder (development)',
  'shop-cart': 'Online shop with cart (e-commerce)',
  'dashboard-live': 'Live KPI dashboard (dashboards)',
  'support-chat': 'Support chat widget (chat & support)',
};

export const isServiceExample = (v: unknown): v is ServiceExampleName =>
  typeof v === 'string' &&
  (SERVICE_EXAMPLE_NAMES as readonly string[]).includes(v);
