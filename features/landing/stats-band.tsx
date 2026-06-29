"use client";
import { motion } from "framer-motion";

const stats = [
  { value: "10", label: "Real-life scenarios" },
  { value: "5", label: "Skills scored every reply" },
  { value: "<3s", label: "To instant AI coaching" },
  { value: "3", label: "Confidence pillars" },
];

export function StatsBand() {
  return (
    <section className="border-y border-border/60 bg-card/40">
      <div className="container grid grid-cols-2 gap-y-8 py-12 sm:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="text-center"
          >
            <div className="text-4xl font-bold tracking-tight text-gradient sm:text-5xl">
              {s.value}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
