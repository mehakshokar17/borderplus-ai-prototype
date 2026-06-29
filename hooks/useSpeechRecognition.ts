"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Live speech-to-text using the browser's Web Speech API (free, on-device, no backend).
 * Supported in Chrome/Edge/Safari. Returns interim + final transcript as the user speaks.
 */

// Minimal typings for the non-standard SpeechRecognition API.
interface SRAlternative { transcript: string }
interface SRResult { 0: SRAlternative; isFinal: boolean; length: number }
interface SRResultList { length: number; [i: number]: SRResult }
interface SREvent { resultIndex: number; results: SRResultList }
interface SRErrorEvent { error: string }
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: SREvent) => void) | null;
  onerror: ((e: SRErrorEvent) => void) | null;
  onend: (() => void) | null;
}
type SRConstructor = new () => SpeechRecognitionLike;

function getSR(): SRConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: SRConstructor; webkitSpeechRecognition?: SRConstructor };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function speechRecognitionSupported(): boolean {
  return getSR() !== null;
}

interface Options {
  lang?: string;
  /** called with the full final transcript when the user stops */
  onFinal?: (text: string) => void;
  /** called continuously with interim text while speaking */
  onInterim?: (text: string) => void;
}

export function useSpeechRecognition({ lang = "en-US", onFinal, onInterim }: Options = {}) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const finalRef = useRef("");
  // keep latest callbacks without re-creating the recognizer
  const cbRef = useRef({ onFinal, onInterim });
  cbRef.current = { onFinal, onInterim };

  const supported = speechRecognitionSupported();

  const stop = useCallback(() => {
    recRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    const SR = getSR();
    if (!SR) {
      setError("Voice input isn't supported in this browser. Try typing instead.");
      return;
    }
    setError(null);
    finalRef.current = "";
    const rec = new SR();
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (e: SREvent) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        const txt = res[0].transcript;
        if (res.isFinal) finalRef.current += txt + " ";
        else interim += txt;
      }
      cbRef.current.onInterim?.((finalRef.current + interim).trim());
    };
    rec.onerror = (e: SRErrorEvent) => {
      if (e.error === "no-speech") return; // benign
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setError("Microphone access was blocked. You can type your answer instead.");
      } else {
        setError("Voice input hit a snag. You can type your answer instead.");
      }
    };
    rec.onend = () => {
      setListening(false);
      const text = finalRef.current.trim();
      if (text) cbRef.current.onFinal?.(text);
    };

    recRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch {
      // start() throws if called while already running — ignore.
    }
  }, [lang]);

  useEffect(() => {
    return () => {
      recRef.current?.abort();
    };
  }, []);

  return { supported, listening, error, start, stop };
}
