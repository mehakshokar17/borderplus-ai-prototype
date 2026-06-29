"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import type { Scenario } from "@/types";
import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useProgressStore } from "@/store/useProgressStore";

const diffVariant = {
  Beginner: "success",
  Intermediate: "warning",
  Advanced: "danger",
} as const;

export function ScenarioCard({ scenario, index }: { scenario: Scenario; index: number }) {
  const completed = useProgressStore((s) => s.completedScenarioIds.includes(scenario.id));
  const best = useProgressStore((s) => s.bestForScenario(scenario.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <Link href={`/practice/${scenario.id}`} className="block h-full focus:outline-none">
        <Card className="group relative h-full overflow-hidden p-6 transition-shadow hover:shadow-xl hover:shadow-primary/10">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-primary/15 to-fuchsia-500/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-60" />
          <div className="flex items-start justify-between">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary to-violet-500 text-white shadow-md shadow-primary/30">
              <Icon name={scenario.icon} className="h-6 w-6" />
            </div>
            <Badge variant={diffVariant[scenario.difficulty]}>{scenario.difficulty}</Badge>
          </div>
          <h3 className="mt-5 text-lg font-semibold leading-tight">{scenario.title}</h3>
          <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{scenario.description}</p>
          <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {scenario.estimatedMinutes} min
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Start <ArrowRight className="h-4 w-4" />
            </span>
          </div>
          {(completed || best > 0) && (
            <div className="mt-4 flex items-center gap-2 border-t pt-4 text-xs">
              {completed && <Badge variant="success">Completed</Badge>}
              {best > 0 && <span className="text-muted-foreground">Best score · <b className="text-foreground">{best}</b></span>}
            </div>
          )}
        </Card>
      </Link>
    </motion.div>
  );
}
