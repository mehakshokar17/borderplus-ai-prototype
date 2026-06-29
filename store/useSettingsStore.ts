import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  voiceMode: boolean; // mic-first vs typing-first
  autoSpeak: boolean; // speak AI replies aloud
  speechRate: number;
  setVoiceMode: (v: boolean) => void;
  setAutoSpeak: (v: boolean) => void;
  setSpeechRate: (n: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      voiceMode: false,
      autoSpeak: true,
      speechRate: 1,
      setVoiceMode: (v) => set({ voiceMode: v }),
      setAutoSpeak: (v) => set({ autoSpeak: v }),
      setSpeechRate: (n) => set({ speechRate: n }),
    }),
    { name: "bp-settings" }
  )
);
