'use client';

import { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Gradient colour constants (match globals.css accent vars) ─────────────── */
const COL_A = new THREE.Color('#7c3aed'); // --color-accent-from
const COL_B = new THREE.Color('#06b6d4'); // --color-accent-to

/* ── Geometry builder (called once per isMobile change) ──────────────────── */
interface BuiltGeo {
  geo:       THREE.BufferGeometry;
  scattered: Float32Array; // random start positions (immutable)
  target:    Float32Array; // icosahedron edge positions (immutable)
}

function buildGeo(isMobile: boolean): BuiltGeo {
  // IcosahedronGeometry detail: 1 on mobile (120 edges), 2 on desktop (480 edges)
  const detail = isMobile ? 1 : 2;
  const radius = isMobile ? 1.4 : 2.0;

  const icosaGeo = new THREE.IcosahedronGeometry(radius, detail);
  const edgesGeo = new THREE.EdgesGeometry(icosaGeo);
  icosaGeo.dispose(); // only the edges are needed

  const targetArr = edgesGeo.attributes.position.array as Float32Array;
  const floatCount = targetArr.length; // numEdgeVerts * 3
  const numVerts   = floatCount / 3;

  // Target positions (copy — edgesGeo will be disposed)
  const target = new Float32Array(targetArr);

  // Compute Y range for gradient (loop, not spread, to avoid stack overflow)
  let minY = Infinity, maxY = -Infinity;
  for (let i = 0; i < numVerts; i++) {
    const y = target[i * 3 + 1];
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const yRange = maxY - minY || 1;

  // Per-vertex gradient colour (violet → cyan by Y position)
  const colorArr = new Float32Array(floatCount);
  const tmp = new THREE.Color();
  for (let i = 0; i < numVerts; i++) {
    const t = (target[i * 3 + 1] - minY) / yRange;
    tmp.copy(COL_A).lerp(COL_B, t);
    colorArr[i * 3]     = tmp.r;
    colorArr[i * 3 + 1] = tmp.g;
    colorArr[i * 3 + 2] = tmp.b;
  }

  // Random scatter positions (start state, immutable)
  const scatterR = radius * 3.5;
  const scattered = new Float32Array(floatCount);
  for (let i = 0; i < numVerts; i++) {
    scattered[i * 3]     = (Math.random() - 0.5) * scatterR * 2;
    scattered[i * 3 + 1] = (Math.random() - 0.5) * scatterR * 2;
    scattered[i * 3 + 2] = (Math.random() - 0.5) * scatterR * 2;
  }

  // Working positions (mutable, lerped each frame, starts at scattered)
  const working = new Float32Array(scattered);

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(working, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colorArr, 3));

  edgesGeo.dispose();
  return { geo, scattered, target };
}

/* ── R3F scene component ─────────────────────────────────────────────────── */
interface AssemblyProps {
  progressRef:  { current: number };
  reducedMotion: boolean;
  isMobile:      boolean;
}

function IcosahedronAssembly({ progressRef, reducedMotion, isMobile }: AssemblyProps) {
  const meshRef = useRef<THREE.LineSegments>(null!);
  const rotY    = useRef(0);
  const locked  = useRef(false); // tracks whether we already set target pos

  const { geo, scattered, target } = useMemo(
    () => buildGeo(isMobile),
    [isMobile],
  );

  // Dispose geometry on unmount (or when isMobile changes → useMemo rebuilds)
  useEffect(() => () => { geo.dispose(); }, [geo]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const rawP  = reducedMotion ? 1 : progressRef.current;
    const prog  = Math.max(0, Math.min(1, rawP));
    const pos   = geo.attributes.position.array as Float32Array;
    const n     = pos.length / 3;

    // ── Position lerp: scattered → target ─────────────────────────────
    if (prog >= 0.999) {
      // Lock to exact target once fully assembled (avoids float drift)
      if (!locked.current) {
        pos.set(target);
        geo.attributes.position.needsUpdate = true;
        locked.current = true;
      }
    } else {
      locked.current = false;
      // Ease-in-out-cubic for a satisfying snap at the end
      const t = prog < 0.5
        ? 4 * prog ** 3
        : 1 - (-2 * prog + 2) ** 3 / 2;

      for (let i = 0; i < n; i++) {
        const b        = i * 3;
        pos[b]         = scattered[b]     + (target[b]     - scattered[b])     * t;
        pos[b + 1]     = scattered[b + 1] + (target[b + 1] - scattered[b + 1]) * t;
        pos[b + 2]     = scattered[b + 2] + (target[b + 2] - scattered[b + 2]) * t;
      }
      geo.attributes.position.needsUpdate = true;
    }

    // ── Rotation: ramps in smoothly once the shape is mostly formed ────
    // Progress 0.6 → 0: 0 rad/s  |  progress 1.0 → 0.35 rad/s
    const assembleFactor = Math.max(0, (prog - 0.6) / 0.4);
    const rotSpeed = reducedMotion ? 0.18 : assembleFactor * 0.35;

    if (rotSpeed > 0) {
      rotY.current += delta * rotSpeed;
      meshRef.current.rotation.y = rotY.current;
      // Gentle X wobble for depth
      meshRef.current.rotation.x = Math.sin(rotY.current * 0.35) * 0.14;
    }
  });

  return (
    <lineSegments ref={meshRef} geometry={geo}>
      {/* vertexColors picks up the gradient colorArr set on geometry */}
      <lineBasicMaterial vertexColors transparent opacity={0.82} />
    </lineSegments>
  );
}

/* ── Exported canvas wrapper ──────────────────────────────────────────────── */
export interface IcosahedronSceneProps {
  progressRef:   { current: number };
  reducedMotion?: boolean;
  isMobile?:      boolean;
}

export function IcosahedronScene({
  progressRef,
  reducedMotion = false,
  isMobile      = false,
}: IcosahedronSceneProps) {
  return (
    // pointer-events-none so the canvas never captures scroll events
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, isMobile ? 5.5 : 7], fov: 50 }}
        gl={{
          antialias:        false,
          alpha:            true,
          powerPreference:  'high-performance',
        }}
        dpr={[1, isMobile ? 1 : 1.5]}
        style={{ width: '100%', height: '100%' }}
      >
        <IcosahedronAssembly
          progressRef={progressRef}
          reducedMotion={reducedMotion}
          isMobile={isMobile}
        />
      </Canvas>
    </div>
  );
}
