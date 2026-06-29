"use client";

/** Browser text-to-speech with graceful no-op when unsupported. */
export function speak(text: string, opts?: { rate?: number; onEnd?: () => void }) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    opts?.onEnd?.();
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = opts?.rate ?? 1;
  u.pitch = 1;
  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find((v) => /en-(US|GB)/i.test(v.lang) && /natural|google|samantha|aria/i.test(v.name)) ||
    voices.find((v) => /en/i.test(v.lang));
  if (preferred) u.voice = preferred;
  if (opts?.onEnd) u.onend = opts.onEnd;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function ttsSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
