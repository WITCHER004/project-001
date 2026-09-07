"use client";
import { useCallback, useRef } from "react";

/**
 * A deep, muffled "thunk" — closer to a well-built car door latching than a
 * notification chime. Built from a low sine thump plus a short filtered
 * noise burst for the "muffled" body, with no bright high end so it reads
 * as solid rather than digital.
 */
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

    // Low-end "thump" — the weight of the sound.
    const thumpGain = ctx.createGain();
    thumpGain.gain.setValueAtTime(0.0001, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.5, now + 0.006);
    thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    const thumpFilter = ctx.createBiquadFilter();
    thumpFilter.type = "lowpass";
    thumpFilter.frequency.setValueAtTime(220, now);

    const thump = ctx.createOscillator();
    thump.type = "sine";
    thump.frequency.setValueAtTime(120, now);
    thump.frequency.exponentialRampToValueAtTime(55, now + 0.18);
    thump.connect(thumpFilter);
    thumpFilter.connect(thumpGain);
    thumpGain.connect(ctx.destination);
    thump.start(now);
    thump.stop(now + 0.24);

    // Short filtered noise burst — the "muffled" latch texture.
    const bufferSize = Math.floor(ctx.sampleRate * 0.08);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.setValueAtTime(500, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.18, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
  }, []);

  return play;
}
