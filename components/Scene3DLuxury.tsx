"use client";

import { Canvas } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField } from "@react-three/postprocessing";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useDeviceCapability, PerformanceTier } from "@/hooks/useDeviceCapability";

/* ------------------------------------------------------------------ */
/*  Tiered performance budget                                          */
/*                                                                      */
/*  Everything expensive in this scene (particle counts, shadows,      */
/*  post-processing) is driven from one table so the whole scene       */
/*  gracefully steps down on mobile / low-end GPUs instead of the      */
/*  fixed 30/25/15/50-particle + Bloom + DoF setup running everywhere. */
/* ------------------------------------------------------------------ */
interface SceneBudget {
  chips: number;
  cokes: number;
  popcorn: number;
  dust: number;
  shadows: boolean;
  bloom: boolean;
  depthOfField: boolean;
  environment: boolean;
  geometryDetail: "low" | "high";
  dprRange: [number, number];
}

const TIER_BUDGET: Record<PerformanceTier, SceneBudget> = {
  low: {
    chips: 8,
    cokes: 6,
    popcorn: 5,
    dust: 10,
    shadows: false,
    bloom: false,
    depthOfField: false,
    environment: false,
    geometryDetail: "low",
    dprRange: [1, 1],
  },
  medium: {
    chips: 16,
    cokes: 12,
    popcorn: 8,
    dust: 24,
    shadows: true,
    bloom: true,
    depthOfField: false,
    environment: true,
    geometryDetail: "low",
    dprRange: [1, 1.5],
  },
  high: {
    chips: 30,
    cokes: 25,
    popcorn: 15,
    dust: 50,
    shadows: true,
    bloom: true,
    depthOfField: true,
    environment: true,
    geometryDetail: "high",
    dprRange: [1, 2],
  },
};

/* ------------------------------------------------------------------ */
/*  Instanced falling particles                                        */
/*                                                                      */
/*  The original scene mounted one <mesh> + one useFrame per object    */
/*  (up to 120 of them). This collapses each category into a single    */
/*  InstancedMesh with one useFrame updating a shared matrix/array,    */
/*  which is what actually lets the particle counts above scale up     */
/*  on capable hardware without costing a draw call each.               */
/* ------------------------------------------------------------------ */
type ParticleKind = "chip" | "coke" | "popcorn" | "dust";

interface ParticleState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Euler;
  rotationSpeed: THREE.Vector3;
  scale: number;
  originX: number;
  swayPhase: number;
  swaySpeed: number;
  swayAmount: number;
  colorIndex: number;
}

const CHIP_COLORS = ["#FF8C00", "#FFA500", "#FFB84D"].map((c) => new THREE.Color(c));

