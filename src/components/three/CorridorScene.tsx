'use client';

/**
 * Desktop /portfolio stage: the crystal hero canvas extended by a light
 * corridor. Each project is a giant curved screen (inner face of a partial
 * cylinder) along −z; the camera path and the active project come from
 * corridorPath.ts, driven by corridorRef.u (written by the page's
 * ScrollTrigger) and read in useFrame only.
 */

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshReflectorMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { CrystalScene, type CrystalSceneProps } from './CrystalScene';
import {
  VIEW_DISTANCE,
  activeIndex,
  cameraZ,
  corridorBlend,
  finalCameraZ,
  screenZ,
  smoothRange,
} from './corridorPath';

const ACCENT_FROM = '#7c3aed';
const ACCENT_TO = '#06b6d4';

export type CorridorAccent = 'violet' | 'cyan' | 'mixed';

export interface CorridorProject {
  /** Same-origin image URL. */
  src: string;
  width: number;
  height: number;
  accent: CorridorAccent;
}

export interface CorridorSceneProps
  extends Pick<CrystalSceneProps, 'progressRef' | 'frameloop' | 'images' | 'onReady'> {
  corridorRef: { current: { u: number } };
  projects: CorridorProject[];
}

/* ── Layout ──────────────────────────────────────────────────────────────── */

const FLOOR_Y = -2.05;
const FRAME_W = 14;
const FRAME_H = 6.9;
const FRAME_LINE = 0.045;
const FRAME_STEP = 4;
const FRAME_START_Z = -6;
const FAR_PADDING = 28;

const SCREEN_W = 4.4;
const SCREEN_RADIUS = 7;
const ACTIVE_POS = new THREE.Vector3(1.2, 0.3, 0);
const WALL_X = 4.6;
const WALL_Y = 0.55;
const WALL_YAW = 0.85;
const WAVE_SECONDS = 1.1;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function accentColors(accent: CorridorAccent): [THREE.Color, THREE.Color] {
  const from = new THREE.Color(ACCENT_FROM);
  const to = new THREE.Color(ACCENT_TO);
  if (accent === 'violet') return [from, from.clone()];
  if (accent === 'cyan') return [to, to.clone()];
  return [from, to];
}

/* ── Curved screens ──────────────────────────────────────────────────────── */

