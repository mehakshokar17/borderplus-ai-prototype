import type { Scenario } from "@/types";
import { clamp } from "@/lib/utils";
import type { EvaluationOutput } from "./schema";

/**
 * Deterministic-ish heuristic evaluator used when no OPENAI_API_KEY is set.
 * It reacts to real properties of the user's text so the demo feels alive.
 */
export function mockEvaluate(userReply: string, scenario: Scenario): EvaluationOutput {
  const text = userReply.trim();
  const words = text ? text.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const hasQuestion = looksLikeQuestion(text);
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const avgSentenceLen = sentences.length ? wordCount / sentences.length : wordCount;
  const fillers = (text.match(/\b(um+|uh+|like|you know|kinda|sorta)\b/gi) || []).length;
  const startsLower = /^[a-z]/.test(text);

  // base from length sweet spot (8-30 words)
  let base = 58;
  if (wordCount >= 6) base += 8;
  if (wordCount >= 12) base += 8;
  if (wordCount >= 20) base += 6;
  if (wordCount > 45) base -= 6;
  if (wordCount < 4) base -= 18;

  const grammar = clamp(base + (startsLower ? -6 : 4) + (sentences.length > 1 ? 6 : 0));
  const vocabulary = clamp(base + Math.min(12, new Set(words.map((w) => w.toLowerCase())).size - wordCount * 0.4));
  const fluency = clamp(base + 10 - fillers * 6 + (avgSentenceLen > 6 && avgSentenceLen < 22 ? 6 : -2));
  const confidence = clamp(base + (wordCount >= 10 ? 8 : -6) - fillers * 4 + (hasQuestion ? 4 : 0));
  const intent = clamp(base + (hasQuestion ? 10 : 0) + (wordCount >= 8 ? 8 : -4));
  const score = clamp(grammar * 0.2 + vocabulary * 0.2 + fluency * 0.2 + confidence * 0.2 + intent * 0.2);

  const tip = !text
    ? "Give it a try — even one sentence is a great start."
    : wordCount < 6
    ? "Try a longer sentence with a bit more detail."
    : !hasQuestion
    ? "Add a follow-up question to keep the conversation flowing."
    : fillers > 1
    ? "Speak slightly slower and trim filler words like 'um' and 'like'."
    : "Great length — now try varying your sentence openings.";

  const betterResponse = improve(text, scenario, hasQuestion);

  return {
    score,
    intent,
    grammar,
    vocabulary,
    fluency,
    confidence,
    grammarNotes:
      startsLower && text
        ? "Start sentences with a capital letter for polish."
        : "Grammar reads cleanly — nice work.",
    vocabularyNotes:
      vocabulary < 70
        ? "Swap a generic word for something more precise."
        : "Good, varied word choice.",
    fluencyNotes:
      fillers > 1
        ? "A couple of filler words crept in — pause instead."
        : "Smooth pacing and natural rhythm.",
    feedback: text
      ? `You got your point across${hasQuestion ? " and kept the other person engaged" : ""}. ${
          wordCount < 8 ? "A little more detail will make it land even stronger." : "Keep this confident, natural tone."
        }`
      : "No response captured yet. When you're ready, share a sentence or two and I'll coach you.",
    betterResponse,
    tip,
  };
}

// Common follow-up phrases users tack on without a question mark.
const FOLLOW_UP_RE = /[\s,]*\b(what about you|how about you|what about yourself|how about yourself|and you|and yourself|and you\?*)\b[\s?.!]*$/i;

/** True if the reply is a question — by punctuation OR common interrogative phrasing. */
function looksLikeQuestion(text: string): boolean {
  if (/\?/.test(text)) return true;
  return (
    FOLLOW_UP_RE.test(text) ||
    /\b(what about|how about|how are you|how's your|do you|are you|did you|have you|can you|could you|would you|will you)\b/i.test(text)
  );
}

function improve(text: string, scenario: Scenario, hasQuestion: boolean): string {
  if (!text) return scenario.conversationStarter.includes("?")
    ? "It's going really well, thanks for asking! How about you?"
    : "Thanks — I'm doing well. How has your week been?";

  // If they tacked a follow-up onto the end (e.g. "...so far what about you"),
  // split it into its own clean question instead of duplicating one.
  const hadTrailingFollowUp = FOLLOW_UP_RE.test(text);
  let core = text.replace(FOLLOW_UP_RE, "").trim();
  if (!core) core = text.trim();

  let out = core.charAt(0).toUpperCase() + core.slice(1);
  if (!/[.!?]$/.test(out)) out += ".";

  // Add a clean follow-up only if they attempted one or there's no question at all.
  if (hadTrailingFollowUp || !hasQuestion) out += " What about you?";
  return out;
}
