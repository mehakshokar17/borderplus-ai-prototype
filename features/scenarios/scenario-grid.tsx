"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { SCENARIOS, CATEGORIES } from "@/services/scenarios/data";
import { ScenarioCard } from "./scenario-card";
import { cn } from "@/lib/utils";

export function ScenarioGrid() {
  const [filter, setFilter] = React.useState<string>("All");
  const tabs = ["All", ...CATEGORIES];
  const list = filter === "All" ? SCENARIOS : SCENARIOS.filter((s) => s.category === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={cn(
              "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              filter === t ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {filter === t && (
              <motion.span
                layoutId="active-pill"
                className="absolute inset-0 rounded-full bg-primary shadow-md shadow-primary/30"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{t}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((s, i) => (
          <ScenarioCard key={s.id} scenario={s} index={i} />
        ))}
      </div>
    </div>
  );
}
