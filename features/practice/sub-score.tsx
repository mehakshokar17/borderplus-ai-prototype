"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SubScore({ label, value }: { label: string; value: number }) {
  const color =
    value >= 85 ? "from-emerald-500 to-emerald-400"
    : value >= 70 ? "from-amber-500 to-amber-400"
    : value >= 50 ? "from-orange-500 to-orange-400"
    : "from-rose-500 to-rose-400";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold tabular-nums">{value}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          className={cn("h-full rounded-full bg-gradient-to-r", color)}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
