"use client";
import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutDashboard, RotateCcw, Wand2, Lightbulb, ThumbsUp, Target, Clock } from "lucide-react";
import type { Scenario, ConversationReview } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/score-ring";
import { SubScore } from "./sub-score";
import { useConfetti } from "@/hooks/useConfetti";
import { formatDuration, scoreLabel } from "@/lib/utils";

interface CompletionProps {
  scenario: Scenario;
  review: ConversationReview;
  durationSeconds: number;
  userTurns: number;
  mockMode: boolean;
  onRestart: () => void;
}

export function Completion({ scenario, review, durationSeconds, userTurns, mockMode, onRestart }: CompletionProps) {
  const fire = useConfetti();
  React.useEffect(() => {
    if (review.score >= 70) fire();
  }, [fire, review.score]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-background/80 p-4 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.96, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="glass-strong mx-auto my-6 w-full max-w-2xl rounded-3xl p-6 shadow-2xl sm:p-8"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <Badge variant="secondary" className="mb-3">Conversation report</Badge>
          <h2 className="text-2xl font-bold">{scenario.title}</h2>
          {mockMode && (
            <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
              Offline coaching mode — generated without the live model
            </p>
          )}
        </div>

        {/* Score + sub-scores */}
        <div className="mt-6 grid items-center gap-6 sm:grid-cols-[auto_1fr]">
          <div className="flex flex-col items-center">
            <ScoreRing value={review.score} label="Overall" size={132} />
            <p className="mt-2 text-sm font-medium">{scoreLabel(review.score)}</p>
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <SubScore label="Intent" value={review.intent} />
            <SubScore label="Grammar" value={review.grammar} />
            <SubScore label="Vocabulary" value={review.vocabulary} />
            <SubScore label="Fluency" value={review.fluency} />
            <SubScore label="Confidence" value={review.confidence} />
          </div>
        </div>

        {/* Meta */}
        <div className="mt-5 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {formatDuration(durationSeconds)}</span>
          <span>{userTurns} {userTurns === 1 ? "reply" : "replies"}</span>
        </div>

        {/* Summary */}
        <p className="mt-6 rounded-xl border bg-card/60 p-4 text-sm leading-relaxed">{review.summary}</p>

        {/* Strengths + improvements */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <ListCard
            icon={<ThumbsUp className="h-4 w-4 text-emerald-500" />}
            title="What you did well"
            items={review.strengths}
            tone="emerald"
          />
          <ListCard
            icon={<Target className="h-4 w-4 text-sky-500" />}
            title="What to work on"
            items={review.improvements}
            tone="sky"
          />
        </div>

        {/* Better example */}
        <div className="mt-4 text-sm">
          <h4 className="mb-1.5 flex items-center gap-1.5 font-semibold">
            <Wand2 className="h-4 w-4 text-violet-500" /> One reply, upgraded
          </h4>
          <div className="space-y-2 rounded-xl border border-violet-500/20 bg-violet-500/5 p-3">
            <p className="text-muted-foreground">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">You said</span>
              <br />
              <span className="italic">&ldquo;{review.betterExample.original}&rdquo;</span>
            </p>
            <p className="text-violet-700 dark:text-violet-300">
              <span className="text-xs font-medium uppercase tracking-wide text-violet-500/70">Try</span>
              <br />
              &ldquo;{review.betterExample.better}&rdquo;
            </p>
          </div>
        </div>

        {/* Tip */}
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-amber-700 dark:text-amber-300">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{review.tip}</p>
        </div>

        {/* Actions */}
        <div className="mt-7 flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="gradient" size="lg" className="flex-1">
            <Link href="/dashboard"><LayoutDashboard className="h-4 w-4" /> See your dashboard</Link>
          </Button>
          <Button variant="outline" size="lg" className="flex-1" onClick={onRestart}>
            <RotateCcw className="h-4 w-4" /> Practice again
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ListCard({
  icon,
  title,
  items,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  tone: "emerald" | "sky";
}) {
  const dot = tone === "emerald" ? "bg-emerald-500" : "bg-sky-500";
  return (
    <div className="rounded-xl border bg-card/60 p-4 text-sm">
      <h4 className="mb-2 flex items-center gap-1.5 font-semibold">{icon}{title}</h4>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2 text-muted-foreground">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
