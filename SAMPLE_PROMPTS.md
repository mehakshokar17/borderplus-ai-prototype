# Sample prompts & demo script

A quick way to show the product end to end. Works identically in mock mode and with a
real `OPENAI_API_KEY` (real mode just produces richer, model-written coaching).

## Conversation partner — system prompt shape

Each scenario injects a persona, e.g. **Small Talk with Colleague**:

> You are a warm, friendly colleague making relaxed small talk near the office coffee
> machine. Keep replies short, casual, and encouraging. Ask light follow-up questions
> about their weekend and week ahead.
>
> Opener: **"Hey! How's your week going so far?"**

## Evaluation prompt (returns strict JSON via Zod)

System: an encouraging expert English coach. Given the conversation + the learner's
latest reply, score `score / intent / grammar / vocabulary / fluency / confidence`
(0–100), and return `feedback`, a natural `betterResponse`, and one `tip`.

---

## Demo script

| Scenario | Try saying (weak) | Then retry with (strong) |
| --- | --- | --- |
| Small Talk with Colleague | "good" | "It's been pretty busy but good — I shipped a project I'm proud of. How about yours?" |
| Ordering Coffee | "coffee" | "Could I get a medium oat-milk latte, please — and make it a little less sweet?" |
| Airport Immigration | "vacation" | "I'm here on holiday for about a week, staying with friends near the city centre." |
| Talking to Manager | "it's fine" | "Good progress — the API is done. One blocker is the staging key; could you approve it today?" |

**What to point out during a demo**
1. Type _or_ tap the mic → Whisper transcribes (sample transcript in mock mode).
2. The AI partner stays in character and asks a natural follow-up.
3. The coach panel animates in: score ring + sub-scores + better version + one tip.
4. Hit **Retry this reply**, give the stronger answer, and show the green
   **+N vs last try** improvement badge.
5. Finish 5 turns → **confetti** + completion summary.
6. Open **Dashboard** → KPI cards, weekly chart, skill radar, streak, achievements.

---

## Example evaluation output

Input reply: *"good"* →

```json
{
  "score": 41, "intent": 54, "grammar": 60, "vocabulary": 58,
  "fluency": 64, "confidence": 52,
  "feedback": "You got your point across. A little more detail will make it land even stronger.",
  "betterResponse": "Good, thanks! What about you?",
  "tip": "Try a longer sentence with a bit more detail."
}
```

Input reply: *"It's been busy but good — I shipped a project I'm proud of. How about you?"* →

```json
{
  "score": 90, "intent": 92, "grammar": 88, "vocabulary": 86,
  "fluency": 90, "confidence": 91,
  "feedback": "Great length and a natural follow-up question kept the other person engaged.",
  "betterResponse": "It's been busy but good — I shipped a project I'm proud of. How about you?",
  "tip": "Great length — now try varying your sentence openings."
}
```
