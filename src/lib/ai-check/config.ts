import 'server-only';

/**
 * Mode of the KI-Potenzial-Check, read on the server only.
 *
 *   AI_TOOL_MODE=off   → the tool is not shown at all
 *   AI_TOOL_MODE=demo  → pre-written building blocks (default)
 *   AI_TOOL_MODE=live  → real AI, but ONLY if all of these are set too:
 *                        AI_PRIVACY_APPROVED=true  (privacy policy section
 *                        reviewed and published, DPA with the provider signed)
 *                        MISTRAL_API_KEY=…
 *                        Otherwise it silently stays in demo mode.
 *
 * The pillar pages are static, so a change needs a new build/deploy.
 */
export type AiToolMode = 'off' | 'demo' | 'live';

export function getAiToolMode(): AiToolMode {
  const mode = (process.env.AI_TOOL_MODE ?? 'demo').trim().toLowerCase();
  if (mode === 'off') return 'off';
  if (mode === 'live' && isLiveReady()) return 'live';
  return 'demo';
}

function isLiveReady() {
  return process.env.AI_PRIVACY_APPROVED === 'true' && Boolean(process.env.MISTRAL_API_KEY?.trim());
}
