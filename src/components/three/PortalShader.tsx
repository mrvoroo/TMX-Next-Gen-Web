'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Public interfaces ───────────────────────────────────────────────────── */

/** All visual tunables live here — one place to change the look. */
export interface PortalConfig {
  background:  string;  // solid fill behind the orb (not used in shader)
  bodyColor:   string;
  bodyEdge:    string;
  streakColor: string;
  accentColor: string;
  rimColorA:   string;
  rimColorB:   string;
  haloColor:   string;
  coreColor:   string;
  density:     number;  // streak sharpness / count multiplier
  swirl:       number;  // vortex twist strength (higher = more wound up)
  brightness:  number;  // final luminance multiplier
  rimThickness:number;  // thickness of the bright rim band
  orbSize:     number;  // radius = clamp(orbSize * vmin, 90, 150) px
}

/** Animation state — written by GSAP (CPU), read by useFrame (GPU upload). */
export interface PortalState {
  speed: number;  // swirl rotation speed (0.35 → 1.2)
  intro: number;  // orb scale multiplier  (0.7 → 1.0)
  open:  number;  // portal expansion      (0 → 1)
  alpha: number;  // overall opacity       (0 → 1 on entry, GSAP fades overlay on exit)
}

/* ── GLSL ─────────────────────────────────────────────────────────────────── */

const VERT = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

/*
 * Single-pass fragment shader.
 * Technique: twisted polar coordinates + value noise → sharp streak slashes.
 * No loops over layers.  No textures.  No heavy branching.
 */
