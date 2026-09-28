'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Config type ─────────────────────────────────────────────────────────── */
export interface PortalConfig {
  primaryColor:       string; // hex — outer ring colour
  secondaryColor:     string; // hex — inner ring colour
  centerColor:        string; // hex — glowing core
  background:         string; // hex — solid fill behind rings
  speed:              number; // tunnel scroll speed
  density:            number; // ring sharpness / multiplier
  layerCount:         number; // how many ring layers (clamped to MAX_LAYERS=16)
  scale:              number; // overall scale of the tunnel radius
  brightness:         number; // final luminance multiplier
  waveAmplitude:      number; // angular sine distortion amplitude
  waveFrequency:      number; // angular sine distortion frequency
  verticalDistortion: number; // ellipse squash on Y axis (1 = circle)
  depthIntensity:     number; // depth-fade speed
}

/* ── GLSL ─────────────────────────────────────────────────────────────────── */

/*
 * MAX_LAYERS is a compile-time constant so the GLSL loop has a fixed bound.
 * Any layerCount > MAX_LAYERS is silently clamped inside the shader.
 */
const MAX_LAYERS = 16;

const VERT = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */`
  precision mediump float;

  varying vec2 vUv;

  uniform float uTime;
  uniform float uAspect;
  uniform vec3  uPrimary;
  uniform vec3  uSecondary;
  uniform vec3  uCenter;
  uniform vec3  uBackground;
  uniform float uSpeed;
  uniform float uDensity;
  uniform float uLayerCount;
  uniform float uScale;
  uniform float uBrightness;
  uniform float uWaveAmplitude;
  uniform float uWaveFrequency;
  uniform float uVerticalDistortion;
  uniform float uDepthIntensity;

  const int MAX_LAYERS = ${MAX_LAYERS};
  const float PI  = 3.14159265359;
  const float TAU = 6.28318530718;

  void main() {
    /* Normalise UV to [-1, 1] centred, aspect-corrected so rings are circular */
    vec2 uv = (vUv - 0.5) * 2.0;
    uv.x *= uAspect;

    /* Apply vertical distortion (squash Y so tunnel feels taller on portrait) */
    uv.y /= max(0.01, uVerticalDistortion);

    /* Polar coords */
    float r     = length(uv) / uScale;
    float angle = atan(uv.y, uv.x);

    /* Running accumulator for all ring layers */
    vec3  col   = uBackground;
    float alpha = 0.0;

    for (int i = 0; i < MAX_LAYERS; i++) {
      if (float(i) >= uLayerCount) break;

      /* Each layer is a different "depth slice" that scrolls inward */
      float layer = float(i) / max(1.0, uLayerCount - 1.0);

      /* fract makes the layer recede cyclically — creates the infinite tunnel */
      float depth = fract(layer - uTime * uSpeed);

      /* Map depth [0,1] → ring radius in world space */
      float ringR = mix(1.8, 0.0, depth);

      /* Skip nearly-at-centre layers (avoids zero-radius artefacts) */
      if (ringR < 0.02) continue;

      /* Wave offset along the angle */
      float wave = sin(angle * uWaveFrequency + uTime * 0.6 + layer * TAU)
                   * uWaveAmplitude * 0.18;

      /* Signed distance from this ring */
      float dist  = abs(r - (ringR + wave));

      /* Soft glow falloff (gaussian-like) — uDensity controls sharpness */
      float ringW = max(0.005, 0.04 * (1.0 - depth * uDepthIntensity));
      float glow  = exp(-dist / ringW * uDensity);

      /* Colour interpolated by depth (deep = primary, shallow = secondary) */
      vec3 ringCol = mix(uPrimary, uSecondary, depth);

      /* Depth fade so distant rings are dimmer */
      float fade = mix(1.0, 0.2, depth);

      col   += ringCol * glow * fade;
      alpha += glow  * fade;
    }

    /* Soft glowing core */
    float coreDist = r / uScale;
    float core     = exp(-coreDist * 6.0) * 1.4;
    col  += uCenter * core;

    /* Final brightness clamp */
    col *= uBrightness;

    gl_FragColor = vec4(col, 1.0);
  }
`;

/* ── Uniforms builder ─────────────────────────────────────────────────────── */
function buildUniforms(cfg: PortalConfig) {
  const hex = (h: string) => new THREE.Color(h);
  return {
    uTime:               { value: 0 },
    uAspect:             { value: 1 },
    uPrimary:            { value: hex(cfg.primaryColor) },
    uSecondary:          { value: hex(cfg.secondaryColor) },
    uCenter:             { value: hex(cfg.centerColor) },
    uBackground:         { value: hex(cfg.background) },
    uSpeed:              { value: cfg.speed },
    uDensity:            { value: cfg.density },
    uLayerCount:         { value: Math.min(cfg.layerCount, MAX_LAYERS) },
    uScale:              { value: cfg.scale },
    uBrightness:         { value: cfg.brightness },
    uWaveAmplitude:      { value: cfg.waveAmplitude },
    uWaveFrequency:      { value: cfg.waveFrequency },
    uVerticalDistortion: { value: cfg.verticalDistortion },
    uDepthIntensity:     { value: cfg.depthIntensity },
  };
}

/* ── Inner R3F scene ──────────────────────────────────────────────────────── */
function PortalScene({ config }: { config: PortalConfig }) {
  const matRef  = useRef<THREE.ShaderMaterial>(null!);
  const { size } = useThree();

  /* Build uniforms once, update aspect when size changes */
  const uniforms = useMemo(() => buildUniforms(config), [config]);

  useEffect(() => {
    if (matRef.current) {
      matRef.current.uniforms.uAspect.value = size.width / Math.max(1, size.height);
    }
  }, [size]);

  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value  += delta;
      matRef.current.uniforms.uAspect.value =
        size.width / Math.max(1, size.height);
    }
  });

  return (
    /*
     * A single plane that covers clip space exactly (no projection needed).
     * position attribute runs from -1 to 1, matching NDC directly.
     * We disable frustum culling so it's never skipped.
     */
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ── Exported canvas wrapper ──────────────────────────────────────────────── */
export interface PortalShaderProps {
  config: PortalConfig;
  /** Called once when the GL context + first frame are ready */
  onReady?: () => void;
}

export function PortalShader({ config, onReady }: PortalShaderProps) {
  const calledReady = useRef(false);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 1], near: 0.1, far: 10 }}
        gl={{
          antialias:       false,
          alpha:           false,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
        style={{ width: '100%', height: '100%' }}
        onCreated={({ gl }) => {
          /*
           * Tell the browser this canvas can be discarded when unmounted.
           * Prevents "too many active WebGL contexts" and "context lost" warnings.
           */
          gl.domElement.setAttribute('data-portal-shader', 'true');
          if (onReady && !calledReady.current) {
            calledReady.current = true;
            onReady();
          }
        }}
      >
        <PortalScene config={config} />
      </Canvas>
    </div>
  );
}
