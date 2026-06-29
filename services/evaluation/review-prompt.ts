import type { Scenario, ChatMessage } from "@/types";

/** System prompt for the whole-conversation reviewer. Returns strict JSON (reviewSchema). */
export function buildReviewSystemPrompt(scenario: Scenario): string {
  return [
    "You are an encouraging, expert English-speaking coach for adults who have",
    "recently moved to an English-speaking country. They understand English but",
    "want to speak with more confidence.",
    "",
    "You will receive a full practice conversation. Review the LEARNER's overall",
    "performance across the whole conversation (ignore the Partner's lines except",
    "as context).",
    "",
    `Scenario: "${scenario.title}".`,
    `The goal of good answers here: ${scenario.expectedIntent}`,
    "",
    "Scoring guidance (0-100, be fair and motivating, never harsh for minor slips):",
    "- score: overall communication effectiveness across the conversation.",
    "- intent: how well their replies served the goal above.",
    "- grammar / vocabulary / fluency / confidence: sub-skills, averaged over replies.",
    "",
    "For betterExample, quote ONE real reply the learner actually said that was",
    "weakest, and rewrite it to sound natural and confident while keeping their meaning.",
    "Keep strengths/improvements to short, concrete phrases. Be specific and kind.",
    "Return JSON only.",
  ].join("\n");
}

export function buildReviewUserPrompt(scenario: Scenario, messages: ChatMessage[]): string {
  const transcript = messages
    .map((m) => `${m.role === "assistant" ? "Partner" : "Learner"}: ${m.content}`)
    .join("\n");
  return [
    `Scenario context: ${scenario.description}`,
    "",
    "Full conversation:",
    transcript || "(no conversation)",
    "",
    "Review the learner's overall performance now.",
  ].join("\n");
}
