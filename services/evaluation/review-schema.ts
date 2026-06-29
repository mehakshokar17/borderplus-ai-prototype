import { z } from "zod";

/** Zod schema for the single whole-conversation review (Vercel AI SDK generateObject). */
export const reviewSchema = z.object({
  score: z.number().min(0).max(100).describe("Overall communication score 0-100 for the whole conversation"),
  intent: z.number().min(0).max(100).describe("How well replies served the scenario goal"),
  grammar: z.number().min(0).max(100),
  vocabulary: z.number().min(0).max(100),
  fluency: z.number().min(0).max(100),
  confidence: z.number().min(0).max(100),
  summary: z.string().describe("Two or three warm, specific sentences summarizing how the learner did"),
  strengths: z.array(z.string()).min(1).max(3).describe("1-3 concrete things the learner did well"),
  improvements: z.array(z.string()).min(1).max(3).describe("1-3 concrete things to work on next time"),
  betterExample: z
    .object({
      original: z.string().describe("One real reply the learner actually said that could be stronger"),
      better: z.string().describe("A natural, more confident rewrite that keeps their meaning"),
    })
    .describe("Pick the learner's weakest real reply and upgrade it"),
  tip: z.string().describe("The single most useful next-step tip, one sentence"),
});

export type ReviewOutput = z.infer<typeof reviewSchema>;
