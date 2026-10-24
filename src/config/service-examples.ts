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
  'budget-mix',
  'ad-funnel',
  'post-scheduler',
  'data-insights',
  'ai-check',
] as const;

export type ServiceExampleName = (typeof SERVICE_EXAMPLE_NAMES)[number];

export const SERVICE_EXAMPLE_LABELS: Record<ServiceExampleName, string> = {
  none: 'None',
  'hero-builder': 'Website hero builder (development)',
  'shop-cart': 'Online shop with cart (e-commerce)',
  'dashboard-live': 'Live KPI dashboard (dashboards)',
  'support-chat': 'Support chat widget (chat & support)',
  'budget-mix': 'Ad budget split by platform (media buying)',
  'ad-funnel': 'Campaign funnel with platform filter (ad campaigns)',
  'post-scheduler': 'Automatic weekly post schedule (social media automation)',
  'data-insights': '12-week chart with insights (data analysis)',
  'ai-check': 'AI potential check tool (AI consulting) – mode via AI_TOOL_MODE',
};

export const isServiceExample = (v: unknown): v is ServiceExampleName =>
  typeof v === 'string' &&
  (SERVICE_EXAMPLE_NAMES as readonly string[]).includes(v);
