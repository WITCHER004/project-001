"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField } from "@react-three/postprocessing";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mergeBufferGeometries, RoundedBoxGeometry } from "three-stdlib";
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
  swayPhase: number;
  swaySpeed: number;
  swayAmount: number;
  colorIndex: number;
  landed: boolean;
  landSlotX: number;
  landSlotZ: number;
}

const CHIP_COLORS = ["#FF8C00", "#FFA500", "#FFB84D"].map((c) => new THREE.Color(c));

/* ------------------------------------------------------------------ */
/*  PART 1 — spawn bounds derived from the *actual* viewport            */
/*                                                                      */
/*  Previously these were hardcoded world-space numbers (e.g. chips     */
/*  spawning at x: -15 to -12). At the camera's fixed distance, that     */
/*  range sits near the edge of a wide desktop frustum — but a portrait  */
/*  mobile frustum is much narrower, so that same x range was often      */
/*  entirely outside the visible area. `halfW` below comes from R3F's   */
/*  `viewport.width` (see ViewportBoundsProvider), which already        */
/*  accounts for the current FOV, aspect ratio and camera distance —    */
/*  so bounds computed from it are correct on any screen without having */
/*  to hand-tune per breakpoint.                                        */
/* ------------------------------------------------------------------ */
function spawnX(kind: ParticleKind, halfW: number): { x: number; vx: number } {
  switch (kind) {
    case "chip": {
      const x = -halfW - 1 - Math.random() * 1.5; // just off-screen left
      return { x, vx: 3 + Math.random() * 2 };
    }
    case "coke": {
      const x = halfW + 1 + Math.random() * 1.5; // just off-screen right
      return { x, vx: -4 - Math.random() * 2 };
    }
    case "popcorn": {
      // Centered spread across ~80% of the visible width, per the brief:
      // "particles fall directly in the center of a narrow mobile screen".
      const x = (Math.random() - 0.5) * halfW * 1.6;
      return { x, vx: (Math.random() - 0.5) * 2 };
    }
    case "dust":
    default: {
      const x = (Math.random() - 0.5) * halfW * 1.8;
      return { x, vx: 0 };
    }
  }
}

function spawnParticle(
  kind: ParticleKind,
  halfW: number
): Omit<ParticleState, "rotation" | "swayPhase" | "landed" | "landSlotX" | "landSlotZ"> {
  const { x, vx } = spawnX(kind, halfW);

  switch (kind) {
    case "chip":
      return {
        position: new THREE.Vector3(x, 12 + Math.random() * 5, Math.random() * 8 - 4),
        velocity: new THREE.Vector3(vx, 2.5 + Math.random() * 2.5, Math.random() * 1 - 0.5),
        rotationSpeed: new THREE.Vector3(Math.random() * 5, Math.random() * 5, Math.random() * 5),
        scale: 0.7 + Math.random() * 0.5,
        swaySpeed: 2,
        swayAmount: 0.02,
        colorIndex: Math.floor(Math.random() * CHIP_COLORS.length),
      };
    case "coke":
      return {
        position: new THREE.Vector3(x, 12 + Math.random() * 5, Math.random() * 8 - 4),
        velocity: new THREE.Vector3(vx, 3 + Math.random() * 2.5, Math.random() * 1 - 0.5),
        rotationSpeed: new THREE.Vector3(Math.random() * 3, Math.random() * 6, Math.random() * 3),
        scale: 0.6 + Math.random() * 0.3,
        swaySpeed: 1.5,
        swayAmount: 0.03,
        colorIndex: 0,
      };
    case "popcorn":
      return {
        position: new THREE.Vector3(x, 12 + Math.random() * 5, Math.random() * 8 - 4),
        velocity: new THREE.Vector3(vx, 1.5 + Math.random() * 2, Math.random() * 0.5 - 0.25),
        rotationSpeed: new THREE.Vector3(Math.random() * 4, Math.random() * 4, Math.random() * 4),
        scale: 0.4 + Math.random() * 0.3,
        swaySpeed: 0,
        swayAmount: 0,
        colorIndex: 0,
      };
    case "dust":
    default:
      return {
        position: new THREE.Vector3(x, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 8),
        velocity: new THREE.Vector3(0, 0.3, 0),
        rotationSpeed: new THREE.Vector3(0.02, 0.03, 0),
        scale: 0.05 + Math.random() * 0.1,
        swaySpeed: 0,
        swayAmount: 0,
        colorIndex: 0,
      };
  }
}