const SCREEN_VERTEX = /* glsl */ `
#include <fog_pars_vertex>
uniform mat3 uUvTransform;
varying vec2 vUv;
varying vec2 vMapUv;
void main() {
  // The cylinder's u runs right → left when seen from inside.
  vUv = vec2(1.0 - uv.x, uv.y);
  vMapUv = (uUvTransform * vec3(vUv, 1.0)).xy;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;

const SCREEN_FRAGMENT = /* glsl */ `
#include <fog_pars_fragment>
uniform sampler2D uMap;
uniform float uActive;
uniform float uWave;
uniform float uAspect;
uniform vec3 uAccentA;
uniform vec3 uAccentB;
varying vec2 vUv;
varying vec2 vMapUv;
void main() {
  vec2 halfSize = vec2(uAspect, 1.0) * 0.5;
  vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
  float r = 0.035;
  vec2 q = abs(p) - (halfSize - r);
  float dist = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  if (dist > 0.0) discard;
  float inside = -dist;

  vec3 accent = mix(uAccentA, uAccentB, vUv.x);
  vec3 col = texture2D(uMap, vMapUv).rgb * mix(0.26, 1.0, uActive);

  float rim = 1.0 - smoothstep(0.0, 0.012, inside);
  float halo = 1.0 - smoothstep(0.0, 0.16, inside);
  col = mix(col, accent * 1.5, rim * (0.3 + 0.7 * uActive));
  col += accent * halo * halo * 0.28 * uActive;

  float x = vUv.x + (vUv.y - 0.5) * 0.3;
  float front = mix(-0.3, 1.3, uWave);
  float band = exp(-pow((x - front) / 0.08, 2.0)) * sin(3.14159265 * uWave);
  col += mix(vec3(1.0), accent, 0.45) * band * 0.6;

  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
  #include <fog_fragment>
}`;

function curvedScreenGeometry(width: number, height: number) {
  const theta = width / SCREEN_RADIUS;
  const geometry = new THREE.CylinderGeometry(
    SCREEN_RADIUS,
    SCREEN_RADIUS,
    height,
    48,
    1,
    true,
    Math.PI - theta / 2,
    theta,
  );
  // Surface centre at the local origin, curving towards the viewer.
  geometry.translate(0, 0, SCREEN_RADIUS);
  return geometry;
}

interface ScreenSlot {
  geometry: THREE.CylinderGeometry;
  material: THREE.ShaderMaterial;
}

function buildScreen(project: CorridorProject, map: THREE.Texture): ScreenSlot {
  const imageAspect = project.width / project.height;
  // Very tall or very wide shots are cropped (top-aligned) to a usable frame.
  const aspect = Math.min(2.4, Math.max(1.2, imageAspect));
  const height = SCREEN_W / aspect;
  const uvTransform = new THREE.Matrix3();
  if (imageAspect > aspect) {
    const rx = aspect / imageAspect;
    uvTransform.setUvTransform((1 - rx) / 2, 0, rx, 1, 0, 0, 0);
  } else {
    const ry = imageAspect / aspect;
    uvTransform.setUvTransform(0, 1 - ry, 1, ry, 0, 0, 0);
  }
  const [a, b] = accentColors(project.accent);
  const material = new THREE.ShaderMaterial({
    vertexShader: SCREEN_VERTEX,
    fragmentShader: SCREEN_FRAGMENT,
    side: THREE.DoubleSide,
    fog: true,
    uniforms: {
      ...THREE.UniformsUtils.clone(THREE.UniformsLib.fog),
      uMap: { value: map },
      uUvTransform: { value: uvTransform },
      uActive: { value: 0 },
      uWave: { value: 1 },
      uAspect: { value: aspect },
      uAccentA: { value: a },
      uAccentB: { value: b },
    },
  });
  return { geometry: curvedScreenGeometry(SCREEN_W, height), material };
}

function CurvedScreens({
  projects,
  maps,
  corridorRef,
}: {
  projects: CorridorProject[];
  maps: THREE.Texture[];
  corridorRef: { current: { u: number } };
}) {
  const groupRef = useRef<THREE.Group>(null);
  const lastActive = useRef(0);
  const waveStart = useRef<number[]>([]);

  const slots = useMemo(
    () => projects.map((project, i) => buildScreen(project, maps[i])),
    [projects, maps],
  );
  useEffect(
    () => () =>
      slots.forEach(({ geometry, material }) => {
        geometry.dispose();
        material.dispose();
      }),
    [slots],
  );

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group) return;
    const n = projects.length;
    const camZ = cameraZ(corridorRef.current.u, n);
    const t = clock.elapsedTime;
    const active = activeIndex(camZ, n);
    if (active !== lastActive.current) {
      lastActive.current = active;
      waveStart.current[active] = t;
    }

    group.children.forEach((child, i) => {
      const z = screenZ(i);
      const act = 1 - smoothRange(0.6, 3.6, Math.abs(camZ - z - VIEW_DISTANCE));
      const side = i % 2 ? 1 : -1;
      child.position.set(
        lerp(side * WALL_X, ACTIVE_POS.x, act),
        lerp(WALL_Y, ACTIVE_POS.y, act),
        z,
      );
      child.rotation.y = lerp(-side * WALL_YAW, 0, act);
      child.scale.setScalar(lerp(0.9, 1, act));
      const uniforms = slots[i].material.uniforms;
      uniforms.uActive.value = act;
      const start = waveStart.current[i];
      uniforms.uWave.value = start === undefined ? 1 : Math.min(1, (t - start) / WAVE_SECONDS);
    });
  });

  return (
    <group ref={groupRef}>
      {slots.map(({ geometry, material }, i) => (
        <mesh key={i} geometry={geometry} material={material} position={[0, 0, screenZ(i)]} />
      ))}
    </group>
  );
}

function isLocal(src: string) {
  return src.startsWith('/') && !src.startsWith('//');
}

function screenUrl(src: string) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=1920&q=75`;
}

function TexturedCorridorScreens({
  projects,
  corridorRef,
  onReady,
}: {
  projects: CorridorProject[];
  corridorRef: { current: { u: number } };
  onReady: () => void;
}) {
  const gl = useThree((s) => s.gl);
  const urls = useMemo(
    () => projects.filter((p) => isLocal(p.src)).map((p) => screenUrl(p.src)),
    [projects],
  );
  const loaded = useTexture(urls);
  const fallback = useMemo(() => {
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
    texture.needsUpdate = true;
    return texture;
  }, []);

  const maps = useMemo(() => {
    let next = 0;
    return projects.map((p) => (isLocal(p.src) ? loaded[next++] : fallback));
  }, [projects, loaded, fallback]);

  const prepared = useRef<THREE.Texture[] | null>(null);
  useLayoutEffect(() => {
    if (prepared.current === loaded) return;
    prepared.current = loaded;
    const anisotropy = gl.capabilities.getMaxAnisotropy();
    loaded.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = anisotropy;
      texture.needsUpdate = true;
    });
    onReady();
  }, [gl, loaded, onReady]);

  useEffect(
    () => () => {
      loaded.forEach((t) => t.dispose());
      fallback.dispose();
      useTexture.clear(urls);
    },
    [loaded, fallback, urls],
  );

  return <CurvedScreens projects={projects} maps={maps} corridorRef={corridorRef} />;
}