function spawnParticle(kind: ParticleKind): Omit<ParticleState, "rotation" | "swayPhase"> {
  switch (kind) {
    case "chip":
      return {
        position: new THREE.Vector3(-15 + Math.random() * 3, 12 + Math.random() * 5, Math.random() * 8 - 4),
        velocity: new THREE.Vector3(3 + Math.random() * 2, 2.5 + Math.random() * 2.5, Math.random() * 1 - 0.5),
        rotationSpeed: new THREE.Vector3(Math.random() * 5, Math.random() * 5, Math.random() * 5),
        scale: 0.7 + Math.random() * 0.5,
        originX: 0,
        swaySpeed: 2,
        swayAmount: 0.02,
        colorIndex: Math.floor(Math.random() * CHIP_COLORS.length),
      };
    case "coke":
      return {
        position: new THREE.Vector3(15 - Math.random() * 3, 12 + Math.random() * 5, Math.random() * 8 - 4),
        velocity: new THREE.Vector3(-4 - Math.random() * 2, 3 + Math.random() * 2.5, Math.random() * 1 - 0.5),
        rotationSpeed: new THREE.Vector3(Math.random() * 3, Math.random() * 6, Math.random() * 3),
        scale: 0.6 + Math.random() * 0.3,
        originX: 0,
        swaySpeed: 1.5,
        swayAmount: 0.03,
        colorIndex: 0,
      };
    case "popcorn":
      return {
        position: new THREE.Vector3((Math.random() - 0.5) * 20, 12 + Math.random() * 5, Math.random() * 8 - 4),
        velocity: new THREE.Vector3((Math.random() - 0.5) * 2, 1.5 + Math.random() * 2, Math.random() * 0.5 - 0.25),
        rotationSpeed: new THREE.Vector3(Math.random() * 4, Math.random() * 4, Math.random() * 4),
        scale: 0.4 + Math.random() * 0.3,
        originX: 0,
        swaySpeed: 0,
        swayAmount: 0,
        colorIndex: 0,
      };
    case "dust":
    default:
      return {
        position: new THREE.Vector3((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 8),
        velocity: new THREE.Vector3(0, 0.3, 0),
        rotationSpeed: new THREE.Vector3(0.02, 0.03, 0),
        scale: 0.05 + Math.random() * 0.1,
        originX: 0,
        swaySpeed: 0,
        swayAmount: 0,
        colorIndex: 0,
      };
  }
}

function makeParticles(kind: ParticleKind, count: number): ParticleState[] {
  return Array.from({ length: count }, () => {
    const base = spawnParticle(kind);
    return {
      ...base,
      originX: base.position.x,
      rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
      swayPhase: Math.random() * Math.PI * 2,
    };
  });
}

const dummy = new THREE.Object3D();

function InstancedFallingField({
  kind,
  count,
  castShadow,
  geometryDetail,
}: {
  kind: ParticleKind;
  count: number;
  castShadow: boolean;
  geometryDetail: "low" | "high";
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particles = useMemo(() => makeParticles(kind, count), [kind, count]);

  useEffect(() => {
    if (!meshRef.current || kind !== "chip") return;
    particles.forEach((p, i) => meshRef.current!.setColorAt(i, CHIP_COLORS[p.colorIndex]));
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [particles, kind]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const t = state.clock.elapsedTime;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.position.y -= p.velocity.y * delta;
      p.position.x += p.velocity.x * delta;
      p.position.z += p.velocity.z * delta;

      p.rotation.x += p.rotationSpeed.x * delta;
      p.rotation.y += p.rotationSpeed.y * delta;
      p.rotation.z += p.rotationSpeed.z * delta;

      if (p.swayAmount > 0) {
        p.position.x += Math.sin(t * p.swaySpeed + p.swayPhase) * p.swayAmount * delta * 60;
      }

      if (p.position.y < -15) {
        p.position.y = 12;
        p.position.x = p.originX;
      }

      dummy.position.copy(p.position);
      dummy.rotation.copy(p.rotation);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  const geometry = useMemo(() => {
    const segLow = geometryDetail === "low";
    switch (kind) {
      case "chip":
        return <boxGeometry args={[0.8, 0.1, 0.6]} />;
      case "coke":
        return <cylinderGeometry args={[0.3, 0.35, 1.2, segLow ? 8 : 16]} />;
      case "popcorn":
        return <sphereGeometry args={[0.25, segLow ? 8 : 16, segLow ? 8 : 16]} />;
      case "dust":
      default:
        return <sphereGeometry args={[0.1, segLow ? 6 : 8, segLow ? 6 : 8]} />;
    }
  }, [kind, geometryDetail]);

  const materialProps = useMemo(() => {
    switch (kind) {
      case "chip":
        return { color: "#ffffff", roughness: 0.3, metalness: 0.4, emissive: "#FFA500", emissiveIntensity: 0.4 };
      case "coke":
        return { color: "#CC0000", roughness: 0.2, metalness: 0.3, emissive: "#990000", emissiveIntensity: 0.3 };
      case "popcorn":
        return { color: "#FFD700", roughness: 0.5, metalness: 0, emissive: "#FFA500", emissiveIntensity: 0.3 };
      case "dust":
      default:
        return { color: "#FFD700", emissive: "#FFD700", emissiveIntensity: 0.6, transparent: true, opacity: 0.7 };
    }
  }, [kind]);

  if (count <= 0) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      castShadow={castShadow}
      receiveShadow={castShadow}
    >
      {geometry}
      <meshStandardMaterial {...materialProps} />
    </instancedMesh>
  );
}

function CinematicScene({ budget }: { budget: SceneBudget }) {
  return (
    <group>
      <InstancedFallingField kind="chip" count={budget.chips} castShadow={budget.shadows} geometryDetail={budget.geometryDetail} />
      <InstancedFallingField kind="coke" count={budget.cokes} castShadow={budget.shadows} geometryDetail={budget.geometryDetail} />
      <InstancedFallingField kind="popcorn" count={budget.popcorn} castShadow={budget.shadows} geometryDetail={budget.geometryDetail} />
      <InstancedFallingField kind="dust" count={budget.dust} castShadow={false} geometryDetail={budget.geometryDetail} />

      {/* Professional lighting setup */}
      <ambientLight intensity={0.6} />

      <directionalLight
        position={[10, 15, 10]}
        intensity={1.8}
        color="#ffffff"
        castShadow={budget.shadows}
        shadow-mapSize-width={budget.shadows ? 1024 : undefined}
        shadow-mapSize-height={budget.shadows ? 1024 : undefined}
      />

      <pointLight position={[-10, 8, -5]} intensity={1.2} color="#FF8C00" />
      <pointLight position={[10, 8, -5]} intensity={0.8} color="#CC0000" />
      <pointLight position={[0, 5, -10]} intensity={0.6} color="#4A7BA7" />
      <pointLight position={[5, 10, 8]} intensity={0.7} color="#FFD700" />
    </group>
  );
}

export default function Scene3DUltraCinematic() {
  const { tier, isDetecting, prefersReducedMotion, maxDpr } = useDeviceCapability();
  const [blurIntensity, setBlurIntensity] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);
      const intensity = Math.min(scrollDelta / 6, 15);
      setBlurIntensity(intensity);
      lastScrollY = currentScrollY;

      setTimeout(() => {
        setBlurIntensity((prev) => Math.max(prev - 0.8, 0));
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isDetecting) return null;

  // Respect reduced-motion users the same way we respect low-end hardware:
  // a static, calm scene instead of a constant shower of falling objects.
  const budget = TIER_BUDGET[tier];
  const effectiveBudget: SceneBudget = prefersReducedMotion
    ? { ...budget, chips: 0, cokes: 0, popcorn: 0, dust: Math.min(budget.dust, 10), bloom: false, depthOfField: false }
    : budget;

  const dprCeiling = Math.min(effectiveBudget.dprRange[1], maxDpr);

  return (
    <div ref={canvasRef} className="relative w-full h-full overflow-hidden">
      <Canvas
        shadows={effectiveBudget.shadows}
        dpr={[effectiveBudget.dprRange[0], dprCeiling]}
        camera={{ position: [0, 0, 12], fov: 60 }}
        gl={{
          antialias: tier !== "low",
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <CinematicScene budget={effectiveBudget} />

          {(effectiveBudget.bloom || effectiveBudget.depthOfField) && (
            <EffectComposer>
              {effectiveBudget.bloom ? (
                <Bloom intensity={1.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
              ) : (
                <></>
              )}
              {effectiveBudget.depthOfField ? (
                <DepthOfField focusDistance={5} focalLength={0.02} bokehScale={6} />
              ) : (
                <></>
              )}
            </EffectComposer>
          )}

          {effectiveBudget.environment && <Environment preset="studio" />}
          <fog attach="fog" args={["#1a1a1a", 5, 50]} />
        </Suspense>
      </Canvas>

      {/* Dynamic blur overlay - intensifies on scroll (skipped on low tier: backdrop-filter is a GPU cost of its own) */}
      {tier !== "low" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backdropFilter: `blur(${blurIntensity}px)`,
            pointerEvents: "none",
            transition: "backdrop-filter 0.15s ease-out",
            zIndex: 10,
          }}
        />
      )}

      {/* Cinematic vignette effect */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />

      {/* Color grading overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(255,140,0,0.05) 0%, rgba(204,0,0,0.05) 100%)",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />
    </div>
  );
}
