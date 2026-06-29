"use client";
import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Volume2, VolumeX, Flag, WifiOff } from "lucide-react";
import type { Scenario } from "@/types";
import { useConversation } from "./use-conversation";
import { MessageBubble, TypingBubble } from "./message-bubble";
import { Composer } from "./composer";
import { CoachPanel } from "./coach-panel";
import { Completion } from "./completion";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import { useElapsedTimer } from "@/hooks/useElapsedTimer";
import { useSettingsStore } from "@/store/useSettingsStore";
import { stopSpeaking } from "@/services/speech/tts";
import { formatDuration } from "@/lib/utils";

export function PracticeRoom({ scenario }: { scenario: Scenario }) {
  // restartKey remounts the session so all conversation state resets cleanly.
  const [restartKey, setRestartKey] = React.useState(0);
  return (
    <PracticeSession
      key={restartKey}
      scenario={scenario}
      onRestart={() => setRestartKey((k) => k + 1)}
    />
  );
}

function PracticeSession({ scenario, onRestart }: { scenario: Scenario; onRestart: () => void }) {
  const {
    messages, phase, feedback, review, error, mockMode,
    progress, userTurns, submit, endConversation, canRetry, canEnd,
  } = useConversation(scenario);
  const [retryMode, setRetryMode] = React.useState(false);
  const elapsed = useElapsedTimer(phase !== "complete");
  const { autoSpeak, setAutoSpeak } = useSettingsStore();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, phase]);

  const handleSubmit = (text: string) => {
    submit(text, retryMode);
    setRetryMode(false);
  };

  const busy = phase === "evaluating" || phase === "partner-typing" || phase === "reviewing";

  return (
    <div className="flex h-screen flex-col bg-mesh">
      {/* Top bar */}
      <header className="z-20 flex items-center justify-between border-b border-border/60 bg-background/70 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" aria-label="Back to scenarios">
            <Link href="/scenarios"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-violet-500 text-white">
              <Icon name={scenario.icon} className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-sm font-semibold leading-none">{scenario.title}</h1>
              <p className="mt-1 text-xs text-muted-foreground">{scenario.category}</p>
            </div>
          </div>
        </div>

        <div className="hidden items-center gap-4 sm:flex">
          {mockMode && (
            <Badge variant="warning" className="gap-1.5" title="Live model was busy — using offline coaching">
              <WifiOff className="h-3.5 w-3.5" /> Mock mode
            </Badge>
          )}
          <div className="flex w-44 items-center gap-2">
            <span className="whitespace-nowrap text-xs text-muted-foreground">
              {Math.min(userTurns, scenario.maxTurns)}/{scenario.maxTurns}
            </span>
            <Progress value={progress} />
          </div>
          <Badge variant="secondary" className="gap-1.5 tabular-nums">
            <Clock className="h-3.5 w-3.5" /> {formatDuration(elapsed)}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            aria-label={autoSpeak ? "Mute AI voice" : "Unmute AI voice"}
            onClick={() => { setAutoSpeak(!autoSpeak); stopSpeaking(); }}
          >
            {autoSpeak ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
        </div>
        <div className="sm:hidden"><Logo className="text-sm" /></div>
      </header>

      {/* Split layout */}
      <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[1fr_400px]">
        {/* Conversation */}
        <section className="flex min-h-0 flex-col">
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-8">
            <div className="mx-auto max-w-2xl space-y-4">
              <div className="rounded-xl border border-dashed bg-card/40 p-3 text-center text-xs text-muted-foreground">
                You&apos;re practicing: <b className="text-foreground">{scenario.description}</b>
              </div>
              {messages.map((m) => <MessageBubble key={m.id} message={m} />)}
              {phase === "partner-typing" && <TypingBubble />}
              {error && <p className="text-center text-xs text-rose-500">{error}</p>}
            </div>
          </div>
          <div className="border-t bg-background/60 p-4 backdrop-blur-xl">
            <div className="mx-auto max-w-2xl">
              {retryMode && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mb-2">
                  <Badge variant="warning">Retry mode — your previous score is saved for comparison</Badge>
                </motion.div>
              )}
              <Composer
                onSubmit={handleSubmit}
                disabled={busy || phase === "complete"}
                placeholder={phase === "complete" ? "Conversation complete 🎉" : undefined}
                onEnd={endConversation}
                canEnd={canEnd}
              />
            </div>
          </div>
        </section>

        {/* Coach (desktop) */}
        <aside className="hidden min-h-0 border-l bg-card/50 backdrop-blur-xl lg:block">
          <CoachPanel
            feedback={feedback}
            phase={phase}
            canRetry={canRetry && !retryMode}
            onRetry={() => setRetryMode(true)}
            canEnd={canEnd}
            onEnd={endConversation}
          />
        </aside>

        {/* Coach (mobile) */}
        <aside className="border-t bg-card/50 lg:hidden">
          <CoachPanel
            feedback={feedback}
            phase={phase}
            canRetry={canRetry && !retryMode}
            onRetry={() => setRetryMode(true)}
            canEnd={canEnd}
            onEnd={endConversation}
          />
        </aside>
      </div>

      {phase === "complete" && review && (
        <Completion
          scenario={scenario}
          review={review}
          durationSeconds={elapsed}
          userTurns={userTurns}
          mockMode={mockMode}
          onRestart={() => { stopSpeaking(); onRestart(); }}
        />
      )}
    </div>
  );
}
