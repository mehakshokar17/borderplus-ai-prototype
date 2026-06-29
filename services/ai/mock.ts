import type { ChatMessage, Scenario } from "@/types";

/** Lightweight scripted partner replies for offline/mock mode. */
const GENERIC: string[] = [
  "That's interesting — tell me a bit more about that.",
  "Nice! And how did that make you feel?",
  "Got it. So what happened next?",
  "Makes sense. What are you hoping to do about it?",
  "Love that. Anything else on your mind?",
  "Oh really? What made you go with that?",
  "Fair enough. How's that been working out?",
];

// Each intent has several variants so the partner doesn't loop the same line.
const BY_INTENT: Record<string, string[]> = {
  order: [
    "Great choice! What size would you like?",
    "Coming right up — anything to go with that?",
    "Sure thing. Can I get a name for the order?",
  ],
  stay: [
    "Sounds good. Is it your first time in the area?",
    "Nice — how long are you in town for?",
    "Got it. Have you settled in okay so far?",
  ],
  doing_well: [
    "Glad to hear it! What's been keeping you busy?",
    "Love that. Anything fun planned this week?",
    "Nice one — what's been the highlight so far?",
  ],
  weekend: [
    "Sounds lovely! Did you get to relax at all?",
    "Nice — who did you go with?",
    "That's great. Would you do it again?",
  ],
};

function detectIntent(text: string): keyof typeof BY_INTENT | null {
  if (/coffee|latte|tea|cappuccino|order|cup|drink/.test(text)) return "order";
  if (/visit|holiday|business|stay|staying|hotel|days|trip/.test(text)) return "stay";
  if (/weekend|hiking|trip|movie|game|party/.test(text)) return "weekend";
  if (/good|fine|great|well|busy|okay|alright/.test(text)) return "doing_well";
  return null;
}

export function mockReply(scenario: Scenario, history: ChatMessage[]): string {
  const userMsgs = history.filter((m) => m.role === "user");
  const userTurns = userMsgs.length;

  if (userTurns >= scenario.maxTurns - 1) {
    return "This was a great chat — you sounded confident. Let's wrap up here. Nicely done!";
  }

  const lastAssistant = history.filter((m) => m.role === "assistant").pop()?.content ?? "";
  const last = userMsgs[userMsgs.length - 1]?.content.toLowerCase() ?? "";

  // Build a candidate list: intent-matched variants first, then generic.
  const intent = detectIntent(last);
  const pool = [...(intent ? BY_INTENT[intent] : []), ...GENERIC];

  // Pick the first candidate that isn't the line we just said — rotate by turn so
  // repeated intents still advance through the variants.
  const rotated = pool.slice(userTurns % pool.length).concat(pool.slice(0, userTurns % pool.length));
  const next = rotated.find((line) => line !== lastAssistant) ?? GENERIC[userTurns % GENERIC.length];
  return next;
}
