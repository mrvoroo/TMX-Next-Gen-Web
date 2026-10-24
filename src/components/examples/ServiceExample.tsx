import type { ServiceExampleName } from '@/config/service-examples';
import { HeroBuilderDemo } from './HeroBuilderDemo';
import { ShopCartDemo } from './ShopCartDemo';
import { DashboardDemo } from './DashboardDemo';
import { SupportChatDemo } from './SupportChatDemo';
import { BudgetMixDemo } from './marketing/BudgetMixDemo';
import { AdFunnelDemo } from './marketing/AdFunnelDemo';
import { PostSchedulerDemo } from './marketing/PostSchedulerDemo';
import { InsightsDemo } from './marketing/InsightsDemo';

/** Maps the Keystatic "example" value of a service to its interactive demo. */
export function ServiceExample({ name }: { name: ServiceExampleName }) {
  switch (name) {
    case 'hero-builder':
      return <HeroBuilderDemo />;
    case 'shop-cart':
      return <ShopCartDemo />;
    case 'dashboard-live':
      return <DashboardDemo />;
    case 'support-chat':
      return <SupportChatDemo />;
    case 'budget-mix':
      return <BudgetMixDemo />;
    case 'ad-funnel':
      return <AdFunnelDemo />;
    case 'post-scheduler':
      return <PostSchedulerDemo />;
    case 'data-insights':
      return <InsightsDemo />;
    default:
      return null;
  }
}