const FRAG = /* glsl */`
  precision highp float;
  varying vec2 vUv;

  uniform vec2  uRes;         // viewport size in pixels
  uniform float uTime;        // accumulated seconds
  uniform float uSpeed;       // swirl rotation speed  (GSAP driven)
  uniform float uIntro;       // orb scale  0.7→1.0    (GSAP driven)
  uniform float uOpen;        // portal expansion 0→1  (GSAP driven)
  uniform float uAlpha;       // overall alpha 0→1     (GSAP driven)

  uniform vec3  uPrimary;     // (old)
  
  uniform vec3  uBody;        // base fill
  uniform vec3  uBodyEdge;    // base fill edge
  uniform vec3  uStreak;      // main streaks
  uniform vec3  uAccent;      // secondary streaks & flecks
  uniform vec3  uRimA;        // rim gradient start
  uniform vec3  uRimB;        // rim gradient end
  uniform vec3  uHalo;        // outer glow
  uniform vec3  uCore;        // center glow

  uniform float uDensity;
  uniform float uSwirl;
  uniform float uBrightness;
  uniform float uOrbSize;

  const float PI  = 3.14159265359;
  const float TAU = 6.28318530718;

  /* ── Value noise (no textures) ─────────────────────────────────────── */
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),              hash(i + vec2(1,0)), u.x),
      mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x),
      u.y
    );
  }

  void main() {
    /* Pixel-space coordinates, centred */
    vec2 p = (vUv - 0.5) * uRes;

    /* Orb radius in pixels — matches CSS clamp(180px, 26vmin, 300px) / 2 */
    float vmin  = min(uRes.x, uRes.y);
    float baseR = clamp(uOrbSize * vmin, 90.0, 150.0);

    /* Scale: intro grows orb in, open expands it away */
    float totalR = baseR * uIntro * (1.0 + uOpen * 5.5);

    float dist = length(p);
    float r    = dist / totalR;          // 0 = centre, 1 = orb edge

    /* ── Twisted angle ───────────────────────────────────────────────── */
    float a     = atan(p.y, p.x);
    /* Twist is strongest at centre, zero at rim — creates vortex convergence */
    float twist = (1.0 - clamp(r, 0.0, 1.0)) * uSwirl;
    float a2    = a + twist + uTime * uSpeed;

    /* Map twisted angle to a [0,1] repeating coordinate */
    float aNorm = fract(a2 / TAU);

    /* ── Streak noise (two octaves for richer texture) ───────────────── */
    float angF  = 13.0 * uDensity;   /* angular frequency → how many streaks */
    float radF  = 2.8;               /* radial frequency  → streak length     */
    float flow  = 0.35;              /* radial scroll speed                   */

    float t = uTime * uSpeed;

    float n  = valueNoise(vec2(aNorm * angF,
                               r    * radF  - t * flow));
    float n2 = valueNoise(vec2(aNorm * angF * 2.1 + 4.7,
                               r    * radF  * 1.7 - t * flow * 1.4))
               * 0.45;

    float nSum = clamp(n + n2, 0.0, 1.0);

    /* Threshold: smoothstep creates sharp slash-like slices */
    float thresh      = 0.72 / uDensity;
    float streakRaw   = smoothstep(thresh, thresh + 0.14, nSum);

    /* Fade: dark core, fade before rim so streaks live in the middle belt */
    float coreFade    = smoothstep(0.0,  0.30, r);
    float rimFade     = 1.0 - smoothstep(0.68, 0.86, r);
    float streakI     = streakRaw * coreFade * rimFade;

    /* ── Sparse bright flecks (hash-based, no loop) ──────────────────── */
    vec2 fGrid  = floor(vec2(aNorm * 55.0, r * 18.0));
    float fRnd  = hash(fGrid + vec2(floor(t * 1.5), 0.0));
    float fleck = step(0.965, fRnd)
                * smoothstep(0.12, 0.55, r)
                * (1.0 - smoothstep(0.55, 0.72, r));

    /* ── Rim — ragged inner edge driven by streak noise ─────────────── */
    float rimI  = 0.80 - nSum * 0.07 * uDensity;   /* ragged inner start */
    float rimO  = 1.00;
    float rim   = smoothstep(rimI, rimI + 0.05, r)
                * (1.0 - smoothstep(rimO - 0.015, rimO + 0.005, r));

    /* ── Outer halo (soft blue glow, bleeds slightly outside orb) ────── */
    float halo  = exp(-max(0.0, r - 0.94) * 5.5)
                * (1.0 - smoothstep(1.0, 1.45, r));

    /* ── Alpha mask ──────────────────────────────────────────────────── */
    float innerA = 1.0 - smoothstep(0.94, 1.03, r);  /* sharp orb cutoff   */
    float haloA  = halo * 0.35;                      /* 35% alpha for halo */
    float fragA  = clamp(innerA + haloA, 0.0, 1.0) * uAlpha;

    /* ── Compose colour ──────────────────────────────────────────────── */
    /* Base body fill inside the orb */
    vec3 col = mix(uBody, uBodyEdge, clamp(r, 0.0, 1.0)) * innerA;

    /* Streaks: luminous streakColor mixed with accentColor, no white mix */
    col += mix(uStreak, uAccent, nSum * 0.5) * streakI * 1.5;

    /* Accent flecks */
    col += uAccent * fleck * 0.8;

    /* Rim: soft gradient between rimColorA and rimColorB, intensity <= 0.8, no hard white */
    float rimGradient = (sin(aNorm * TAU) + 1.0) * 0.5; // 0 to 1
    col += mix(uRimA, uRimB, rimGradient) * rim * 0.8;

    /* Core: subtle glow in the center */
    float coreGlow = exp(-r * 6.0) * 0.6;
    col += uCore * coreGlow;

    /* Halo: haloColor */
    col += uHalo * halo;

    col *= uBrightness;

    /* Clamp maximum luminance to avoid pure white (max ~0.75) */
    col = min(col, vec3(0.75));

    gl_FragColor = vec4(col, fragA);
  }
`;

/* ── Inner R3F scene ──────────────────────────────────────────────────────── */
interface PortalSceneProps {
  config:   PortalConfig;
  stateRef: { current: PortalState };
}

