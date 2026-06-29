import type { Scenario } from "@/types";

/**
 * Mock scenario catalog. Each scenario defines the AI partner persona (prompt),
 * the conversation opener, the target intent for evaluation, and metadata.
 */
export const SCENARIOS: Scenario[] = [
  {
    id: "small-talk-colleague",
    title: "Small Talk with Colleague",
    category: "Workplace",
    icon: "Coffee",
    difficulty: "Beginner",
    estimatedMinutes: 4,
    description: "Casual Monday-morning chat by the coffee machine.",
    prompt:
      "You are a warm, friendly colleague making relaxed small talk near the office coffee machine. Keep replies short, casual, and encouraging. Ask light follow-up questions about their weekend and week ahead.",
    expectedIntent:
      "Engage in friendly small talk: share something about your week and ask a follow-up question.",
    conversationStarter: "Hey! How's your week going so far?",
    maxTurns: 5,
  },
  {
    id: "explaining-your-work",
    title: "Explaining Your Work",
    category: "Workplace",
    icon: "Presentation",
    difficulty: "Intermediate",
    estimatedMinutes: 6,
    description: "Describe what you do to a curious new teammate.",
    prompt:
      "You are a curious new teammate who wants to understand what this person does day to day. Ask clear, genuine follow-up questions and react naturally to keep them explaining.",
    expectedIntent:
      "Clearly explain your role and responsibilities in simple, confident language.",
    conversationStarter: "Nice to meet you! So, what do you actually work on here?",
    maxTurns: 5,
  },
  {
    id: "answering-questions",
    title: "Answering Questions",
    category: "Workplace",
    icon: "MessageCircleQuestion",
    difficulty: "Intermediate",
    estimatedMinutes: 6,
    description: "Field questions confidently in a team setting.",
    prompt:
      "You are a teammate asking thoughtful questions about a project the person is involved in. Probe gently for detail and acknowledge good answers.",
    expectedIntent:
      "Answer questions directly and concisely, then add a relevant detail.",
    conversationStarter: "Quick question — can you walk me through how this part works?",
    maxTurns: 5,
  },
  {
    id: "talking-to-manager",
    title: "Talking to Manager",
    category: "Workplace",
    icon: "UserCog",
    difficulty: "Advanced",
    estimatedMinutes: 7,
    description: "A 1:1 check-in about progress and priorities.",
    prompt:
      "You are a supportive but busy manager in a 1:1 check-in. Ask about progress, blockers, and priorities. Be professional and concise, and push lightly for specifics.",
    expectedIntent:
      "Give a confident status update, surface one blocker, and propose a next step.",
    conversationStarter: "Thanks for hopping on. How are things going on your side?",
    maxTurns: 5,
  },
  {
    id: "meeting-new-people",
    title: "Meeting New People",
    category: "Daily Life",
    icon: "Users",
    difficulty: "Beginner",
    estimatedMinutes: 4,
    description: "Introduce yourself at a casual social event.",
    prompt:
      "You are a friendly stranger at a casual social gathering. Introduce yourself, ask where they're from, and keep the conversation light and welcoming.",
    expectedIntent:
      "Introduce yourself naturally and ask a question back to keep the chat going.",
    conversationStarter: "Hi there! I don't think we've met — I'm Sam. How do you know the host?",
    maxTurns: 5,
  },
  {
    id: "ordering-coffee",
    title: "Ordering Coffee",
    category: "Daily Life",
    icon: "CupSoda",
    difficulty: "Beginner",
    estimatedMinutes: 3,
    description: "Order a drink and handle a quick follow-up.",
    prompt:
      "You are a cheerful barista taking an order. Greet the customer, take their order, ask a clarifying question (size, milk, name), and confirm warmly.",
    expectedIntent:
      "Place a clear order and respond to the barista's follow-up question.",
    conversationStarter: "Hi, welcome in! What can I get started for you?",
    maxTurns: 5,
  },
  {
    id: "small-talk-neighbor",
    title: "Chatting with a Neighbor",
    category: "Daily Life",
    icon: "Home",
    difficulty: "Beginner",
    estimatedMinutes: 4,
    description: "Friendly hallway chat with a neighbor.",
    prompt:
      "You are a kind neighbor running into the person in the hallway. Make warm small talk about the building, the weather, and the neighborhood.",
    expectedIntent:
      "Make polite small talk and ask a friendly question in return.",
    conversationStarter: "Oh hey neighbor! Settling in okay? How are you finding the building?",
    maxTurns: 5,
  },
  {
    id: "doctor-appointment",
    title: "Doctor Appointment",
    category: "Daily Life",
    icon: "Stethoscope",
    difficulty: "Intermediate",
    estimatedMinutes: 6,
    description: "Describe symptoms clearly to a doctor.",
    prompt:
      "You are a calm, attentive doctor. Greet the patient, ask what brings them in, and ask clarifying questions about their symptoms. Be reassuring and clear.",
    expectedIntent:
      "Describe your symptoms clearly and answer the doctor's follow-up questions.",
    conversationStarter: "Hello, come on in. So, what brings you in today?",
    maxTurns: 5,
  },
  {
    id: "airport-immigration",
    title: "Airport Immigration",
    category: "Immigration",
    icon: "Plane",
    difficulty: "Advanced",
    estimatedMinutes: 6,
    description: "Answer an immigration officer at the border.",
    prompt:
      "You are a polite but firm immigration officer at passport control. Ask about the purpose of the visit, length of stay, and where they will be staying. Keep it professional and brief.",
    expectedIntent:
      "Answer the officer's questions clearly, briefly, and confidently.",
    conversationStarter: "Good afternoon. Passport, please. What's the purpose of your visit?",
    maxTurns: 5,
  },
  {
    id: "opening-bank-account",
    title: "Opening a Bank Account",
    category: "Immigration",
    icon: "Landmark",
    difficulty: "Intermediate",
    estimatedMinutes: 6,
    description: "Set up essentials after relocating.",
    prompt:
      "You are a helpful bank representative assisting a newcomer in opening an account. Ask what they need, explain options simply, and request the relevant details.",
    expectedIntent:
      "Explain what you need and respond to the representative's questions.",
    conversationStarter: "Welcome! How can I help you today — are you looking to open an account?",
    maxTurns: 5,
  },
];

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

export const CATEGORIES = ["Workplace", "Daily Life", "Immigration"] as const;
