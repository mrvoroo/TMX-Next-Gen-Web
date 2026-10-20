'use client';

/**
 * Portfolio hero scene: a faceted glass crystal with project screens inside.
 *
 * progressRef (0 → 1, written by the hero's ScrollTrigger) is read in
 * useFrame only — no React state per frame. The crystal is one mesh made of
 * prism shards (precomputed at mount); shard vertices are rewritten on the
 * CPU whenever progress changes, so the transmission material renders a
 * single extra pass regardless of the shard count.
 *
 * Everything is generated locally: no HDRIs, models, fonts or remote textures.
 */

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
  useTexture,
} from '@react-three/drei';
import * as THREE from 'three';

const ACCENT_FROM = '#7c3aed';
const ACCENT_TO = '#06b6d4';
const MAX_TILT = THREE.MathUtils.degToRad(12);

export type CrystalQuality = 'high' | 'low';

export interface CrystalSceneProps {
  progressRef: { current: number };
  quality: CrystalQuality;
  /** false = reduced motion: static crystal, progress ignored. */
  animated: boolean;
  frameloop: 'always' | 'demand' | 'never';
  /** Same-origin image URLs for the inner screens (may be empty). */
  images: string[];
  /** Called after the canvas is created and after textures load. */
  onReady: () => void;
}

const CONFIG = {
  high: {
    subdivide: true,
    particles: 1500,
    screens: 4,
    scale: 0.72,
    shardDistance: 7,
    cameraZ: 7,
    fov: 40,
    dpr: [1, 1.75] as [number, number],
    envResolution: 256,
  },
  low: {
    subdivide: false,
    particles: 400,
    screens: 3,
    scale: 0.85,
    shardDistance: 5.5,
    cameraZ: 8.5,
    fov: 45,
    dpr: [1, 1.5] as [number, number],
    envResolution: 128,
  },
} as const;

