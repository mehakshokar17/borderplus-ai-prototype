"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Wand2, TrendingUp, RotateCcw, MessageSquareQuote, Sparkles, Flag, Loader2 } from "lucide-react";
import type { Evaluation } from "@/types";
import type { Phase } from "./use-conversation";
import { ScoreRing } from "@/components/score-ring";
import { SubScore } from "./sub-score";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { scoreLabel } from "@/lib/utils";

interface CoachPanelProps {
  feedback: { current: Evaluation; previous?: Evaluation } | null;
  phase: Phase;
  canRetry: boolean;
  onRetry: () => void;
  canEnd: boolean;
  onEnd: () => void;
}

export function CoachPanel({ feedback, phase, canRetry, onRetry, canEnd, onEnd }: CoachPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b px-5 py-4">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-violet-500 text-white">
          <Sparkles className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-sm font-semibold leading-none">AI Coach</h2>
          <p className="mt-1 text-xs text-muted-foreground">Instant feedback after each reply</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <AnimatePresence mode="wait">
          {phase === "reviewing" ? (
            <Analyzing key="analyzing" />
          ) : phase === "evaluating" ? (
            <LoadingState key="loading" />
          ) : !feedback ? (
            <EmptyState key="empty" />
          ) : (
            <Feedback key="fb" feedback={feedback} canRetry={canRetry} onRetry={onRetry} />
          )}
        </AnimatePresence>
      </div>

      {/* Always-available end action */}
      <div className="border-t p-4">
        <Button
          variant={feedback ? "outline" : "gradient"}
          className="w-full"
          onClick={onEnd}
          disabled={!canEnd}
          aria-label="End conversation and get your full report"
        >
          <Flag className="h-4 w-4" /> End & get full report
        </Button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          {canEnd ? "Finish whenever you're ready — or play out all turns" : "Send a reply to enable"}
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full flex-col items-center justify-center text-center"
    >
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-accent text-accent-foreground animate-float">
        <MessageSquareQuote className="h-8 w-8" />
      </div>
      <h3 className="mt-5 font-semibold">Your coaching appears here</h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Reply to your conversation partner and you&apos;ll get a score, a better version of your
        answer, and one tip — instantly.
      </p>
    </motion.div>
  );
}

function LoadingState() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
      <div className="flex justify-center"><Skeleton className="h-28 w-28 rounded-full" /></div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
      </div>
      <Skeleton className="h-24 w-full" />
      <p className="text-center text-xs text-muted-foreground">Coaching your reply…</p>
    </motion.div>
  );
}

function Analyzing() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full flex-col items-center justify-center text-center"
    >
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-violet-500 text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
      <h3 className="mt-5 font-semibold">Building your full report…</h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Summarizing strengths, areas to improve, and one upgraded reply across the whole chat.
      </p>
    </motion.div>
  );
}

function Feedback({
  feedback,
  canRetry,
  onRetry,
}: {
  feedback: { current: Evaluation; previous?: Evaluation };
  canRetry: boolean;
  onRetry: () => void;
}) {
  const e = feedback.current;
  const diff = feedback.previous ? e.score - feedback.previous.score : null;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
      <div className="flex flex-col items-center">
        <ScoreRing value={e.score} label="Score" size={128} />
        <p className="mt-2 text-sm font-medium">{scoreLabel(e.score)}</p>
        {diff !== null && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-2">
            <Badge variant={diff >= 0 ? "success" : "danger"}>
              <TrendingUp className="h-3 w-3" />
              {diff >= 0 ? `+${diff}` : diff} vs last try (was {feedback.previous!.score})
            </Badge>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3">
        <SubScore label="Intent match" value={e.intent} />
        <SubScore label="Grammar" value={e.grammar} />
        <SubScore label="Vocabulary" value={e.vocabulary} />
        <SubScore label="Fluency" value={e.fluency} />
        <SubScore label="Confidence" value={e.confidence} />
      </div>

      {e.transcript && (
        <Section icon={<MessageSquareQuote className="h-4 w-4" />} title="What you said">
          <p className="italic text-muted-foreground">&ldquo;{e.transcript}&rdquo;</p>
        </Section>
      )}

      <Section title="Feedback">
        <p>{e.feedback}</p>
        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
          <li><b className="text-foreground">Grammar:</b> {e.grammarNotes}</li>
          <li><b className="text-foreground">Vocabulary:</b> {e.vocabularyNotes}</li>
          <li><b className="text-foreground">Fluency:</b> {e.fluencyNotes}</li>
        </ul>
      </Section>

      <Section icon={<Wand2 className="h-4 w-4 text-violet-500" />} title="Better version">
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-3 text-violet-700 dark:text-violet-300">
          {e.betterResponse}
        </div>
      </Section>

      <Section icon={<Lightbulb className="h-4 w-4 text-amber-500" />} title="One tip">
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-amber-700 dark:text-amber-300">
          {e.tip}
        </div>
      </Section>

      {canRetry && (
        <Button variant="outline" className="w-full" onClick={onRetry}>
          <RotateCcw className="h-4 w-4" /> Retry this reply
        </Button>
      )}
    </motion.div>
  );
}

function Section({ icon, title, children }: { icon?: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="text-sm">
      <h4 className="mb-1.5 flex items-center gap-1.5 font-semibold">{icon}{title}</h4>
      {children}
    </div>
  );
}
