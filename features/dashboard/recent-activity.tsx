"use client";
import { motion } from "framer-motion";
import type { AttemptRecord } from "@/types";
import { Badge } from "@/components/ui/badge";
import { scoreColor } from "@/lib/utils";

export function RecentActivity({ attempts }: { attempts: AttemptRecord[] }) {
  const recent = [...attempts].reverse().slice(0, 6);
  if (recent.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No activity yet — start a scenario to see it here.</p>;
  }
  return (
    <ul className="divide-y">
      {recent.map((a, i) => (
        <motion.li
          key={a.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="flex items-center justify-between gap-3 py-3"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{a.scenarioTitle}</p>
            <p className="truncate text-xs text-muted-foreground">
              &ldquo;{a.transcript || "—"}&rdquo;
            </p>
          </div>
          <div className="flex items-center gap-2">
            {a.isRetry && <Badge variant="secondary">retry</Badge>}
            <span className={`text-lg font-bold tabular-nums ${scoreColor(a.evaluation.score)}`}>
              {a.evaluation.score}
            </span>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