const CAMERA_END_Z = -3;
const CRYSTAL_Y = 0.35;

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (e0: number, e1: number, v: number) => {
  const t = clamp01((v - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

type Tri = [THREE.Vector3, THREE.Vector3, THREE.Vector3];

/** Orients a triangle so its normal points away from `center`. */
function orient(tri: Tri, center: THREE.Vector3): Tri {
  const [a, b, c] = tri;
  const n = new THREE.Vector3()
    .subVectors(b, a)
    .cross(new THREE.Vector3().subVectors(c, a));
  const mid = new THREE.Vector3().add(a).add(b).add(c).divideScalar(3);
  return n.dot(mid.sub(center)) < 0 ? [a, c, b] : tri;
}

/** 24-facet elongated gem: top apex, two staggered rings, bottom apex. */
function crystalFacets(rand: () => number): Tri[] {
  const n = 6;
  const jitter = () => (rand() - 0.5) * 0.12;
  const top = new THREE.Vector3(jitter(), 1.75, jitter());
  const bottom = new THREE.Vector3(jitter(), -1.6, jitter());
  const upper: THREE.Vector3[] = [];
  const lower: THREE.Vector3[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const b = ((i + 0.5) / n) * Math.PI * 2;
    const ru = 1.0 + jitter();
    const rl = 1.18 + jitter();
    upper.push(new THREE.Vector3(Math.cos(a) * ru, 0.6 + jitter(), Math.sin(a) * ru));
    lower.push(new THREE.Vector3(Math.cos(b) * rl, -0.3 + jitter(), Math.sin(b) * rl));
  }
  const origin = new THREE.Vector3();
  const tris: Tri[] = [];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    tris.push(orient([top, upper[i], upper[j]], origin));
    tris.push(orient([upper[i], upper[j], lower[i]], origin));
    tris.push(orient([upper[j], lower[j], lower[i]], origin));
    tris.push(orient([bottom, lower[i], lower[j]], origin));
  }
  return tris;
}

function subdivide(tris: Tri[]): Tri[] {
  const out: Tri[] = [];
  for (const [a, b, c] of tris) {
    const ab = a.clone().lerp(b, 0.5);
    const bc = b.clone().lerp(c, 0.5);
    const ca = c.clone().lerp(a, 0.5);
    out.push([a, ab, ca], [ab, b, bc], [ca, bc, c], [ab, bc, ca]);
  }
  return out;
}

/* ── Shards ──────────────────────────────────────────────────────────────── */

const VERTS_PER_SHARD = 24; // 8 triangles: outer, inner, 3 side quads
const INNER_SCALE = 0.42;

interface ShardData {
  count: number;
  rest: Float32Array; // vertex positions relative to the shard centroid
  restNormal: Float32Array;
  centroid: Float32Array;
  dir: Float32Array;
  axis: Float32Array;
  spin: Float32Array;
  speed: Float32Array;
  delay: Float32Array;
  drift: Float32Array;
}

function buildShards(facets: Tri[], rand: () => number) {
  const count = facets.length;
  const data: ShardData = {
    count,
    rest: new Float32Array(count * VERTS_PER_SHARD * 3),
    restNormal: new Float32Array(count * VERTS_PER_SHARD * 3),
    centroid: new Float32Array(count * 3),
    dir: new Float32Array(count * 3),
    axis: new Float32Array(count * 3),
    spin: new Float32Array(count),
    speed: new Float32Array(count),
    delay: new Float32Array(count),
    drift: new Float32Array(count),
  };
  const position = new Float32Array(count * VERTS_PER_SHARD * 3);
  const normal = new Float32Array(count * VERTS_PER_SHARD * 3);

  const ab = new THREE.Vector3();
  const ac = new THREE.Vector3();
  const n = new THREE.Vector3();

  facets.forEach(([a, b, c], s) => {
    const a2 = a.clone().multiplyScalar(INNER_SCALE);
    const b2 = b.clone().multiplyScalar(INNER_SCALE);
    const c2 = c.clone().multiplyScalar(INNER_SCALE);
    const center = new THREE.Vector3()
      .add(a).add(b).add(c).add(a2).add(b2).add(c2)
      .divideScalar(6);

    const tris: Tri[] = [
      [a, b, c],
      [a2, c2, b2],
      [a, a2, b], [b, a2, b2],
      [b, b2, c], [c, b2, c2],
      [c, c2, a], [a, c2, a2],
    ].map((t) => orient(t as Tri, center));

    tris.forEach((tri, t) => {
      ab.subVectors(tri[1], tri[0]);
      ac.subVectors(tri[2], tri[0]);
      n.crossVectors(ab, ac).normalize();
      tri.forEach((v, k) => {
        const i = (s * VERTS_PER_SHARD + t * 3 + k) * 3;
        data.rest[i] = v.x - center.x;
        data.rest[i + 1] = v.y - center.y;
        data.rest[i + 2] = v.z - center.z;
        data.restNormal[i] = n.x;
        data.restNormal[i + 1] = n.y;
        data.restNormal[i + 2] = n.z;
        position[i] = v.x;
        position[i + 1] = v.y;
        position[i + 2] = v.z;
        normal[i] = n.x;
        normal[i + 1] = n.y;
        normal[i + 2] = n.z;
      });
    });

    const outward = new THREE.Vector3()
      .subVectors(b, a)
      .cross(new THREE.Vector3().subVectors(c, a))
      .normalize();
    const axis = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize();
    data.centroid.set([center.x, center.y, center.z], s * 3);
    data.dir.set([outward.x, outward.y, outward.z], s * 3);
    data.axis.set([axis.x, axis.y, axis.z], s * 3);
    data.spin[s] = (1.2 + rand() * 2.4) * (rand() < 0.5 ? -1 : 1);
    data.speed[s] = 0.75 + rand() * 0.55;
    data.delay[s] = rand() * 0.12;
    data.drift[s] = 0.6 + rand() * 1.4;
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(normal, 3));
  return { geometry, data };
}

/* Scratch objects for the per-frame shard update (one hero at a time). */
const _q = new THREE.Quaternion();
const _axis = new THREE.Vector3();
const _v = new THREE.Vector3();

function writeShards(geometry: THREE.BufferGeometry, d: ShardData, p: number, distance: number) {
  const pos = geometry.attributes.position.array as Float32Array;
  const nor = geometry.attributes.normal.array as Float32Array;
  const shrink = 1 - smooth(0.72, 0.98, p);

  for (let s = 0; s < d.count; s++) {
    const t = clamp01((p - d.delay[s]) / (1 - d.delay[s]));
    const e = t * t * (3 - 2 * t);
    const reach = e * distance * d.speed[s];
    const s3 = s * 3;
    const ox = d.centroid[s3] + d.dir[s3] * reach;
    const oy = d.centroid[s3 + 1] + d.dir[s3 + 1] * reach;
    const oz = d.centroid[s3 + 2] + d.dir[s3 + 2] * reach + e * d.drift[s];
    _axis.set(d.axis[s3], d.axis[s3 + 1], d.axis[s3 + 2]);
    _q.setFromAxisAngle(_axis, d.spin[s] * e);

    for (let v = 0; v < VERTS_PER_SHARD; v++) {
      const i = (s * VERTS_PER_SHARD + v) * 3;
      _v.set(d.rest[i], d.rest[i + 1], d.rest[i + 2])
        .multiplyScalar(shrink)
        .applyQuaternion(_q);
      pos[i] = _v.x + ox;
      pos[i + 1] = _v.y + oy;
      pos[i + 2] = _v.z + oz;
      _v.set(d.restNormal[i], d.restNormal[i + 1], d.restNormal[i + 2]).applyQuaternion(_q);
      nor[i] = _v.x;
      nor[i + 1] = _v.y;
      nor[i + 2] = _v.z;
    }
  }
  geometry.attributes.position.needsUpdate = true;
  geometry.attributes.normal.needsUpdate = true;
}

/* ── Inner screens ───────────────────────────────────────────────────────── */

const SCREEN_W = 0.78;
const SCREEN_H = SCREEN_W / 1.6;

const SCREEN_LAYOUT: { pos: [number, number, number]; rotY: number }[] = [
  { pos: [-0.3, 0.55, 0.18], rotY: 0.28 },
  { pos: [0.3, 0.05, -0.12], rotY: -0.32 },
  { pos: [-0.18, -0.48, 0.22], rotY: 0.18 },
  { pos: [0.24, 0.85, -0.3], rotY: -0.22 },
];

function roundedRectGeometry(w: number, h: number, r: number) {
  const shape = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  const geometry = new THREE.ShapeGeometry(shape, 6);
  const pos = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) - x) / w, (pos.getY(i) - y) / h);
  }
  return geometry;
}

