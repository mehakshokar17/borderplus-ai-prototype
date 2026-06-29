"use client";
import { useCallback } from "react";

export function useConfetti() {
  return useCallback(async () => {
    const confetti = (await import("canvas-confetti")).default;
    const colors = ["#6d5efc", "#a855f7", "#ec4899", "#22d3ee"];
    const end = Date.now() + 900;
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 70, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 70, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 }, colors });
  }, []);
}
