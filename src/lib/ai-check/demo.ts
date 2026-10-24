/**
 * Demo mode of the KI-Potenzial-Check: assembles a result from the
 * pre-written building blocks. Deterministic, no AI, no storage.
 */
import type { AiCheckInput, AiCheckResult, AiEffort, AiLevel } from './schema';
import { aiCheckTexts, demoBlocks, demoNextStep, demoSummaries } from './texts';

const SIZE_SCORE = { solo: 0, small: 1, medium: 2, large: 3 } as const;
const EFFORT_ORDER: Record<AiEffort, number> = { low: 0, medium: 1, high: 2 };

export function levelFor(input: Pick<AiCheckInput, 'tasks' | 'size'>): AiLevel {
  const score = input.tasks.length * 2 + SIZE_SCORE[input.size];
  if (score < 5) return 'low';
  if (score < 9) return 'medium';
  return 'high';
}

export function buildDemoResult(input: AiCheckInput): AiCheckResult {
  const t = aiCheckTexts[input.locale];
  const blocks = demoBlocks[input.locale];
  const level = levelFor(input);
  const items = input.tasks
    .map((task) => ({ task, title: t.taskNames[task], ...blocks[task] }))
    // Quick wins first; equal effort keeps the visitor's order.
    .sort((a, b) => EFFORT_ORDER[a.effort] - EFFORT_ORDER[b.effort]);
  return {
    source: 'demo',
    level,
    summary: demoSummaries[input.locale][level].replace('{industry}', t.industries[input.industry]),
    items,
    nextStep: demoNextStep[input.locale],
  };
}
