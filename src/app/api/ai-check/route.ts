/**
 * POST /api/ai-check – KI-Potenzial-Check.
 *
 * The mode is decided here on the server (see lib/ai-check/config.ts); the
 * browser cannot switch to live mode. Nothing is stored or logged; the IP is
 * only used in memory for the rate limit.
 */
import { getAiToolMode } from '@/lib/ai-check/config';
import { buildDemoResult } from '@/lib/ai-check/demo';
import { runLiveCheck } from '@/lib/ai-check/live';
import { rateLimit } from '@/lib/ai-check/rate-limit';
import { MAX_BODY_BYTES, parseAiCheckInput } from '@/lib/ai-check/schema';

const WINDOW_MS = 10 * 60 * 1000;
const LIMITS = { demo: 30, live: 5 } as const;
const NO_STORE = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' };

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: NO_STORE });

function sameOrigin(req: Request) {
  const origin = req.headers.get('origin');
  if (!origin) return false;
  try {
    return new URL(origin).host === req.headers.get('host');
  } catch {
    return false;
  }
}

function clientKey(req: Request) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

export async function POST(req: Request) {
  const mode = getAiToolMode();
  if (mode === 'off') return json({ error: 'disabled' }, 404);
  if (!sameOrigin(req)) return json({ error: 'forbidden' }, 403);
  if (!req.headers.get('content-type')?.includes('application/json')) return json({ error: 'bad_request' }, 415);

  if (!rateLimit(`${mode}:${clientKey(req)}`, LIMITS[mode], WINDOW_MS)) {
    return json({ error: 'rate_limited' }, 429);
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json({ error: 'too_large' }, 413);
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: 'bad_request' }, 400);
  }
  const input = parseAiCheckInput(body);
  if (!input) return json({ error: 'bad_request' }, 400);

  if (mode === 'live') {
    // Live requires explicit consent; without it nothing leaves the server.
    if (!input.consent) return json({ error: 'consent_required' }, 400);
    const live = await runLiveCheck(input);
    if (live) return json({ result: live });
  }
  // Demo mode – or live failed: pre-written result, clearly labeled "demo".
  return json({ result: buildDemoResult({ ...input, note: undefined }) });
}
