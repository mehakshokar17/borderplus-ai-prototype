"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage, ConversationReview, Evaluation, Scenario } from "@/types";
import { uid } from "@/lib/utils";
import { useProgressStore } from "@/store/useProgressStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { speak, stopSpeaking } from "@/services/speech/tts";

export type Phase = "intro" | "awaiting-user" | "evaluating" | "partner-typing" | "reviewing" | "complete";

interface TurnFeedback {
  current: Evaluation;
  previous?: Evaluation; // populated when the user retried
}

export function useConversation(scenario: Scenario) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [phase, setPhase] = useState<Phase>("intro");
  const [feedback, setFeedback] = useState<TurnFeedback | null>(null); // instant per-reply feedback
  const [review, setReview] = useState<ConversationReview | null>(null); // end-of-conversation report
  const [error, setError] = useState<string | null>(null);
  const [mockMode, setMockMode] = useState(false);

  const { addAttempt, addSession, markCompleted, bumpStreak } = useProgressStore();
  const { autoSpeak, speechRate } = useSettingsStore();
  const startedAtRef = useRef<number>(Date.now());
  const sessionScoresRef = useRef<number[]>([]); // non-retry per-turn scores

  // Seed the opener once.
  useEffect(() => {
    const opener: ChatMessage = {
      id: uid("m"),
      role: "assistant",
      content: scenario.conversationStarter,
      createdAt: Date.now(),
    };
    setMessages([opener]);
    setPhase("awaiting-user");
    startedAtRef.current = Date.now();
    if (autoSpeak) speak(scenario.conversationStarter, { rate: speechRate });
    return () => stopSpeaking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario.id]);

  const userTurns = messages.filter((m) => m.role === "user").length;
  const progress = Math.min(100, Math.round((userTurns / scenario.maxTurns) * 100));

  // ── Instant per-reply evaluation (the core "instant feedback" requirement) ──
  const evaluate = useCallback(
    async (history: ChatMessage[], text: string): Promise<Evaluation | null> => {
      try {
        const res = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scenarioId: scenario.id, userReply: text, history }),
        });
        if (!res.ok) throw new Error("eval failed");
        const data = (await res.json()) as { evaluation: Evaluation; mock?: boolean };
        if (data.mock) setMockMode(true);
        return data.evaluation;
      } catch {
        setError("Coaching is taking a break — your message was still recorded.");
        return null;
      }
    },
    [scenario.id]
  );

  const fetchPartnerReply = useCallback(
    async (history: ChatMessage[]): Promise<string> => {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scenarioId: scenario.id, messages: history }),
        });
        const data = (await res.json()) as { reply: string; mock?: boolean };
        if (data.mock) setMockMode(true);
        return data.reply ?? "Let's keep going — tell me more.";
      } catch {
        setMockMode(true);
        return "Sorry, I lost my train of thought — could you say that again?";
      }
    },
    [scenario.id]
  );

  // ── End-of-conversation report (bonus "insights" layer) ──
  const runReview = useCallback(
    async (finalMessages: ChatMessage[]) => {
      setPhase("reviewing");
      stopSpeaking();
      let result: ConversationReview | null = null;
      try {
        const res = await fetch("/api/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scenarioId: scenario.id, messages: finalMessages }),
        });
        if (!res.ok) throw new Error("review failed");
        const data = (await res.json()) as { review: ConversationReview; mock?: boolean };
        if (data.mock) setMockMode(true);
        result = data.review;
      } catch {
        setError("We couldn't generate your full report just now.");
      }

      if (result) setReview(result);

      // Persist one session per conversation (per-reply attempts are stored as we go).
      markCompleted(scenario.id);
      bumpStreak();
      const scores = sessionScoresRef.current;
      const durationSeconds = Math.round((Date.now() - startedAtRef.current) / 1000);
      addSession({
        id: uid("s"),
        scenarioId: scenario.id,
        scenarioTitle: scenario.title,
        startedAt: startedAtRef.current,
        completedAt: Date.now(),
        averageScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : result?.score ?? 0,
        bestScore: scores.length ? Math.max(...scores) : result?.score ?? 0,
        turns: finalMessages.filter((m) => m.role === "user").length,
        durationSeconds,
      });
      setPhase("complete");
    },
    [scenario, addSession, markCompleted, bumpStreak]
  );

  const busy = phase === "evaluating" || phase === "partner-typing" || phase === "reviewing";

  const submit = useCallback(
    async (rawText: string, isRetry = false) => {
      const text = rawText.trim();
      if (!text || busy || phase === "complete") return;
      setError(null);
      stopSpeaking();

      const userMsg: ChatMessage = { id: uid("m"), role: "user", content: text, createdAt: Date.now() };

      // Index of the most recent user message (used to rewind on retry).
      const reversedIdx = [...messages].reverse().findIndex((m) => m.role === "user");
      const lastUserIdx = reversedIdx === -1 ? -1 : messages.length - 1 - reversedIdx;

      // History BEFORE the reply being evaluated. On retry we rewind to just before the original.
      const historyBefore = isRetry && lastUserIdx !== -1 ? messages.slice(0, lastUserIdx) : messages;

      const nextMessages =
        isRetry && lastUserIdx !== -1
          ? [...messages.slice(0, lastUserIdx), userMsg] // replace last user msg + drop what followed
          : [...messages, userMsg];

      setMessages(nextMessages);
      setPhase("evaluating");

      // Instant feedback for THIS reply.
      const evaluation = await evaluate(historyBefore, text);
      if (evaluation) {
        setFeedback((prev) => ({ current: evaluation, previous: isRetry ? prev?.current : undefined }));
        addAttempt({
          id: uid("a"),
          scenarioId: scenario.id,
          scenarioTitle: scenario.title,
          turnIndex: nextMessages.filter((m) => m.role === "user").length,
          transcript: text,
          evaluation,
          createdAt: Date.now(),
          isRetry,
        });
        if (!isRetry) sessionScoresRef.current.push(evaluation.score);
      }

      const turnsTaken = nextMessages.filter((m) => m.role === "user").length;

      // Reached the natural end → generate the end report.
      if (turnsTaken >= scenario.maxTurns) {
        await runReview(nextMessages);
        return;
      }

      // Partner responds, then we await the next reply.
      setPhase("partner-typing");
      const reply = await fetchPartnerReply(nextMessages);
      const aiMsg: ChatMessage = { id: uid("m"), role: "assistant", content: reply, createdAt: Date.now() };
      setMessages((m) => [...m, aiMsg]);
      setPhase("awaiting-user");
      if (autoSpeak) speak(reply, { rate: speechRate });
    },
    [busy, phase, messages, evaluate, addAttempt, scenario, runReview, fetchPartnerReply, autoSpeak, speechRate]
  );

  // User-triggered "End conversation & get my report".
  const endConversation = useCallback(() => {
    if (busy || phase === "complete") return;
    if (userTurns === 0) {
      setError("Say at least one thing before ending — even a quick hello works.");
      return;
    }
    void runReview(messages);
  }, [busy, phase, userTurns, messages, runReview]);

  // Retry the latest reply (offered after instant feedback, mid-conversation).
  const canRetry = !!feedback && phase === "awaiting-user";
  const canEnd = phase === "awaiting-user" && userTurns >= 1;

  return {
    messages,
    phase,
    feedback,
    review,
    error,
    mockMode,
    progress,
    userTurns,
    submit,
    endConversation,
    canRetry,
    canEnd,
  };
}
