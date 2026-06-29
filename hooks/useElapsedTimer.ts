"use client";
import { useEffect, useRef, useState } from "react";

/** Counts seconds since mount; pausable. */
export function useElapsedTimer(running = true) {
  const [seconds, setSeconds] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running]);
  return seconds;
}
