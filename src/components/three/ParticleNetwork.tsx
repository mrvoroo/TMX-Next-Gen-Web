'use client';

import { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Constants ───────────────────────────────────────────────────────────── */
const PARTICLE_COUNT = 110;
const MAX_CONNECTIONS = 600;   // max line segments pre-allocated
const CONNECT_DIST_SQ = 3.2 * 3.2; // squared threshold (avoids sqrt per pair)
const BOUNDS_X = 7.5;
const BOUNDS_Y = 5.0;

/* ── Network scene ───────────────────────────────────────────────────────── */
interface NetworkProps {
  reducedMotion: boolean;
}

function Network({ reducedMotion }: NetworkProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef  = useRef<THREE.LineSegments>(null!);
  const didInit   = useRef(false);

  // Create Three.js geometries imperatively — never recreated
  const { particleGeo, lineGeo, velocities } = useMemo(() => {
    const positions  = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * BOUNDS_X * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * BOUNDS_Y * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
      velocities[i * 3]     = (Math.random() - 0.5) * 0.009;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.009;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3),
    );

    // Pre-allocate line buffer (MAX_CONNECTIONS pairs × 2 verts × 3 coords)
    const linePositions = new Float32Array(MAX_CONNECTIONS * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(linePositions, 3),
    );
    lineGeo.setDrawRange(0, 0);

    return { particleGeo, lineGeo, velocities };
  }, []);

  // Dispose on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      particleGeo.dispose();
      lineGeo.dispose();
    };
  }, [particleGeo, lineGeo]);

  useFrame(() => {
    const pos = particleGeo.attributes.position.array as Float32Array;

    // ── Move particles (skipped in reduced-motion after first frame) ──────
    if (!reducedMotion) {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pos[i * 3]     += velocities[i * 3];
        pos[i * 3 + 1] += velocities[i * 3 + 1];

        // Soft boundary bounce
        if (pos[i * 3]     >  BOUNDS_X || pos[i * 3]     < -BOUNDS_X) velocities[i * 3]     *= -1;
        if (pos[i * 3 + 1] >  BOUNDS_Y || pos[i * 3 + 1] < -BOUNDS_Y) velocities[i * 3 + 1] *= -1;
      }
      particleGeo.attributes.position.needsUpdate = true;
    } else if (!didInit.current) {
      // Reduced-motion: compute connections once on first frame, then stop
      didInit.current = true;
    } else {
      return; // nothing to update
    }

    // ── Rebuild connection lines ─────────────────────────────────────────
    const lineBuf = lineGeo.attributes.position.array as Float32Array;
    let lineCount = 0;

    outer: for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = pos[i * 3], iy = pos[i * 3 + 1], iz = pos[i * 3 + 2];
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dx = ix - pos[j * 3];
        const dy = iy - pos[j * 3 + 1];
        if (dx * dx + dy * dy < CONNECT_DIST_SQ) {
          const base = lineCount * 6;
          lineBuf[base]     = ix;
          lineBuf[base + 1] = iy;
          lineBuf[base + 2] = iz;
          lineBuf[base + 3] = pos[j * 3];
          lineBuf[base + 4] = pos[j * 3 + 1];
          lineBuf[base + 5] = pos[j * 3 + 2];
          lineCount++;
          if (lineCount >= MAX_CONNECTIONS) break outer;
        }
      }
    }

    lineGeo.setDrawRange(0, lineCount * 2); // 2 vertices per line segment
    lineGeo.attributes.position.needsUpdate = true;
  });

  return (
    <>
      {/* Dots */}
      <points ref={pointsRef} geometry={particleGeo}>
        <pointsMaterial
          size={0.055}
          color="#8b5cf6"
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>
      {/* Connection lines */}
      <lineSegments ref={linesRef} geometry={lineGeo}>
        <lineBasicMaterial color="#6d28d9" transparent opacity={0.2} />
      </lineSegments>
    </>
  );
}

/* ── Exported canvas wrapper (lazy-loaded via dynamic import) ────────────── */
export interface ParticleNetworkProps {
  reducedMotion?: boolean;
}

export function ParticleNetwork({ reducedMotion = false }: ParticleNetworkProps) {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 58 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
        style={{ width: '100%', height: '100%' }}
      >
        <Network reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