function makeParticles(kind: ParticleKind, count: number, halfW: number): ParticleState[] {
  return Array.from({ length: count }, (_, i) => {
    const base = spawnParticle(kind, halfW);
    return {
      ...base,
      rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
      swayPhase: Math.random() * Math.PI * 2,
      landed: false,
      landSlotX: ((i % 6) - 2.5) * 0.9,
      landSlotZ: (Math.floor(i / 6) % 4) * 0.7 - 1,
    };
  });
}

const dummy = new THREE.Object3D();

/* ------------------------------------------------------------------ */
/*  PART 2 — detailed geometry helpers                                  */
/*                                                                      */
/*  Built once per mesh via useMemo, not per-instance, so the extra     */
/*  vertices cost nothing at runtime beyond the one-time construction.  */
/* ------------------------------------------------------------------ */
function useBottleGeometry(): THREE.BufferGeometry {
  return useMemo(() => {
    const body = new THREE.CylinderGeometry(0.26, 0.3, 0.95, 16);
    body.translate(0, 0, 0);

    const neck = new THREE.CylinderGeometry(0.13, 0.18, 0.32, 12);
    neck.translate(0, 0.635, 0);

    const cap = new THREE.CylinderGeometry(0.145, 0.145, 0.14, 12);
    cap.translate(0, 0.87, 0);

    const merged = mergeBufferGeometries([body, neck, cap]);
    return merged ?? body;
  }, []);
}

// Bevelled rounded box for the chip — built imperatively (rather than
// registered as a JSX intrinsic via `extend()`) so no global JSX-typings
// augmentation is needed; used the same way as the bottle geometry below.
function useChipGeometry(segments: number): THREE.BufferGeometry {
  return useMemo(() => new RoundedBoxGeometry(0.8, 0.12, 0.6, segments, 0.04), [segments]);
}