/* ── Light frames ────────────────────────────────────────────────────────── */

function frameGeometry() {
  const w = FRAME_W / 2;
  const h = FRAME_H / 2;
  const i = FRAME_LINE;
  const shape = new THREE.Shape()
    .moveTo(-w, -h)
    .lineTo(w, -h)
    .lineTo(w, h)
    .lineTo(-w, h)
    .lineTo(-w, -h);
  shape.holes.push(
    new THREE.Path()
      .moveTo(-w + i, -h + i)
      .lineTo(-w + i, h - i)
      .lineTo(w - i, h - i)
      .lineTo(w - i, -h + i)
      .lineTo(-w + i, -h + i),
  );
  const geometry = new THREE.ShapeGeometry(shape);
  const pos = geometry.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const from = new THREE.Color(ACCENT_FROM);
  const to = new THREE.Color(ACCENT_TO);
  const c = new THREE.Color();
  for (let v = 0; v < pos.count; v++) {
    c.copy(from).lerp(to, (pos.getX(v) + w) / FRAME_W).multiplyScalar(1.35);
    colors.set([c.r, c.g, c.b], v * 3);
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geometry;
}

function LightFrames({ farZ }: { farZ: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = Math.ceil((FRAME_START_Z - farZ) / FRAME_STEP);
  const geometry = useMemo(() => frameGeometry(), []);
  const material = useMemo(
    () => new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false, fog: true }),
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
    const m = new THREE.Matrix4();
    for (let i = 0; i < count; i++) {
      m.makeTranslation(0, FLOOR_Y + FRAME_H / 2, FRAME_START_Z - i * FRAME_STEP);
      mesh.setMatrixAt(i, m);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [count]);

  return <instancedMesh ref={meshRef} args={[geometry, material, count]} />;
}

/* ── Floor ───────────────────────────────────────────────────────────────── */

function ReflectiveFloor({ farZ }: { farZ: number }) {
  const length = FRAME_START_Z + 4 - farZ;
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, FLOOR_Y, FRAME_START_Z + 4 - length / 2]}>
      <planeGeometry args={[FRAME_W + 4, length]} />
      <MeshReflectorMaterial
        resolution={512}
        blur={[240, 70]}
        mixBlur={0.8}
        // Multiplies the (near-black) floor colour: 30 still reads as a faint sheen.
        mixStrength={30}
        mixContrast={1}
        roughness={1}
        metalness={0.4}
        color="#101018"
      />
    </mesh>
  );
}

/* ── Corridor ────────────────────────────────────────────────────────────── */

function Corridor({
  projects,
  progressRef,
  corridorRef,
  onReady,
}: {
  projects: CorridorProject[];
  progressRef: { current: number };
  corridorRef: { current: { u: number } };
  onReady: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const floorOn = useRef(false);
  // The reflector renders the scene every frame, so it only exists while visible.
  const [floor, setFloor] = useState(false);
  const farZ = finalCameraZ(projects.length) - FAR_PADDING;

  useFrame(() => {
    const visible = corridorBlend(progressRef.current, corridorRef.current.u) > 0;
    if (groupRef.current) groupRef.current.visible = visible;
    if (visible !== floorOn.current) {
      floorOn.current = visible;
      setFloor(visible);
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <LightFrames farZ={farZ} />
      {floor && <ReflectiveFloor farZ={farZ} />}
      <Suspense fallback={null}>
        <TexturedCorridorScreens projects={projects} corridorRef={corridorRef} onReady={onReady} />
      </Suspense>
    </group>
  );
}

export function CorridorScene({
  progressRef,
  corridorRef,
  projects,
  frameloop,
  images,
  onReady,
}: CorridorSceneProps) {
  const stage = useMemo(
    () => ({
      state: corridorRef,
      count: projects.length,
      children: (
        <Corridor
          projects={projects}
          progressRef={progressRef}
          corridorRef={corridorRef}
          onReady={onReady}
        />
      ),
    }),
    [corridorRef, projects, progressRef, onReady],
  );

  return (
    <CrystalScene
      progressRef={progressRef}
      quality="high"
      animated
      frameloop={frameloop}
      images={images}
      onReady={onReady}
      stage={stage}
    />
  );
}