"use client";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/icon";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  hint?: string;
  index?: number;
  accent?: string;
}

export function StatCard({ label, value, icon, hint, index = 0, accent = "from-primary to-violet-500" }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="relative overflow-hidden p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className={`grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br ${accent} text-white`}>
            <Icon name={icon} className="h-4 w-4" />
          </span>
        </div>
        <div className="mt-3 text-3xl font-bold tabular-nums">{value}</div>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </Card>
    </motion.div>
  );
}
