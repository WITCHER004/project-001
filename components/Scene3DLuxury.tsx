"use client";

import { Canvas } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField } from "@react-three/postprocessing";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useDeviceCapability, PerformanceTier } from "@/hooks/useDeviceCapability";
import { useLateNightMode } from "@/hooks/useLateNightMode";

/* ------------------------------------------------------------------ */
/*  Tiered performance budget                                          */
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
  low: { chips: 8, cokes: 6, popcorn: 5, dust: 10, shadows: false, bloom: false, depthOfField: false, environment: false, geometryDetail: "low", dprRange: [1, 1] },
  medium: { chips: 16, cokes: 12, popcorn: 8, dust: 24, shadows: true, bloom: true, depthOfField: false, environment: true, geometryDetail: "low", dprRange: [1, 1.5] },
  high: { chips: 30, cokes: 25, popcorn: 15, dust: 50, shadows: true, bloom: true, depthOfField: true, environment: true, geometryDetail: "high", dprRange: [1, 2] },
};

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
  landed: boolean;
  landSlotX: number;
  landSlotZ: number;
}

const CHIP_COLORS = ["#FF8C00", "#FFA500", "#FFB84D"].map((c) => new THREE.Color(c));

function spawnParticle(kind: ParticleKind): Omit<ParticleState, "rotation" | "swayPhase" | "landed" | "landSlotX" | "landSlotZ"> {
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
  return Array.from({ length: count }, (_, i) => {
    const base = spawnParticle(kind);
    return {
      ...base,
      originX: base.position.x,
      rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
      swayPhase: Math.random() * Math.PI * 2,
      landed: false,
      // Deterministic per-particle slot so a "stack" reads as intentional
      // rather than a random pile once particles start landing on the tray.
      landSlotX: ((i % 6) - 2.5) * 0.9,
      landSlotZ: (Math.floor(i / 6) % 4) * 0.7 - 1,
    };
  });
}

const dummy = new THREE.Object3D();

/* ------------------------------------------------------------------ */
/*  Narrative landing tray                                             */
/*                                                                      */
/*  scrollLanding goes 0 -> 1 over the first ~120vh of scroll. At 0,    */
/*  particles behave exactly as before (fall, wrap, loop forever). As   */
/*  it approaches 1, the "floor" rises from off-screen into view and    */
/*  particles that hit it stop and settle into a per-particle slot,     */
/*  building a small stacked pile on a tray instead of disappearing —   */
/*  the "chips landing" narrative beat.                                 */
/* ------------------------------------------------------------------ */
function InstancedFallingField({
  kind,
  count,
  castShadow,
  geometryDetail,
  scrollLandingRef,
}: {
  kind: ParticleKind;
  count: number;
  castShadow: boolean;
  geometryDetail: "low" | "high";
  scrollLandingRef: React.MutableRefObject<number>;
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
    const landing = scrollLandingRef.current; // 0..1
    const trayY = THREE.MathUtils.lerp(-15, -3.4, landing); // floor rises as you scroll

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      if (p.landed) {
        // Settled: hold position, keep a very slow idle rotation so the pile
        // still reads as "alive" rather than frozen.
        p.rotation.y += p.rotationSpeed.y * 0.1 * delta;
        // If the user scrolls back up past the landing threshold, release it.
        if (landing < 0.1) p.landed = false;
      } else {
        p.position.y -= p.velocity.y * delta;
        p.position.x += p.velocity.x * delta;
        p.position.z += p.velocity.z * delta;

        p.rotation.x += p.rotationSpeed.x * delta;
        p.rotation.y += p.rotationSpeed.y * delta;
        p.rotation.z += p.rotationSpeed.z * delta;

        if (p.swayAmount > 0) {
          p.position.x += Math.sin(t * p.swaySpeed + p.swayPhase) * p.swayAmount * delta * 60;
        }

        if (p.position.y < trayY) {
          if (landing > 0.15 && kind !== "dust") {
            // Land on the tray in its assigned slot instead of looping.
            p.position.set(p.landSlotX, trayY + 0.15, p.landSlotZ);
            p.velocity.set(0, 0, 0);
            p.landed = true;
          } else {
            // Old behaviour: loop back to the top.
            p.position.y = 12;
            p.position.x = p.originX;
          }
        }
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
      case "chip": return <boxGeometry args={[0.8, 0.1, 0.6]} />;
      case "coke": return <cylinderGeometry args={[0.3, 0.35, 1.2, segLow ? 8 : 16]} />;
      case "popcorn": return <sphereGeometry args={[0.25, segLow ? 8 : 16, segLow ? 8 : 16]} />;
      case "dust":
      default: return <sphereGeometry args={[0.1, segLow ? 6 : 8, segLow ? 6 : 8]} />;
    }
  }, [kind, geometryDetail]);

  const materialProps = useMemo(() => {
    switch (kind) {
      case "chip": return { color: "#ffffff", roughness: 0.3, metalness: 0.4, emissive: "#C9A227", emissiveIntensity: 0.35 };
      case "coke": return { color: "#8B3A3A", roughness: 0.2, metalness: 0.3, emissive: "#5c2626", emissiveIntensity: 0.3 };
      case "popcorn": return { color: "#E8D9B0", roughness: 0.5, metalness: 0, emissive: "#C9A227", emissiveIntensity: 0.25 };
      case "dust":
      default: return { color: "#C9A227", emissive: "#C9A227", emissiveIntensity: 0.5, transparent: true, opacity: 0.6 };
    }
  }, [kind]);

  if (count <= 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow={castShadow} receiveShadow={castShadow}>
      {geometry}
      <meshStandardMaterial {...materialProps} />
    </instancedMesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Scroll tracking (outside the R3F tree — window belongs there)      */
/* ------------------------------------------------------------------ */
function useScrollSignals() {
  const rotationProgress = useRef(0); // full-document 0..1, drives parallax
  const landingProgress = useRef(0); // 0..1 over first 1.2 viewport heights
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      rotationProgress.current = max > 0 ? window.scrollY / max : 0;
      landingProgress.current = THREE.MathUtils.clamp(window.scrollY / (window.innerHeight * 1.2), 0, 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return { rotationProgress, landingProgress };
}

function ScrollParallaxGroup({
  children,
  disabled,
  rotationProgress,
}: {
  children: React.ReactNode;
  disabled: boolean;
  rotationProgress: React.MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (disabled || !groupRef.current) return;
    const targetY = rotationProgress.current * 0.35;
    const targetX = rotationProgress.current * -0.12;
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetY, 4, delta);
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetX, 4, delta);
  });
  return <group ref={groupRef}>{children}</group>;
}

