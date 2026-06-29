import type { Scenario, ChatMessage } from "@/types";
import { mockEvaluate } from "./mock";
import type { ReviewOutput } from "./review-schema";

/** Aggregate the per-reply heuristic over the whole conversation for the offline review. */
export function mockReview(scenario: Scenario, messages: ChatMessage[]): ReviewOutput {
  const userReplies = messages.filter((m) => m.role === "user").map((m) => m.content.trim()).filter(Boolean);

  if (userReplies.length === 0) {
    return {
      score: 0,
      intent: 0,
      grammar: 0,
      vocabulary: 0,
      fluency: 0,
      confidence: 0,
      summary: "No replies were captured in this conversation. Jump back in and say a sentence or two — even a short answer is a great start.",
      strengths: ["You showed up to practice — that's the hardest part."],
      improvements: ["Try sending at least one reply so I can coach you."],
      betterExample: { original: "(nothing said yet)", better: "Hi! Thanks for asking — I'm doing well. How about you?" },
      tip: "Start with one full sentence; you can always add more.",
    };
  }

  // Evaluate each reply against the partner line it answered, so reciprocal-follow-up
  // logic stays scenario-appropriate.
  const userMsgs = messages.filter((m) => m.role === "user" && m.content.trim());
  const evals = userMsgs.map((um) => {
    const idx = messages.indexOf(um);
    const prevPartner = [...messages.slice(0, idx)].reverse().find((m) => m.role === "assistant")?.content ?? "";
    return mockEvaluate(um.content.trim(), scenario, prevPartner);
  });
  const avg = (key: "score" | "intent" | "grammar" | "vocabulary" | "fluency" | "confidence") =>
    Math.round(evals.reduce((a, e) => a + e[key], 0) / evals.length);

  // Weakest reply (by score) becomes the upgrade example.
  let weakestIdx = 0;
  evals.forEach((e, i) => {
    if (e.score < evals[weakestIdx].score) weakestIdx = i;
  });
  const weakest = evals[weakestIdx];

  const score = avg("score");
  const strengths: string[] = [];
  if (avg("intent") >= 65) strengths.push("You stayed on-topic and answered what was asked.");
  if (avg("confidence") >= 65) strengths.push("Your replies came across warm and confident.");
  if (userReplies.length >= 3) strengths.push("You kept the conversation going across several turns.");
  if (strengths.length === 0) strengths.push("You engaged and got your point across.");

  const improvements: string[] = [];
  if (avg("grammar") < 75) improvements.push("Tighten small grammar slips like tense and capitalization.");
  if (avg("fluency") < 75) improvements.push("Aim for smoother pacing — fewer fillers, fuller sentences.");
  if (avg("vocabulary") < 75) improvements.push("Reach for a few more precise, natural word choices.");
  if (improvements.length === 0) improvements.push("Add a follow-up question now and then to keep things flowing.");

  return {
    score,
    intent: avg("intent"),
    grammar: avg("grammar"),
    vocabulary: avg("vocabulary"),
    fluency: avg("fluency"),
    confidence: avg("confidence"),
    summary: `You completed ${userReplies.length} ${userReplies.length === 1 ? "reply" : "replies"} and got your meaning across clearly. ${
      score >= 75 ? "This was a confident, natural conversation — nice work." : "A few small refinements will make you sound even more natural."
    }`,
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    betterExample: { original: userReplies[weakestIdx], better: weakest.betterResponse },
    tip: weakest.tip,
  };
}