function PortalScene({ config, stateRef }: PortalSceneProps) {
  const matRef    = useRef<THREE.ShaderMaterial>(null!);
  const { size }  = useThree();

  const uniforms = useMemo(() => ({
    uRes:        { value: new THREE.Vector2(size.width, size.height) },
    uTime:       { value: 0 },
    uSpeed:      { value: 0.35 },
    uIntro:      { value: 0.7 },
    uOpen:       { value: 0.0 },
    uAlpha:      { value: 0.0 },
    uBody:       { value: new THREE.Color(config.bodyColor) },
    uBodyEdge:   { value: new THREE.Color(config.bodyEdge) },
    uStreak:     { value: new THREE.Color(config.streakColor) },
    uAccent:     { value: new THREE.Color(config.accentColor) },
    uRimA:       { value: new THREE.Color(config.rimColorA) },
    uRimB:       { value: new THREE.Color(config.rimColorB) },
    uHalo:       { value: new THREE.Color(config.haloColor) },
    uCore:       { value: new THREE.Color(config.coreColor) },
    uDensity:    { value: config.density },
    uSwirl:      { value: config.swirl },
    uBrightness: { value: config.brightness },
    uOrbSize:    { value: config.orbSize },
  // config props are module-level constants — safe to initialise once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  /* Keep resolution in sync with canvas size changes / window resize */
  useEffect(() => {
    if (matRef.current) {
      matRef.current.uniforms.uRes.value.set(size.width, size.height);
    }
  }, [size]);

  /* Per-frame: advance time and push GSAP-driven animation values to uniforms */
  useFrame((_, delta) => {
    if (!matRef.current) return;
    const s = stateRef.current;
    if (!s) return;   // guard: stateRef not yet populated (HMR / first render race)
    const u = matRef.current.uniforms;

    u.uTime.value  += delta;
    u.uSpeed.value  = s.speed;
    u.uIntro.value  = s.intro;
    u.uOpen.value   = s.open;
    u.uAlpha.value  = s.alpha;
    /* Keep resolution fresh (cheap to set every frame) */
    u.uRes.value.set(size.width, size.height);
  });

  return (
    /*
     * Full-screen clip-space plane.
     * frustumCulled=false prevents the camera from skipping it when
     * the plane's bounds don't intersect the view frustum exactly.
     */
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ── Exported canvas wrapper ──────────────────────────────────────────────── */
export interface PortalShaderProps {
  config:   PortalConfig;
  stateRef: { current: PortalState };
  onReady?: () => void;
}

export function PortalShader({ config, stateRef, onReady }: PortalShaderProps) {
  const calledReady = useRef(false);

  return (
    /*
     * Fills the parent div completely.
     * pointer-events-none so scroll events pass through to Lenis/GSAP.
     */
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Canvas
        /*
         * Orthographic-ish: camera at z=1 looking at origin, plane at z=0.
         * Because the VERT shader ignores the projection matrix (uses gl_Position
         * = vec4(position, 1.0) directly), camera settings don't matter — but
         * R3F needs a valid camera to initialise.
         */
        camera={{ position: [0, 0, 1], near: 0.1, far: 10 }}
        gl={{
          antialias:       false,   // not needed for a fullscreen quad
          alpha:           true,    // transparent canvas so bg div shows through
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}             // cap DPR to 1.5 for GPU budget
        style={{ width: '100%', height: '100%' }}
        onCreated={({ gl }) => {
          /*
           * Mark the canvas so we can identify and confirm disposal later.
           * R3F handles WebGL context teardown on unmount automatically.
           */
          gl.domElement.setAttribute('data-portal-shader', 'true');
          if (onReady && !calledReady.current) {
            calledReady.current = true;
            onReady();
          }
        }}
      >
        <PortalScene config={config} stateRef={stateRef} />
      </Canvas>
    </div>
  );
}
