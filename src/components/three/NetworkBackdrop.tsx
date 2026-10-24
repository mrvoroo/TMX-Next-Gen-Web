/**
 * Mobile stand-in for the WebGL particle networks (hero, AI block): the same
 * look – dots linked by thin lines – as ONE static SVG that drifts slowly via
 * a CSS transform (no per-element animation, so the layer is rasterised
 * once). Runs on the compositor, costs no main-thread work per
 * frame and loads no three.js. Deterministic points, so server and client
 * render the same markup.
 */

type Tone = 'violet' | 'cyan';

const TONES: Record<Tone, { dot: string; line: string }> = {
  violet: { dot: '#8b5cf6', line: '#6d28d9' },
  cyan: { dot: '#06b6d4', line: '#0891b2' },
};

/** Small deterministic PRNG (mulberry32). */
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function build(seed: number, count: number, linkDist: number) {
  const r = rng(seed);
  const pts = Array.from({ length: count }, () => [r() * 100, r() * 160] as const);
  const lines: [number, number, number, number][] = [];
  for (let i = 0; i < pts.length; i++)
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i][0] - pts[j][0];
      const dy = pts[i][1] - pts[j][1];
      if (dx * dx + dy * dy < linkDist * linkDist) lines.push([pts[i][0], pts[i][1], pts[j][0], pts[j][1]]);
    }
  return { pts, lines };
}

const NETS = { violet: build(11, 46, 22), cyan: build(29, 34, 24) };

export function NetworkBackdrop({ tone = 'violet', animated = true }: { tone?: Tone; animated?: boolean }) {
  const c = TONES[tone];
  const { pts, lines } = NETS[tone];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes net-drift { 0% { transform: translate3d(0,0,0) scale(1.08) } 50% { transform: translate3d(-3%,-2%,0) scale(1.12) } 100% { transform: translate3d(0,0,0) scale(1.08) } }
        .net-drift { animation: net-drift 26s ease-in-out infinite; will-change: transform }
        @media (prefers-reduced-motion: reduce) { .net-drift { animation: none } }
      `}</style>
      <svg viewBox="0 0 100 160" preserveAspectRatio="xMidYMid slice" className={animated ? 'net-drift h-full w-full' : 'h-full w-full'}>
        <g stroke={c.line} strokeOpacity="0.28" strokeWidth="0.18">
          {lines.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </g>
        <g fill={c.dot}>
          {pts.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 7 === 0 ? 0.75 : 0.45} opacity={0.85} />
          ))}
        </g>
      </svg>
    </div>
  );
}
