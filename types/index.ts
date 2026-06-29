export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type ScenarioCategory = "Workplace" | "Daily Life" | "Immigration";

export interface Scenario {
  id: string;
  title: string;
  category: ScenarioCategory;
  /** lucide-react icon name */
  icon: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  description: string;
  /** system prompt persona for the AI partner */
  prompt: string;
  /** what a great answer is trying to achieve */
  expectedIntent: string;
  /** first AI line */
  conversationStarter: string;
  maxTurns: number;
}

export type ChatRole = "assistant" | "user";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
}

/** Structured evaluation returned by the model (zod-validated). */
export interface Evaluation {
  transcript: string;
  score: number; // 0-100 overall communication score
  intent: number; // 0-100
  grammar: number; // 0-100
  vocabulary: number; // 0-100
  fluency: number; // 0-100
  confidence: number; // 0-100
  grammarNotes: string;
  vocabularyNotes: string;
  fluencyNotes: string;
  feedback: string;
  betterResponse: string;
  tip: string;
}

/** Whole-conversation review generated once at the end of a session. */
export interface ConversationReview {
  score: number; // 0-100 overall
  intent: number;
  grammar: number;
  vocabulary: number;
  fluency: number;
  confidence: number;
  summary: string; // 2-3 sentence overall assessment
  strengths: string[]; // what they did well
  improvements: string[]; // what to work on
  betterExample: { original: string; better: string }; // upgrade one real reply
  tip: string; // single most useful next step
}

export interface AttemptRecord {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  turnIndex: number;
  transcript: string;
  evaluation: Evaluation;
  createdAt: number;
  /** true when this attempt was a retry of the same prompt */
  isRetry: boolean;
}

export interface SessionRecord {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  startedAt: number;
  completedAt?: number;
  averageScore: number;
  bestScore: number;
  turns: number;
  durationSeconds: number;
}

export interface ProgressState {
  attempts: AttemptRecord[];
  sessions: SessionRecord[];
  completedScenarioIds: string[];
  streakDays: number;
  lastPracticedDate: string | null; // YYYY-MM-DD
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: (p: ProgressState) => boolean;
}
