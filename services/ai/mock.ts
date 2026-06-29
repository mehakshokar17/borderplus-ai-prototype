import type { ChatMessage, Scenario } from "@/types";

/** Lightweight scripted partner replies for offline/mock mode. */
const GENERIC: string[] = [
  "That's interesting — tell me a bit more about that.",
  "Nice! And how did that make you feel?",
  "Got it. So what happened next?",
  "Makes sense. What are you hoping to do about it?",
  "Love that. Anything else on your mind?",
];

export function mockReply(scenario: Scenario, history: ChatMessage[]): string {
  const userTurns = history.filter((m) => m.role === "user").length;
  if (userTurns >= scenario.maxTurns - 1) {
    return "This was a great chat — you sounded confident. Let's wrap up here. Nicely done!";
  }
  const last = history.filter((m) => m.role === "user").pop()?.content.toLowerCase() ?? "";
  if (/coffee|latte|tea|cappuccino|order/.test(last)) {
    return "Great choice! What size would you like, and can I get a name for the order?";
  }
  if (/visit|holiday|business|stay|days|week/.test(last)) {
    return "Thank you. And where will you be staying during your visit?";
  }
  if (/good|fine|great|well|busy/.test(last)) {
    return "Glad to hear it! What's been keeping you busy lately?";
  }
  return GENERIC[userTurns % GENERIC.length];
}
