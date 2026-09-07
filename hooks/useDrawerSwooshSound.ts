"use client";
import { useCallback, useRef } from "react";

/** A soft filtered-noise swoosh for the cart drawer sliding open. */
export function useDrawerSwooshSound() {
  const contextRef = useRef<AudioContext | null>(null);

  const play = useCallback(() => {
    if (typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!contextRef.current) contextRef.current = new AudioContextClass();
    const ctx = contextRef.current;
    if (ctx.state === "suspended") void ctx.resume();

    const now = ctx.currentTime;
    const duration = 0.4;

    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Sweep the bandpass center frequency upward for a rising "swoosh".
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 0.7;
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(2200, now + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.06, now + duration * 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + duration);
  }, []);

  return play;
}
