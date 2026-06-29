import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { getScenario } from "@/services/scenarios/data";
import { reviewSchema } from "@/services/evaluation/review-schema";
import { buildReviewSystemPrompt, buildReviewUserPrompt } from "@/services/evaluation/review-prompt";
import { mockReview } from "@/services/evaluation/review-mock";
import { hasLLM, getLanguageModel } from "@/services/ai/config";
import type { ChatMessage, ConversationReview } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 30;

interface Body {
  scenarioId: string;
  messages: ChatMessage[];
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const scenario = getScenario(body.scenarioId);
  if (!scenario) return NextResponse.json({ error: "Unknown scenario" }, { status: 404 });

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const model = getLanguageModel();

  if (!hasLLM() || !model) {
    const review: ConversationReview = mockReview(scenario, messages);
    return NextResponse.json({ review, mock: true });
  }

  try {
    const { object } = await generateObject({
      model,
      schema: reviewSchema,
      system: buildReviewSystemPrompt(scenario),
      prompt: buildReviewUserPrompt(scenario, messages),
      temperature: 0.3,
      maxTokens: 700,
    });
    return NextResponse.json({ review: object as ConversationReview, mock: false });
  } catch (err) {
    console.error("review error", err);
    // Graceful degradation — the user still gets a full report.
    const review: ConversationReview = mockReview(scenario, messages);
    return NextResponse.json({ review, mock: true });
  }
}
