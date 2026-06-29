import type { Achievement } from "@/types";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_words",
    title: "First Words",
    description: "Complete your first response.",
    icon: "Sparkles",
    unlocked: (p) => p.attempts.length >= 1,
  },
  {
    id: "warmed_up",
    title: "Warmed Up",
    description: "Finish 5 responses.",
    icon: "Flame",
    unlocked: (p) => p.attempts.length >= 5,
  },
  {
    id: "scenario_clear",
    title: "Scenario Cleared",
    description: "Complete a full scenario.",
    icon: "CheckCircle2",
    unlocked: (p) => p.completedScenarioIds.length >= 1,
  },
  {
    id: "high_scorer",
    title: "High Scorer",
    description: "Score 90 or above on a response.",
    icon: "Trophy",
    unlocked: (p) => p.attempts.some((a) => a.evaluation.score >= 90),
  },
  {
    id: "consistent",
    title: "Consistent",
    description: "Reach a 3-day streak.",
    icon: "CalendarCheck",
    unlocked: (p) => p.streakDays >= 3,
  },
  {
    id: "explorer",
    title: "Explorer",
    description: "Try 3 different scenarios.",
    icon: "Compass",
    unlocked: (p) => new Set(p.attempts.map((a) => a.scenarioId)).size >= 3,
  },
];
