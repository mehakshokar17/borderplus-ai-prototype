import { NextResponse } from "next/server";
import { generateText } from "ai";
import { getScenario } from "@/services/scenarios/data";
import { mockReply } from "@/services/ai/mock";
import { hasLLM, getLanguageModel } from "@/services/ai/config";
import type { ChatMessage } from "@/types";

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

  const history = Array.isArray(body.messages) ? body.messages : [];

  // Mock mode — no API key configured.
  const model = getLanguageModel();
  if (!hasLLM() || !model) {
    return NextResponse.json({ reply: mockReply(scenario, history), mock: true });
  }

  try {
    const turnsLeft = scenario.maxTurns - history.filter((m) => m.role === "user").length;
    const { text } = await generateText({
      model,
      system: [
        scenario.prompt,
        `Stay fully in character. Keep replies to 1-2 short, natural sentences.`,
        `This is a spoken-style conversation; do not use lists or markdown.`,
        turnsLeft <= 1
          ? "This is the final turn — warmly wrap up the conversation."
          : "End most replies with a light question to keep things flowing.",
      ].join(" "),
      messages: history.map((m) => ({ role: m.role, content: m.content })),
      temperature: 0.8,
      maxTokens: 120,
    });
    return NextResponse.json({ reply: text.trim(), mock: false });
  } catch (err) {
    console.error("chat error", err);
    // Graceful degradation to mock so the demo never dead-ends.
    return NextResponse.json({ reply: mockReply(scenario, history), mock: true });
  }
}