/** object-fit: cover for a texture on a SCREEN_W × SCREEN_H plane. */
function coverTexture(texture: THREE.Texture) {
  const img = texture.image as { width?: number; height?: number } | undefined;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  if (!img?.width || !img?.height) return;
  const imgAspect = img.width / img.height;
  const planeAspect = SCREEN_W / SCREEN_H;
  if (imgAspect > planeAspect) {
    texture.repeat.set(planeAspect / imgAspect, 1);
    texture.offset.set((1 - texture.repeat.x) / 2, 0);
  } else {
    texture.repeat.set(1, imgAspect / planeAspect);
    texture.offset.set(0, 1 - texture.repeat.y);
  }
}

function Screens({
  maps,
  count,
  progressRef,
  animated,
}: {
  maps: THREE.Texture[];
  count: number;
  progressRef: { current: number };
  animated: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const geometry = useMemo(() => roundedRectGeometry(SCREEN_W, SCREEN_H, 0.05), []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group) return;
    const p = animated ? progressRef.current : 0;
    const e = smooth(0, 0.85, p);
    const fade = 1 - smooth(0.65, 0.92, p);
    const time = clock.elapsedTime;
    group.children.forEach((child, i) => {
      const [x, y, z] = SCREEN_LAYOUT[i].pos;
      const bob = animated ? Math.sin(time * 0.6 + i * 1.7) * 0.05 : 0;
      child.position.set(
        x * (1 + e * 3.2) + Math.sign(x) * e * 1.6,
        y * (1 + e * 2.4) + bob,
        z + e * 1.8,
      );
      child.rotation.set(e * 0.6 * (i % 2 ? 1 : -1), SCREEN_LAYOUT[i].rotY * (1 + e * 2), 0);
      child.scale.setScalar(Math.max(0.001, fade));
      // Opaque at rest: three's transmission pass only samples opaque objects.
      const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      material.transparent = fade < 0.999;
      material.opacity = fade;
      child.visible = fade > 0.001;
    });
  });

  return (
    <group ref={groupRef}>
      {SCREEN_LAYOUT.slice(0, count).map((slot, i) => (
        <mesh key={i} geometry={geometry} position={slot.pos} rotation={[0, slot.rotY, 0]}>
          <meshBasicMaterial
            map={maps[i % maps.length]}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function TexturedScreens({
  urls,
  onLoaded,
  ...rest
}: {
  urls: string[];
  onLoaded: () => void;
  count: number;
  progressRef: { current: number };
  animated: boolean;
}) {
  const invalidate = useThree((s) => s.invalidate);
  const textures = useTexture(urls, (loaded) => {
    (Array.isArray(loaded) ? loaded : [loaded]).forEach(coverTexture);
    invalidate();
    onLoaded();
  });

  useEffect(
    () => () => {
      textures.forEach((t) => t.dispose());
      useTexture.clear(urls);
    },
    [textures, urls],
  );

  return <Screens maps={textures} {...rest} />;
}

function GradientScreens(props: {
  count: number;
  progressRef: { current: number };
  animated: boolean;
}) {
  const map = useMemo(() => {
    const from = new THREE.Color(ACCENT_FROM);
    const to = new THREE.Color(ACCENT_TO);
    const texture = new THREE.DataTexture(
      new Uint8Array([
        from.r * 255, from.g * 255, from.b * 255, 255,
        to.r * 255, to.g * 255, to.b * 255, 255,
      ]),
      2,
      1,
    );
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }, []);
  useEffect(() => () => map.dispose(), [map]);

  return <Screens maps={[map]} {...props} />;
}

/* ── Particles ───────────────────────────────────────────────────────────── */

function Particles({ count, animated }: { count: number; animated: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const geometry = useMemo(() => new THREE.OctahedronGeometry(1, 0), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  );
  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const rand = mulberry32(7);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const pos = new THREE.Vector3();
    const scale = new THREE.Vector3();
    const color = new THREE.Color();
    const from = new THREE.Color(ACCENT_FROM);
    const to = new THREE.Color(ACCENT_TO);
    for (let i = 0; i < count; i++) {
      do {
        pos.set((rand() - 0.5) * 22, (rand() - 0.5) * 14, -18 + rand() * 24);
      } while (pos.lengthSq() < 6);
      scale.setScalar(0.012 + rand() * 0.03);
      m.compose(pos, q, scale);
      mesh.setMatrixAt(i, m);
      color.copy(from).lerp(to, rand()).multiplyScalar(0.6 + rand() * 0.8);
      mesh.setColorAt(i, color);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [count]);

  useFrame((_, delta) => {
    if (animated && meshRef.current) meshRef.current.rotation.y += delta * 0.015;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      frustumCulled={false}
    />
  );
}

/* ── Background glow ─────────────────────────────────────────────────────── */

const GLOW_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const GLOW_FRAGMENT = /* glsl */ `
uniform vec3 uBase;
uniform vec3 uA;
uniform vec3 uB;
varying vec2 vUv;
void main() {
  vec2 p = vUv - 0.5;
  p.x *= 1.6;
  float a = 1.0 - smoothstep(0.0, 0.36, length(p - vec2(-0.06, 0.04)));
  float b = 1.0 - smoothstep(0.0, 0.3, length(p - vec2(0.09, -0.05)));
  vec3 col = uBase + uA * a * a * 0.42 + uB * b * b * 0.3;
  gl_FragColor = vec4(col, 1.0);
}`;

function GlowPlane() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: GLOW_VERTEX,
        fragmentShader: GLOW_FRAGMENT,
        depthWrite: false,
        uniforms: {
          uBase: { value: new THREE.Vector3(5 / 255, 5 / 255, 8 / 255) },
          uA: { value: new THREE.Vector3(124 / 255, 58 / 255, 237 / 255) },
          uB: { value: new THREE.Vector3(6 / 255, 182 / 255, 212 / 255) },
        },
      }),
    [],
  );
  const geometry = useMemo(() => new THREE.PlaneGeometry(50, 30), []);
  useEffect(
    () => () => {
      material.dispose();
      geometry.dispose();
    },
    [material, geometry],
  );
  return (
    <mesh geometry={geometry} material={material} position={[0, 0, -12]} renderOrder={-1} />
  );
}

/* ── Crystal ─────────────────────────────────────────────────────────────── */

function Crystal({
  quality,
  progressRef,
  animated,
}: {
  quality: CrystalQuality;
  progressRef: { current: number };
  animated: boolean;
}) {
  const cfg = CONFIG[quality];
  const meshRef = useRef<THREE.Mesh>(null);
  const lastProgress = useRef(-1);

  const shards = useMemo(() => {
    const rand = mulberry32(42);
    const facets = crystalFacets(rand);
    return buildShards(cfg.subdivide ? subdivide(facets) : facets, rand);
  }, [cfg.subdivide]);
  useEffect(() => () => shards.geometry.dispose(), [shards]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    if (animated) mesh.rotation.y += delta * 0.12;
    const p = animated ? clamp01(progressRef.current) : 0;
    if (p === lastProgress.current) return;
    lastProgress.current = p;
    writeShards(mesh.geometry, shards.data, p, cfg.shardDistance);
    // The transmission pass checks material.visible, not mesh.visible.
    const visible = p < 0.995;
    mesh.visible = visible;
    (mesh.material as THREE.Material).visible = visible;
  });

  return (
    <mesh
      ref={meshRef}
      geometry={shards.geometry}
      rotation={[0.08, 0.4, 0]}
      frustumCulled={false}
    >
      {quality === 'high' ? (
        <MeshTransmissionMaterial
          samples={6}
          resolution={512}
          transmission={1}
          thickness={0.55}
          roughness={0.03}
          ior={1.3}
          chromaticAberration={0.04}
          anisotropicBlur={0.04}
          distortion={0.05}
          distortionScale={0.3}
          temporalDistortion={0.03}
          clearcoat={0.6}
          clearcoatRoughness={0.1}
          envMapIntensity={0.85}
          color="#f4f1ff"
        />
      ) : (
        <meshPhysicalMaterial
          transmission={1}
          thickness={0.6}
          roughness={0.08}
          ior={1.3}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1.3}
          color="#f4f1ff"
        />
      )}
    </mesh>
  );
}

