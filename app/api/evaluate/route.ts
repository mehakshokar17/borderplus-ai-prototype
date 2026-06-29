import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { getScenario } from "@/services/scenarios/data";
import { evaluationSchema } from "@/services/evaluation/schema";
import { buildEvaluationSystemPrompt, buildEvaluationUserPrompt } from "@/services/evaluation/prompt";
import { mockEvaluate } from "@/services/evaluation/mock";
import { hasLLM, getLanguageModel } from "@/services/ai/config";
import type { ChatMessage, Evaluation } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 30;

interface Body {
  scenarioId: string;
  userReply: string;
  history: ChatMessage[];
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

  const userReply = (body.userReply || "").trim();
  const history = Array.isArray(body.history) ? body.history : [];
  // The partner line the user is responding to — lets the mock coach decide whether a
  // reciprocal follow-up makes sense in this scenario.
  const lastPartnerLine = [...history].reverse().find((m) => m.role === "assistant")?.content ?? "";

  const model = getLanguageModel();
  if (!hasLLM() || !model) {
    const out = mockEvaluate(userReply, scenario, lastPartnerLine);
    const evaluation: Evaluation = { ...out, transcript: userReply };
    return NextResponse.json({ evaluation, mock: true });
  }

  try {
    const { object } = await generateObject({
      model,
      schema: evaluationSchema,
      system: buildEvaluationSystemPrompt(scenario),
      prompt: buildEvaluationUserPrompt({
        history: history.map((m) => ({ role: m.role, content: m.content })),
        userReply,
      }),
      temperature: 0.3,
    });
    const evaluation: Evaluation = { ...object, transcript: userReply };
    return NextResponse.json({ evaluation, mock: false });
  } catch (err) {
    console.error("evaluate error", err);
    const out = mockEvaluate(userReply, scenario, lastPartnerLine);
    const evaluation: Evaluation = { ...out, transcript: userReply };
    return NextResponse.json({ evaluation, mock: true });
  }
}
