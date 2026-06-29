import type { Scenario } from "@/types";

/**
 * System prompt for the evaluator. Returns strict JSON matching evaluationSchema.
 * Used with the Vercel AI SDK `generateObject` for structured outputs.
 */
export function buildEvaluationSystemPrompt(scenario: Scenario): string {
  return [
    "You are an encouraging, expert English-speaking coach for adults who have",
    "recently moved to an English-speaking country. They understand English but",
    "want to speak with more confidence.",
    "",
    "You will receive the conversation context and the learner's latest reply.",
    "Evaluate ONLY the learner's latest reply.",
    "",
    `Scenario: "${scenario.title}".`,
    `The goal of a good answer: ${scenario.expectedIntent}`,
    "",
    "Scoring guidance (0-100, be fair and motivating, avoid harsh scores for",
    "minor issues):",
    "- score: overall communication effectiveness.",
    "- intent: how well the reply served the goal above.",
    "- grammar / vocabulary / fluency / confidence: sub-skills.",
    "",
    "Always be specific and kind. The 'betterResponse' must keep the learner's",
    "own meaning but sound natural and confident. Keep notes to one sentence.",
    "Return JSON only.",
  ].join("\n");
}

export function buildEvaluationUserPrompt(opts: {
  history: { role: string; content: string }[];
  userReply: string;
}): string {
  const transcript = opts.history
    .map((m) => `${m.role === "assistant" ? "Partner" : "Learner"}: ${m.content}`)
    .join("\n");
  return [
    "Conversation so far:",
    transcript || "(start of conversation)",
    "",
    `Learner's latest reply to evaluate: "${opts.userReply}"`,
  ].join("\n");
}