/* ── Rig: idle rotation, cursor tilt, camera dolly ───────────────────────── */

function Rig({
  quality,
  progressRef,
  animated,
  children,
}: {
  quality: CrystalQuality;
  progressRef: { current: number };
  animated: boolean;
  children: React.ReactNode;
}) {
  const cfg = CONFIG[quality];
  const fitRef = useRef<THREE.Group>(null);
  const tiltRef = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!animated) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [animated]);

  useFrame(({ camera, size }, delta) => {
    const fit = fitRef.current;
    const tilt = tiltRef.current;
    if (!fit || !tilt) return;

    // Narrow viewports: shrink the crystal so it fits horizontally.
    fit.scale.setScalar(cfg.scale * Math.min(1, Math.max(0.75, size.width / size.height / 1.15)));

    const p = animated ? clamp01(progressRef.current) : 0;
    const dolly = p * p * (3 - 2 * p);
    camera.position.z = cfg.cameraZ + (CAMERA_END_Z - cfg.cameraZ) * dolly;

    if (!animated) return;
    const k = 1 - Math.exp(-delta * 4);
    tilt.rotation.x += (pointer.current.y * MAX_TILT - tilt.rotation.x) * k;
    tilt.rotation.y += (pointer.current.x * MAX_TILT - tilt.rotation.y) * k;
  });

  return (
    <group ref={fitRef} position={[0, CRYSTAL_Y, 0]}>
      <group ref={tiltRef}>{children}</group>
    </group>
  );
}

