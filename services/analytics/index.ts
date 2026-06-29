import type { ProgressState } from "@/types";
import { SCENARIOS } from "@/services/scenarios/data";

export interface DashboardStats {
  sessions: number;
  attempts: number;
  averageScore: number;
  bestScore: number;
  hoursPracticed: number;
  completionPct: number;
  completedScenarios: number;
  totalScenarios: number;
}

export function computeStats(p: ProgressState): DashboardStats {
  const attempts = p.attempts;
  const scores = attempts.map((a) => a.evaluation.score);
  const averageScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const bestScore = scores.length ? Math.max(...scores) : 0;
  const totalSeconds = p.sessions.reduce((sum, s) => sum + (s.durationSeconds || 0), 0);
  return {
    sessions: p.sessions.length,
    attempts: attempts.length,
    averageScore,
    bestScore,
    hoursPracticed: Math.round((totalSeconds / 3600) * 10) / 10,
    completionPct: Math.round((p.completedScenarioIds.length / SCENARIOS.length) * 100),
    completedScenarios: p.completedScenarioIds.length,
    totalScenarios: SCENARIOS.length,
  };
}

export interface RadarPoint {
  skill: string;
  value: number;
}

export function computeRadar(p: ProgressState): RadarPoint[] {
  const a = p.attempts;
  const avg = (sel: (e: (typeof a)[number]) => number) =>
    a.length ? Math.round(a.reduce((s, x) => s + sel(x), 0) / a.length) : 0;
  return [
    { skill: "Grammar", value: avg((x) => x.evaluation.grammar) },
    { skill: "Confidence", value: avg((x) => x.evaluation.confidence) },
    { skill: "Vocabulary", value: avg((x) => x.evaluation.vocabulary) },
    { skill: "Fluency", value: avg((x) => x.evaluation.fluency) },
    { skill: "Intent", value: avg((x) => x.evaluation.intent) },
  ];
}

export interface WeeklyPoint {
  day: string;
  score: number | null;
  attempts: number;
}

export function computeWeekly(p: ProgressState): WeeklyPoint[] {
  const days: WeeklyPoint[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const dayAttempts = p.attempts.filter((a) => new Date(a.createdAt).toISOString().slice(0, 10) === key);
    const avg = dayAttempts.length
      ? Math.round(dayAttempts.reduce((s, a) => s + a.evaluation.score, 0) / dayAttempts.length)
      : null;
    days.push({
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      score: avg,
      attempts: dayAttempts.length,
    });
  }
  return days;
}
