'use client';

import { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/*
 * Ambient particle network for the AI block.
 * Adapted from ParticleNetwork.tsx with lower intensity:
 *   - 60 particles (vs 110 in Hero)
 *   - Smaller connection threshold (1.9² vs 3.2²) → fewer, shorter lines
 *   - Slower velocity (0.005 vs 0.009) → calmer, more "thinking" feel
 *   - Lower material opacity → sits behind cards without competing
 */

const PARTICLE_COUNT  = 60;
const MAX_CONNECTIONS = 200;
const CONNECT_DIST_SQ = 1.9 * 1.9;
const BOUNDS_X = 7.0;
const BOUNDS_Y = 4.5;

interface AmbientNetworkProps {
  reducedMotion: boolean;
}

function AmbientNetwork({ reducedMotion }: AmbientNetworkProps) {
  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef  = useRef<THREE.LineSegments>(null!);
  const didInit   = useRef(false);

  const { particleGeo, lineGeo, velocities } = useMemo(() => {
    const positions  = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * BOUNDS_X * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * BOUNDS_Y * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      velocities[i * 3]     = (Math.random() - 0.5) * 0.005;  // 55 % slower than Hero
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    /* Pre-allocated line buffer — same discipline as ParticleNetwork.tsx */
    const linePositions = new Float32Array(MAX_CONNECTIONS * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setDrawRange(0, 0);

    return { particleGeo, lineGeo, velocities };
  }, []);

  useEffect(() => {
    return () => {
      particleGeo.dispose();
      lineGeo.dispose();
    };
  }, [particleGeo, lineGeo]);

  useFrame(() => {
    const pos = particleGeo.attributes.position.array as Float32Array;

    if (!reducedMotion) {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pos[i * 3]     += velocities[i * 3];
        pos[i * 3 + 1] += velocities[i * 3 + 1];
        if (pos[i * 3]     >  BOUNDS_X || pos[i * 3]     < -BOUNDS_X) velocities[i * 3]     *= -1;
        if (pos[i * 3 + 1] >  BOUNDS_Y || pos[i * 3 + 1] < -BOUNDS_Y) velocities[i * 3 + 1] *= -1;
      }
      particleGeo.attributes.position.needsUpdate = true;
    } else if (!didInit.current) {
      didInit.current = true;
    } else {
      return;
    }

    /* Rebuild connections */
    const lineBuf  = lineGeo.attributes.position.array as Float32Array;
    let lineCount  = 0;

    outer: for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = pos[i * 3], iy = pos[i * 3 + 1], iz = pos[i * 3 + 2];
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dx = ix - pos[j * 3];
        const dy = iy - pos[j * 3 + 1];
        if (dx * dx + dy * dy < CONNECT_DIST_SQ) {
          const base = lineCount * 6;
          lineBuf[base]     = ix; lineBuf[base + 1] = iy; lineBuf[base + 2] = iz;
          lineBuf[base + 3] = pos[j * 3]; lineBuf[base + 4] = pos[j * 3 + 1]; lineBuf[base + 5] = pos[j * 3 + 2];
          lineCount++;
          if (lineCount >= MAX_CONNECTIONS) break outer;
        }
      }
    }

    lineGeo.setDrawRange(0, lineCount * 2);
    lineGeo.attributes.position.needsUpdate = true;
  });

  return (
    <>
      <points ref={pointsRef} geometry={particleGeo}>
        <pointsMaterial size={0.04} color="#06b6d4" transparent opacity={0.5} sizeAttenuation />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeo}>
        <lineBasicMaterial color="#0891b2" transparent opacity={0.1} />
      </lineSegments>
    </>
  );
}

/* ── Exported canvas wrapper (lazy-loaded by AiBlock via next/dynamic) ───── */
export interface AiParticlesProps {
  reducedMotion?: boolean;
}

export function AiParticles({ reducedMotion = false }: AiParticlesProps) {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 58 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1]}
        style={{ width: '100%', height: '100%' }}
      >
        <AmbientNetwork reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