/* ── Canvas ──────────────────────────────────────────────────────────────── */

export function CrystalScene({
  progressRef,
  quality,
  animated,
  frameloop,
  images,
  onReady,
}: CrystalSceneProps) {
  const cfg = CONFIG[quality];
  const screenProps = { count: cfg.screens, progressRef, animated };

  return (
    <Canvas
      frameloop={frameloop}
      dpr={cfg.dpr}
      camera={{ position: [0, 0, cfg.cameraZ], fov: cfg.fov, near: 0.1, far: 60 }}
      gl={{
        antialias: quality === 'high',
        alpha: true,
        powerPreference: 'high-performance',
      }}
      onCreated={() => onReady()}
    >
      <GlowPlane />
      <Environment resolution={cfg.envResolution} frames={1}>
        <Lightformer form="rect" intensity={4.5} color={ACCENT_FROM} position={[-4, 1.5, 2]} scale={[3, 7, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={5} color={ACCENT_TO} position={[4, -1, 2]} scale={[3, 7, 1]} target={[0, 0, 0]} />
        <Lightformer form="ring" intensity={2} color="#ffffff" position={[0, 4, 4]} scale={2} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2} color={ACCENT_FROM} position={[0, -3, -5]} scale={[8, 2, 1]} target={[0, 0, 0]} />
      </Environment>
      <pointLight position={[-3, 2, 3]} intensity={18} color={ACCENT_FROM} />
      <pointLight position={[3, -1.5, 3]} intensity={14} color={ACCENT_TO} />

      <Particles count={cfg.particles} animated={animated} />

      <Rig quality={quality} progressRef={progressRef} animated={animated}>
        <Crystal quality={quality} progressRef={progressRef} animated={animated} />
        {images.length > 0 ? (
          <Suspense fallback={null}>
            <TexturedScreens urls={images} onLoaded={onReady} {...screenProps} />
          </Suspense>
        ) : (
          <GradientScreens {...screenProps} />
        )}
      </Rig>
    </Canvas>
  );
}
