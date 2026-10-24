'use client';

/**
 * Stylised e-bike built from primitives (no model files, no HDR – zero
 * external requests). Frame colour is live-configurable. The render loop
 * only runs while the canvas is on screen.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

type V = [number, number, number];

function Tube({ a, b, r, color, metal = 0.6, rough = 0.35 }: { a: V; b: V; r: number; color: string; metal?: number; rough?: number }) {
  const { position, quaternion, length } = useMemo(() => {
    const va = new THREE.Vector3(...a);
    const vb = new THREE.Vector3(...b);
    const dir = new THREE.Vector3().subVectors(vb, va);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return { position: va.add(vb).multiplyScalar(0.5), quaternion: q, length: dir.length() };
  }, [a, b]);
  return (
    <mesh position={position} quaternion={quaternion} castShadow>
      <cylinderGeometry args={[r, r, length, 20]} />
      <meshStandardMaterial color={color} metalness={metal} roughness={rough} />
    </mesh>
  );
}

function Wheel({ x, spin }: { x: number; spin: React.RefObject<number> }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z -= dt * spin.current;
  });
  return (
    <group position={[x, 0, 0]} ref={ref}>
      <mesh castShadow>
        <torusGeometry args={[0.7, 0.075, 18, 64]} />
        <meshStandardMaterial color="#111114" roughness={0.85} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.6, 0.025, 10, 64]} />
        <meshStandardMaterial color="#c9ccd2" metalness={0.9} roughness={0.25} />
      </mesh>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} rotation={[0, 0, (i / 12) * Math.PI]}>
          <boxGeometry args={[1.18, 0.012, 0.012]} />
          <meshStandardMaterial color="#9aa0a8" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.14, 24]} />
        <meshStandardMaterial color="#2a2b30" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Bike({ color, reduced }: { color: string; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef(reduced ? 0 : 1.4);
  useFrame((state, dt) => {
    if (!group.current || reduced) return;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.04;
    group.current.rotation.y += dt * 0.18;
  });
  const P = {
    rear: [-1.1, 0, 0] as V,
    bb: [-0.12, -0.02, 0] as V,
    seat: [-0.38, 1.02, 0] as V,
    headTop: [0.72, 1.05, 0] as V,
    headBot: [0.82, 0.62, 0] as V,
    front: [1.1, 0, 0] as V,
  };
  const dark = '#1b1c20';
  return (
    <group ref={group} rotation={[0, -0.55, 0]}>
      <Wheel x={-1.1} spin={spin} />
      <Wheel x={1.1} spin={spin} />
      {/* frame */}
      <Tube a={P.bb} b={P.headBot} r={0.085} color={color} />
      <Tube a={P.seat} b={P.headTop} r={0.05} color={color} />
      <Tube a={P.bb} b={P.seat} r={0.055} color={color} />
      <Tube a={[-1.1, 0, 0.07]} b={[P.bb[0], P.bb[1], 0.07]} r={0.03} color={color} />
      <Tube a={[-1.1, 0, -0.07]} b={[P.bb[0], P.bb[1], -0.07]} r={0.03} color={color} />
      <Tube a={[-1.1, 0, 0.07]} b={[P.seat[0], P.seat[1] - 0.06, 0.03]} r={0.026} color={color} />
      <Tube a={[-1.1, 0, -0.07]} b={[P.seat[0], P.seat[1] - 0.06, -0.03]} r={0.026} color={color} />
      <Tube a={P.headBot} b={P.headTop} r={0.065} color={color} />
      {/* fork */}
      <Tube a={[P.headBot[0], P.headBot[1], 0.06]} b={[1.1, 0, 0.07]} r={0.032} color={dark} />
      <Tube a={[P.headBot[0], P.headBot[1], -0.06]} b={[1.1, 0, -0.07]} r={0.032} color={dark} />
      {/* battery on down tube */}
      <Tube a={[0.0, 0.12, 0]} b={[0.62, 0.58, 0]} r={0.11} color={dark} metal={0.3} rough={0.5} />
      {/* motor */}
      <mesh position={P.bb} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.17, 0.17, 0.2, 32]} />
        <meshStandardMaterial color={dark} metalness={0.6} roughness={0.35} />
      </mesh>
      {/* seat post + saddle */}
      <Tube a={P.seat} b={[-0.45, 1.3, 0]} r={0.028} color="#2a2b30" />
      <mesh position={[-0.47, 1.34, 0]} castShadow>
        <boxGeometry args={[0.42, 0.07, 0.17]} />
        <meshStandardMaterial color="#141416" roughness={0.7} />
      </mesh>
      {/* stem + bar */}
      <Tube a={P.headTop} b={[0.62, 1.32, 0]} r={0.03} color="#2a2b30" />
      <Tube a={[0.6, 1.32, -0.36]} b={[0.6, 1.32, 0.36]} r={0.024} color="#2a2b30" />
      <Tube a={[0.6, 1.32, 0.36]} b={[0.6, 1.32, 0.48]} r={0.034} color="#111" metal={0} rough={0.9} />
      <Tube a={[0.6, 1.32, -0.36]} b={[0.6, 1.32, -0.48]} r={0.034} color="#111" metal={0} rough={0.9} />
      {/* headlight */}
      <mesh position={[0.84, 0.86, 0]}>
        <sphereGeometry args={[0.055, 20, 20]} />
        <meshStandardMaterial color="#fffbe6" emissive="#fff2a8" emissiveIntensity={2} />
      </mesh>
      {/* crank + chainring */}
      <mesh position={[P.bb[0], P.bb[1], 0.13]}>
        <torusGeometry args={[0.15, 0.018, 8, 40]} />
        <meshStandardMaterial color="#c9ccd2" metalness={0.9} roughness={0.25} />
      </mesh>
    </group>
  );
}

export default function BikeCanvas({ color, reduced, label }: { color: string; reduced: boolean; label: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="h-full w-full" role="img" aria-label={label}>
      <Canvas
        shadows
        dpr={[1, 1.75]}
        frameloop={visible ? (reduced ? 'demand' : 'always') : 'never'}
        camera={{ position: [0, 0.9, 4.6], fov: 38 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 5, 4]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-4, 2, -3]} intensity={1.1} color="#9ab8ff" />
        <pointLight position={[0, 2, 3]} intensity={6} color={color} distance={7} />
        <group position={[0, -0.25, 0]}>
          <Bike color={color} reduced={reduced} />
        </group>
        <ContactShadows position={[0, -0.98, 0]} opacity={0.55} scale={7} blur={2.4} far={2} />
        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </div>
  );
}
