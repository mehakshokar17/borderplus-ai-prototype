import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AttemptRecord, ProgressState, SessionRecord } from "@/types";
import { todayKey } from "@/lib/utils";

interface ProgressStore extends ProgressState {
  addAttempt: (a: AttemptRecord) => void;
  addSession: (s: SessionRecord) => void;
  markCompleted: (scenarioId: string) => void;
  bumpStreak: () => void;
  reset: () => void;
  bestForScenario: (scenarioId: string) => number;
}

const initial: ProgressState = {
  attempts: [],
  sessions: [],
  completedScenarioIds: [],
  streakDays: 0,
  lastPracticedDate: null,
};

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...initial,
      addAttempt: (a) => set((s) => ({ attempts: [...s.attempts, a] })),
      addSession: (sess) => set((s) => ({ sessions: [...s.sessions, sess] })),
      markCompleted: (id) =>
        set((s) =>
          s.completedScenarioIds.includes(id)
            ? s
            : { completedScenarioIds: [...s.completedScenarioIds, id] }
        ),
      bumpStreak: () =>
        set((s) => {
          const today = todayKey();
          if (s.lastPracticedDate === today) return s;
          const yesterday = todayKey(new Date(Date.now() - 86400000));
          const streak = s.lastPracticedDate === yesterday ? s.streakDays + 1 : 1;
          return { streakDays: streak, lastPracticedDate: today };
        }),
      reset: () => set({ ...initial }),
      bestForScenario: (id) => {
        const scores = get()
          .attempts.filter((a) => a.scenarioId === id)
          .map((a) => a.evaluation.score);
        return scores.length ? Math.max(...scores) : 0;
      },
    }),
    { name: "bp-progress" }
  )
);