function CinematicScene({
  budget,
  reducedMotion,
  rotationProgress,
  landingProgress,
  lateNight,
}: {
  budget: SceneBudget;
  reducedMotion: boolean;
  rotationProgress: React.MutableRefObject<number>;
  landingProgress: React.MutableRefObject<number>;
  lateNight: boolean;
}) {
  // Late-night: dimmer, warmer light instead of the crisp daytime rig.
  const ambientIntensity = lateNight ? 0.32 : 0.6;
  const keyIntensity = lateNight ? 1.0 : 1.8;
  const keyColor = lateNight ? "#F3D9A0" : "#ffffff";
  const rimA = lateNight ? "#8B3A3A" : "#C9A227";
  const rimB = lateNight ? "#5c2c14" : "#8B3A3A";

  return (
    <ScrollParallaxGroup disabled={reducedMotion} rotationProgress={rotationProgress}>
      <InstancedFallingField kind="chip" count={budget.chips} castShadow={budget.shadows} geometryDetail={budget.geometryDetail} scrollLandingRef={landingProgress} />
      <InstancedFallingField kind="coke" count={budget.cokes} castShadow={budget.shadows} geometryDetail={budget.geometryDetail} scrollLandingRef={landingProgress} />
      <InstancedFallingField kind="popcorn" count={budget.popcorn} castShadow={budget.shadows} geometryDetail={budget.geometryDetail} scrollLandingRef={landingProgress} />
      <InstancedFallingField kind="dust" count={budget.dust} castShadow={false} geometryDetail={budget.geometryDetail} scrollLandingRef={landingProgress} />

      {/* Floating tray — the invisible collision plane made just barely visible
          so landed items look intentional, not like they're floating in space. */}
      <mesh position={[0, -3.5, -1]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.2, 48]} />
        <meshStandardMaterial color="#16130F" roughness={0.4} metalness={0.6} transparent opacity={0.5} />
      </mesh>

      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={keyIntensity}
        color={keyColor}
        castShadow={budget.shadows}
        shadow-mapSize-width={budget.shadows ? 1024 : undefined}
        shadow-mapSize-height={budget.shadows ? 1024 : undefined}
      />
      <pointLight position={[-10, 8, -5]} intensity={lateNight ? 0.6 : 1.2} color={rimA} />
      <pointLight position={[10, 8, -5]} intensity={lateNight ? 0.4 : 0.8} color={rimB} />
      <pointLight position={[0, 5, -10]} intensity={0.5} color="#2E2717" />
      <pointLight position={[5, 10, 8]} intensity={lateNight ? 0.35 : 0.7} color="#C9A227" />
    </ScrollParallaxGroup>
  );
}

export default function Scene3DUltraCinematic() {
  const { tier, isDetecting, isMobile, prefersReducedMotion, maxDpr } = useDeviceCapability();
  const lateNight = useLateNightMode();
  const { rotationProgress, landingProgress } = useScrollSignals();

  if (isDetecting) return null;

  const budget = TIER_BUDGET[tier];

  // Explicit mobile knockdown, independent of the heuristic tier score —
  // a mid-range phone can still land on "medium" but shouldn't be asked to
  // run bloom + depth-of-field + shadows at once.
  const mobileBudget: SceneBudget = isMobile
    ? {
        ...budget,
        chips: Math.round(budget.chips * 0.5),
        cokes: Math.round(budget.cokes * 0.5),
        popcorn: Math.round(budget.popcorn * 0.5),
        dust: Math.round(budget.dust * 0.4),
        shadows: false,
        bloom: false,
        depthOfField: false,
        dprRange: [1, 1],
      }
    : budget;

  const effectiveBudget: SceneBudget = prefersReducedMotion
    ? { ...mobileBudget, chips: 0, cokes: 0, popcorn: 0, dust: Math.min(mobileBudget.dust, 10), bloom: false, depthOfField: false }
    : mobileBudget;

  const dprCeiling = Math.min(effectiveBudget.dprRange[1], maxDpr);

  return (
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
        <CinematicScene
          budget={effectiveBudget}
          reducedMotion={prefersReducedMotion}
          rotationProgress={rotationProgress}
          landingProgress={landingProgress}
          lateNight={lateNight}
        />

        {(effectiveBudget.bloom || effectiveBudget.depthOfField) && (
          <EffectComposer>
            {effectiveBudget.bloom ? (
              <Bloom intensity={lateNight ? 1.0 : 1.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
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
        <fog attach="fog" args={[lateNight ? "#0B0A08" : "#16130F", 5, 50]} />
      </Suspense>
    </Canvas>
  );
}
