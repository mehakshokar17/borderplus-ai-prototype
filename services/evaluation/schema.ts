import { z } from "zod";

/** Zod schema used for structured evaluation output + client validation. */
export const evaluationSchema = z.object({
  score: z.number().min(0).max(100).describe("Overall communication score 0-100"),
  intent: z.number().min(0).max(100).describe("How well the answer matched the goal"),
  grammar: z.number().min(0).max(100),
  vocabulary: z.number().min(0).max(100),
  fluency: z.number().min(0).max(100),
  confidence: z.number().min(0).max(100),
  grammarNotes: z.string().describe("One short note on grammar"),
  vocabularyNotes: z.string().describe("One short vocabulary suggestion"),
  fluencyNotes: z.string().describe("One short note on fluency/pacing"),
  feedback: z.string().describe("Two warm, specific sentences of overall feedback"),
  betterResponse: z.string().describe("A natural, improved rewrite of the user's answer"),
  tip: z.string().describe("One short actionable tip"),
});

export type EvaluationOutput = z.infer<typeof evaluationSchema>;
