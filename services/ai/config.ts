import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModelV1 } from "ai";

/** Central place to read AI config + detect which real models are available. */

// ── OpenRouter (primary) ─────────────────────────────────────────────────────
// One key, many models. Free models use a ":free" suffix.
export const hasOpenRouter = () => !!process.env.OPENROUTER_API_KEY;
export const openRouterModel = () =>
  process.env.OPENROUTER_MODEL || "google/gemma-4-31b-it:free";

// ── Gemini (fallback) ────────────────────────────────────────────────────────
export const geminiApiKey = () =>
  process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
export const hasGemini = () => !!geminiApiKey();
export const geminiModel = () => process.env.GEMINI_MODEL || "gemini-2.5-flash";

// ── OpenAI (fallback) ────────────────────────────────────────────────────────
export const hasOpenAI = () => !!process.env.OPENAI_API_KEY;
export const openAIModel = () => process.env.OPENAI_MODEL || "gpt-4o";

// ── ElevenLabs voice (optional) ──────────────────────────────────────────────
export const hasElevenLabs = () =>
  !!process.env.ELEVENLABS_API_KEY && !!process.env.ELEVENLABS_VOICE_ID;

/** True when any real text model is configured (otherwise the app runs in mock mode). */
export const hasLLM = () => hasOpenRouter() || hasGemini() || hasOpenAI();

/** Which provider is active — handy for logging / debug badges. */
export const activeProvider = (): "gemini" | "openrouter" | "openai" | "mock" =>
  hasGemini() ? "gemini" : hasOpenRouter() ? "openrouter" : hasOpenAI() ? "openai" : "mock";

/**
 * Returns the active chat/eval language model for the Vercel AI SDK.
 * Priority: Gemini → OpenRouter → OpenAI. Returns null in mock mode.
 * (Gemini first: a standard Gemini key is more reliable than OpenRouter's
 * shared free-model pool, which throttles under load.)
 */
export function getLanguageModel(): LanguageModelV1 | null {
  if (hasGemini()) {
    const google = createGoogleGenerativeAI({ apiKey: geminiApiKey() });
    return google(geminiModel());
  }
  if (hasOpenRouter()) {
    const openrouter = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });
    return openrouter(openRouterModel()) as unknown as LanguageModelV1;
  }
  if (hasOpenAI()) {
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
    return openai(openAIModel());
  }
  return null;
}