/* ------------------------------------------------------------------ */
/*  Narrative landing tray (unchanged behaviour, now viewport-aware x)  */
/* ------------------------------------------------------------------ */
function InstancedFallingField({
  kind,
  count,
  castShadow,
  richMaterial,
  scrollLandingRef,
  halfWRef,
}: {
  kind: ParticleKind;
  count: number;
  castShadow: boolean;
  richMaterial: boolean;
  scrollLandingRef: React.MutableRefObject<number>;
  halfWRef: React.MutableRefObject<number>;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particles = useMemo(
    () => makeParticles(kind, count, halfWRef.current),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kind, count]
  );

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
    const trayY = THREE.MathUtils.lerp(-15, -3.4, landing);
    const halfW = halfWRef.current;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      if (p.landed) {
        p.rotation.y += p.rotationSpeed.y * 0.1 * delta;
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

        // Re-derive the loop/reset position from the CURRENT viewport width
        // every time, not the width at spawn time — so a device rotation or
        // window resize self-corrects on the very next loop instead of
        // requiring a full particle regeneration.
        const offscreen =
          p.position.y < trayY || p.position.x < -halfW - 3 || p.position.x > halfW + 3;

        if (offscreen) {
          if (landing > 0.15 && kind !== "dust" && p.position.y < trayY) {
            p.position.set(p.landSlotX, trayY + 0.15, p.landSlotZ);
            p.velocity.set(0, 0, 0);
            p.landed = true;
          } else {
            const { x, vx } = spawnX(kind, halfW);
            p.position.y = 12;
            p.position.x = x;
            p.velocity.x = vx;
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

  const bottleGeometry = useBottleGeometry();
  const chipGeometry = useChipGeometry(richMaterial ? 4 : 2);

  const geometry = useMemo(() => {
    switch (kind) {
      case "chip":
        // Bevelled rounded-box instead of a flat slab — reads as a real
        // packaged product edge rather than a plain cuboid.
        return <primitive object={chipGeometry} attach="geometry" />;
      case "coke":
        // Merged bottle silhouette (body + neck + cap) when the device can
        // afford it; a plain cylinder on low-tier devices.
        return richMaterial ? (
          <primitive object={bottleGeometry} attach="geometry" />
        ) : (
          <cylinderGeometry args={[0.28, 0.32, 1.2, 10]} />
        );
      case "popcorn":
        // Low-poly icosahedron reads as a faceted kernel rather than a
        // generic sphere, at essentially the same triangle cost.
        return <icosahedronGeometry args={[0.26, 0]} />;
      case "dust":
      default:
        return <sphereGeometry args={[0.1, 6, 6]} />;
    }
  }, [kind, richMaterial, bottleGeometry, chipGeometry]);

  if (count <= 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow={castShadow} receiveShadow={castShadow}>
      {geometry}
      {renderMaterial(kind, richMaterial)}
    </instancedMesh>
  );
}

/* ------------------------------------------------------------------ */
/*  PART 2 — physically based materials                                 */
/*                                                                      */
/*  Only "high" tier devices (richMaterial === geometryDetail==="high")  */
/*  get the full MeshPhysicalMaterial treatment. Transmission in         */
/*  particular triggers an extra background-sampling render pass in      */
/*  three.js — cheap here because only ONE shared material per kind      */
/*  uses it (instancing means all ~15-30 bottles share that one          */
/*  material), but still not something to turn on for low-end devices.  */
/*  Everything falls back to the original lightweight MeshStandard-      */
/*  Material otherwise, keeping the existing performance-tier contract.  */
/* ------------------------------------------------------------------ */
function renderMaterial(kind: ParticleKind, rich: boolean) {
  if (!rich) {
    const basic = {
      chip: { color: "#ffffff", roughness: 0.3, metalness: 0.4, emissive: "#C9A227", emissiveIntensity: 0.35 },
      coke: { color: "#8B3A3A", roughness: 0.2, metalness: 0.3, emissive: "#5c2626", emissiveIntensity: 0.3 },
      popcorn: { color: "#E8D9B0", roughness: 0.5, metalness: 0, emissive: "#C9A227", emissiveIntensity: 0.25 },
      dust: { color: "#C9A227", emissive: "#C9A227", emissiveIntensity: 0.5, transparent: true, opacity: 0.6 },
    }[kind];
    return <meshStandardMaterial {...basic} />;
  }

  switch (kind) {
    case "chip":
      // Foil packaging: part metal, part glossy print — metalness +
      // roughness for the aluminum layer, clearcoat + sheen for the
      // printed/laminated top layer.
      return (
        <meshPhysicalMaterial
          color="#f5f1e6"
          metalness={0.55}
          roughness={0.28}
          clearcoat={0.8}
          clearcoatRoughness={0.18}
          sheen={0.5}
          sheenRoughness={0.4}
          sheenColor={new THREE.Color("#C9A227")}
          emissive="#C9A227"
          emissiveIntensity={0.12}
        />
      );
    case "coke":
      // Oxblood glass bottle with liquid inside — transmission + IOR is
      // what actually sells "glass", not just a tinted opaque material.
      return (
        <meshPhysicalMaterial
          color="#8B3A3A"
          transmission={0.88}
          thickness={0.6}
          ior={1.5}
          roughness={0.08}
          metalness={0}
          clearcoat={0.4}
          clearcoatRoughness={0.1}
          emissive="#5c1f1f"
          emissiveIntensity={0.25}
        />
      );
    case "popcorn":
      return (
        <meshPhysicalMaterial
          color="#E8D9B0"
          roughness={0.6}
          metalness={0.02}
          clearcoat={0.15}
          clearcoatRoughness={0.4}
          emissive="#C9A227"
          emissiveIntensity={0.15}
        />
      );
    case "dust":
    default:
      // Kept lightweight even in "rich" mode — dust is numerous and purely
      // ambient, not a hero asset worth the extra material cost.
      return (
        <meshStandardMaterial color="#C9A227" emissive="#C9A227" emissiveIntensity={0.5} transparent opacity={0.6} />
      );
  }
}

/* ------------------------------------------------------------------ */
/*  Scroll tracking (outside the R3F tree — window belongs there)      */
/* ------------------------------------------------------------------ */
function useScrollSignals() {
  const rotationProgress = useRef(0);
  const landingProgress = useRef(0);
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

/* ------------------------------------------------------------------ */
/*  PART 1 — adaptive camera                                            */
/*                                                                      */
/*  On a narrow/portrait canvas, widen the FOV and pull the camera back  */
/*  slightly so the same vertical fall path reads as a comfortably       */
/*  framed column rather than a claustrophobic sliver. Damped rather     */
/*  than snapped, so an orientation change eases rather than jump-cuts.  */
/* ------------------------------------------------------------------ */
function AdaptiveCamera() {
  const { camera, size } = useThree();

  useFrame((_, delta) => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    const aspect = size.width / size.height;
    const isNarrow = aspect < 0.75; // roughly: portrait phones and small tablets
    const targetFov = isNarrow ? 78 : 60;
    const targetZ = isNarrow ? 16 : 12;

    camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 3, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 3, delta);
    camera.updateProjectionMatrix();
  });

  return null;
}

/**
 * Reads R3F's own `viewport.width` (world units, already accounting for the
 * live FOV / aspect / camera distance) into a ref every frame, so the
 * falling-field components can bound particle spawns to whatever is
 * actually visible right now — the core fix for Part 1.
 */
function ViewportBoundsTracker({ halfWRef }: { halfWRef: React.MutableRefObject<number> }) {
  const { viewport } = useThree();
  useFrame(() => {
    halfWRef.current = viewport.width / 2;
  });
  return null;
}

function CinematicScene({
  budget,
  reducedMotion,
  rotationProgress,
  landingProgress,
  halfWRef,
  lateNight,
}: {
  budget: SceneBudget;
  reducedMotion: boolean;
  rotationProgress: React.MutableRefObject<number>;
  landingProgress: React.MutableRefObject<number>;
  halfWRef: React.MutableRefObject<number>;
  lateNight: boolean;
}) {
  const ambientIntensity = lateNight ? 0.32 : 0.6;
  const keyIntensity = lateNight ? 1.0 : 1.8;
  const keyColor = lateNight ? "#F3D9A0" : "#ffffff";
  const rimA = lateNight ? "#8B3A3A" : "#C9A227";
  const rimB = lateNight ? "#5c2c14" : "#8B3A3A";
  const richMaterial = budget.geometryDetail === "high";

  return (
    <>
      <AdaptiveCamera />
      <ViewportBoundsTracker halfWRef={halfWRef} />

      <ScrollParallaxGroup disabled={reducedMotion} rotationProgress={rotationProgress}>
        <InstancedFallingField kind="chip" count={budget.chips} castShadow={budget.shadows} richMaterial={richMaterial} scrollLandingRef={landingProgress} halfWRef={halfWRef} />
        <InstancedFallingField kind="coke" count={budget.cokes} castShadow={budget.shadows} richMaterial={richMaterial} scrollLandingRef={landingProgress} halfWRef={halfWRef} />
        <InstancedFallingField kind="popcorn" count={budget.popcorn} castShadow={budget.shadows} richMaterial={richMaterial} scrollLandingRef={landingProgress} halfWRef={halfWRef} />
        <InstancedFallingField kind="dust" count={budget.dust} castShadow={false} richMaterial={richMaterial} scrollLandingRef={landingProgress} halfWRef={halfWRef} />

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
    </>
  );
}

export default function Scene3DUltraCinematic() {
  const { tier, isDetecting, isMobile, prefersReducedMotion, maxDpr } = useDeviceCapability();
  const lateNight = useLateNightMode();
  const { rotationProgress, landingProgress } = useScrollSignals();
  // Starts wide (desktop-ish) so first-paint spawn math is sane even before
  // the first frame has measured the real viewport; ViewportBoundsTracker
  // corrects it within a frame of mount.
  const halfWRef = useRef(8);

  if (isDetecting) return null;

  const budget = TIER_BUDGET[tier];

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
          halfWRef={halfWRef}
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

        {/* Studio-style HDRI so the new metallic/glass materials actually
            have something realistic to reflect. */}
        {effectiveBudget.environment && <Environment preset="studio" />}
        <fog attach="fog" args={[lateNight ? "#0B0A08" : "#16130F", 5, 50]} />
      </Suspense>
    </Canvas>
  );
}
