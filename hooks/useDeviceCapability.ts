"use client";

import { useEffect, useState } from "react";

export type PerformanceTier = "low" | "medium" | "high";

export interface DeviceCapability {
  tier: PerformanceTier;
  isMobile: boolean;
  prefersReducedMotion: boolean;
  maxDpr: number;
  /** Still resolving (first render / SSR). Consumers should render a
   *  lightweight or hidden state until this flips to false to avoid
   *  a flash of the wrong tier. */
  isDetecting: boolean;
}

// Renderer substrings that reliably indicate a low-power / integrated GPU
// or a software rasterizer. This is a heuristic, not a benchmark — it just
// needs to be good enough to steer particle counts and effects sensibly.
const LOW_POWER_RENDERER_HINTS = [
  "swiftshader",
  "llvmpipe",
  "software",
  "microsoft basic render",
  "mali-4",
  "mali-t",
  "adreno 3",
  "adreno 4",
  "adreno 5",
  "powervr sgx",
  "intel(r) hd graphics",
  "intel hd graphics",
];

function detectGpuTierHint(): "low" | "unknown" {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ||
      canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return "low"; // no WebGL at all -> definitely low tier

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = debugInfo
      ? (gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string)
      : (gl.getParameter(gl.RENDERER) as string);

    const normalized = (renderer || "").toLowerCase();
    if (LOW_POWER_RENDERER_HINTS.some((hint) => normalized.includes(hint))) {
      return "low";
    }
    return "unknown";
  } catch {
    return "unknown";
  }
}

function computeTier(): { tier: PerformanceTier; isMobile: boolean; maxDpr: number } {
  const ua = navigator.userAgent || "";
  const isMobileUA = /Android|iPhone|iPad|iPod|Mobile|Silk|Tablet/i.test(ua);
  const isCoarsePointer = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const isNarrowViewport = window.innerWidth < 820;
  const isMobile = isMobileUA || (isCoarsePointer && isNarrowViewport);

  const cores = navigator.hardwareConcurrency || 4;
  // deviceMemory is Chromium-only and unitless GB; treat missing as unknown (assume mid-range)
  const memory = (navigator as any).deviceMemory as number | undefined;
  const gpuHint = detectGpuTierHint();

  let score = 0;
  if (isMobile) score -= 2;
  if (gpuHint === "low") score -= 3;
  if (cores <= 4) score -= 1;
  if (cores >= 8) score += 1;
  if (memory !== undefined) {
    if (memory <= 4) score -= 2;
    else if (memory >= 8) score += 1;
  }

  let tier: PerformanceTier;
  if (score <= -3) tier = "low";
  else if (score >= 1) tier = "high";
  else tier = "medium";

  const maxDpr = tier === "low" ? 1 : tier === "medium" ? 1.5 : 2;

  return { tier, isMobile, maxDpr };
}

/**
 * Detects a coarse device performance tier so heavy visuals (particle
 * counts, shadows, post-processing) can scale down gracefully on
 * mobile / low-end hardware instead of tanking frame rate.
 *
 * Detection runs once on mount (client-only — SSR-safe defaults are
 * returned until then) and is intentionally cheap: a WebGL renderer
 * string sniff plus a few navigator hints, not a real benchmark loop.
 */
export function useDeviceCapability(): DeviceCapability {
  const [capability, setCapability] = useState<DeviceCapability>({
    tier: "medium",
    isMobile: false,
    prefersReducedMotion: false,
    maxDpr: 1.5,
    isDetecting: true,
  });

  useEffect(() => {
    const { tier, isMobile, maxDpr } = computeTier();
    const prefersReducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    setCapability({
      tier,
      isMobile,
      prefersReducedMotion,
      maxDpr,
      isDetecting: false,
    });
  }, []);

  return capability;
}
