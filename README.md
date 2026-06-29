# BorderPlus AI — Practice Real Conversations with AI

> Build confidence before speaking in real life.

An AI conversation-practice prototype for people who understand a language but want to
speak it more confidently after moving to a new country. Pick a real-life scenario, have
a short voice-or-text conversation with an AI partner, get **instant, kind coaching after
every reply**, and finish with a **full end-of-conversation report**.

Think **Duolingo + ChatGPT Voice + interview prep**, with a Linear/Notion-grade UI.

📄 See [`PRODUCT_NOTE.md`](./PRODUCT_NOTE.md) for the problem, feature rationale, market
insights, hypothesis, and prioritization.

---

## ✨ Highlights

- **Instant per-reply coaching** (the core loop): transcript, communication score (0–100),
  intent / grammar / vocabulary / fluency / confidence sub-scores, written feedback, a
  natural **better version**, and **one actionable tip** — after every reply.
- **Multi-turn conversations** with a fully in-character AI partner.
- **Voice _and_ typing** — speak using the browser's **live Web Speech API** (free, on-device,
  real-time transcription) or type. AI replies are spoken aloud via SpeechSynthesis (toggleable).
- **Retry flow** — re-answer the same prompt and see Previous → New score with an improvement badge.
- **End-of-conversation report** — end anytime (or play out all turns) for a holistic review:
  overall score, sub-skill breakdown, strengths, areas to work on, one real reply upgraded, and a tip.
- **Progress tracking** in `localStorage`: attempts, average/best score, completion %, streaks,
  achievements, full session history — surfaced in a **dashboard** (KPI cards, weekly chart,
  skill radar, recent activity).
- **Premium UX** — glassmorphism, gradient mesh, Framer Motion micro-interactions, skeletons,
  empty states, confetti, dark mode, keyboard shortcuts, fully responsive.
- **Works with zero API keys** via a built-in **mock mode**, and automatically upgrades to a real
  model when a key is present. If the live model is rate-limited, it falls back to mock and shows a
  visible **"Mock mode"** badge — the demo never dead-ends.

---

## 🧱 Tech stack

| Concern | Choice |
| --- | --- |
| Framework | **Next.js 15** (App Router, RSC) + **React 19** + **TypeScript** |
| Styling | **Tailwind CSS** + shadcn/ui-style primitives + **tailwindcss-animate** |
| Animation | **Framer Motion** · Icons **Lucide** |
| AI | **Vercel AI SDK** (`ai`) — provider chain: **OpenRouter → Gemini → OpenAI → mock** |
| Default model | `google/gemma-4-31b-it:free` (via OpenRouter) — overridable |
| Speech-to-text | Browser **Web Speech API** (live, free) · recorder→`/api/transcribe` fallback |
| Text-to-speech | Browser **SpeechSynthesis** (no key required) |
| State | **Zustand** (+ `persist`) · Validation **Zod** (also powers structured AI output) |
| Charts | Recharts · Confetti canvas-confetti |

---

## 📁 Project structure (feature folders)

```
borderplus-ai/
├── app/
│   ├── api/
│   │   ├── chat/route.ts       # AI conversation partner (mock fallback)
│   │   ├── evaluate/route.ts   # Instant per-reply evaluation → JSON (generateObject + Zod)
│   │   ├── review/route.ts     # End-of-conversation report → JSON (single call)
│   │   └── transcribe/route.ts # Recorder STT fallback (mock when no STT provider)
│   ├── page.tsx · scenarios/ · practice/[id]/ · dashboard/ · layout.tsx · globals.css
├── components/                 # Shared UI (navbar, theme, score ring, ui/* primitives)
├── features/                   # landing / scenarios / practice / dashboard
├── hooks/                      # useRecorder, useSpeechRecognition, useConfetti, useElapsedTimer
├── services/
│   ├── ai/         # provider config (getLanguageModel) + mock partner
│   ├── speech/     # tts (browser) + transcribe client
│   ├── evaluation/ # zod schemas + prompts + mock evaluator + mock review
│   ├── scenarios/  # 10-scenario catalog
│   └── analytics/  # dashboard derivations
├── store/  types/  +  tailwind / tsconfig / next.config / .env.example
```

---

## 🚀 Getting started

```bash
npm install

# (Optional) add a key to enable real models
cp .env.example .env.local
#   → set OPENROUTER_API_KEY=sk-or-...   (free key at https://openrouter.ai/keys)

npm run dev          # http://localhost:3000

npm run build        # production build
npm run typecheck    # tsc --noEmit
```

> **No keys? No problem.** Without a provider key the app runs in **mock mode**: the partner
> uses context-aware scripted replies, the coach uses a heuristic evaluator that reacts to your
> actual text, and the report aggregates across the conversation — fully demoable, offline.

### Environment variables (priority: OpenRouter → Gemini → OpenAI)

| Variable | Required | Purpose |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | No (enables real AI) | Conversation + evaluation + review. One key, many models. |
| `OPENROUTER_MODEL` | No | Default `google/gemma-4-31b-it:free`. Any OpenRouter model id. |
| `GEMINI_API_KEY` | No | Fallback provider; also enables real voice transcription (multimodal). |
| `GEMINI_MODEL` | No | Default `gemini-2.5-flash`. |
| `OPENAI_API_KEY` / `OPENAI_MODEL` | No | Second fallback (GPT-4o + Whisper STT). |

> Voice input uses the browser's **Web Speech API** by default (no key needed). The
> `/api/transcribe` route is a fallback used only when the browser lacks speech recognition.

---

## ☁️ Deployment (Vercel)

1. Push to GitHub → **Import** in Vercel (auto-detects Next.js).
2. Add `OPENROUTER_API_KEY` (and optionally a model override) in **Settings → Environment Variables**.
3. Deploy. API routes run as serverless functions (`runtime = "nodejs"`).

Any Node host works too: `npm run build && npm run start`.

---

## 🤖 AI integration

All model access goes through one provider-agnostic helper, `services/ai/config.ts →
getLanguageModel()`, which selects **OpenRouter → Gemini → OpenAI** based on which key is set,
and returns `null` for mock mode.

- **Conversation partner** — `app/api/chat/route.ts`: `generateText` with an in-character
  scenario prompt; short, spoken-style replies; graceful mock fallback.
- **Instant evaluation** — `app/api/evaluate/route.ts`: `generateObject` + Zod
  (`services/evaluation/schema.ts`) returns strictly-typed per-reply feedback.
- **End report** — `app/api/review/route.ts`: a single `generateObject` call over the whole
  transcript (`review-schema.ts`) → overall score, strengths, improvements, an upgraded reply, a tip.
- **Speech-to-text** — `hooks/useSpeechRecognition.ts` (browser Web Speech API, live). Falls back
  to record→`/api/transcribe`, which uses Gemini multimodal / Whisper when those keys exist, else mock.

Every AI route degrades to mock on error (e.g. free-tier rate limits) and the UI surfaces a
**Mock mode** badge so it's always clear whether real models are firing.

---

## 🗂️ Mock data & sample prompts

- **10 scenarios** in `services/scenarios/data.ts` (Workplace · Daily Life · Immigration).
- See **`SAMPLE_PROMPTS.md`** for example replies and the coaching they produce — a quick demo script.

---

Built as a prototype for **BorderPlus AI**. Practice. Reflect. Speak with confidence.
