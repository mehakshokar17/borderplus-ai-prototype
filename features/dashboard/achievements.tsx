"use client";
import { motion } from "framer-motion";
import { ACHIEVEMENTS } from "@/lib/achievements";
import type { ProgressState } from "@/types";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

export function Achievements({ progress }: { progress: ProgressState }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {ACHIEVEMENTS.map((a, i) => {
        const unlocked = a.unlocked(progress);
        return (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-3 transition-colors",
              unlocked ? "bg-card" : "bg-muted/40 opacity-60"
            )}
          >
            <span
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-lg",
                unlocked ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white" : "bg-muted text-muted-foreground"
              )}
            >
              <Icon name={a.icon} className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">{a.title}</p>
              <p className="truncate text-[11px] text-muted-foreground">{a.description}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
