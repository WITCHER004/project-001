"use client";
import { useCallback, useRef } from "react";

export function useAddToCartSound() {
  const contextRef = useRef<AudioContext | null>(null);

  const play = useCallback(() => {
    if (typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!contextRef.current) contextRef.current = new AudioContextClass();
    const ctx = contextRef.current;
    if (ctx.state === "suspended") void ctx.resume();

    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
    gain.connect(ctx.destination);

    const primary = ctx.createOscillator();
    primary.type = "sine";
    primary.frequency.setValueAtTime(880, now); // A5
    primary.connect(gain);
    primary.start(now);
    primary.stop(now + 0.26);

    const harmonic = ctx.createOscillator();
    harmonic.type = "sine";
    harmonic.frequency.setValueAtTime(1318.5, now); // E6
    harmonic.connect(gain);
    harmonic.start(now + 0.015);
    harmonic.stop(now + 0.26);
  }, []);

  return play;
}