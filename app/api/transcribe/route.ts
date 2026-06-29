import { NextResponse } from "next/server";
import { generateText } from "ai";
import { hasGemini, hasOpenAI, getLanguageModel } from "@/services/ai/config";

export const runtime = "nodejs";
export const maxDuration = 30;

const MOCK_TRANSCRIPTS = [
  "Hi, my week has been pretty good so far, thanks for asking. How about you?",
  "I work mostly on the product side, helping the team plan what to build next.",
  "I'd like a medium oat milk latte, please. And could I get it a little less sweet?",
  "I'm here for a short business trip, about five days, staying near the city centre.",
];

export async function POST(req: Request) {
  // Mock mode — no provider configured. Return a realistic transcript so voice mode still demos.
  if (!hasGemini() && !hasOpenAI()) {
    const text = MOCK_TRANSCRIPTS[Math.floor(Math.random() * MOCK_TRANSCRIPTS.length)];
    return NextResponse.json({ text, mock: true });
  }

  try {
    const form = await req.formData();
    const audio = form.get("audio");
    if (!(audio instanceof Blob)) {
      return NextResponse.json({ error: "No audio provided" }, { status: 400 });
    }

    // ── Gemini (primary): multimodal transcription via the AI SDK ─────────────
    // Gemini has no dedicated speech endpoint, but its models accept audio input.
    if (hasGemini()) {
      const model = getLanguageModel();
      if (!model) return NextResponse.json({ error: "No model" }, { status: 500 });
      const bytes = new Uint8Array(await audio.arrayBuffer());
      const { text } = await generateText({
        model,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Transcribe this audio to plain English text. Return ONLY the spoken words, with natural punctuation — no quotes, labels, or commentary.",
              },
              { type: "file", data: bytes, mimeType: audio.type || "audio/webm" },
            ],
          },
        ],
        temperature: 0,
      });
      return NextResponse.json({ text: text.trim(), mock: false });
    }

    // ── OpenAI (fallback): Whisper ────────────────────────────────────────────
    const upstream = new FormData();
    upstream.append("file", audio, "speech.webm");
    upstream.append("model", "whisper-1");
    upstream.append("language", "en");

    const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: upstream,
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("whisper error", detail);
      return NextResponse.json({ error: "Transcription failed" }, { status: 502 });
    }
    const data = (await res.json()) as { text: string };
    return NextResponse.json({ text: data.text ?? "", mock: false });
  } catch (err) {
    console.error("transcribe error", err);
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
  }
}
