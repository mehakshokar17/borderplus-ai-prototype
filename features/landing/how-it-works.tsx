"use client";
import { motion } from "framer-motion";
import { MessageSquare, Mic, LineChart } from "lucide-react";

const steps = [
  { icon: MessageSquare, title: "Pick a scenario", desc: "Choose from workplace, daily life, or immigration situations." },
  { icon: Mic, title: "Speak or type", desc: "Have a natural 5-turn conversation with your AI partner." },
  { icon: LineChart, title: "Get coached", desc: "See your score, a better version, and one tip after every reply." },
];

export function HowItWorks() {
  return (
    <section className="container py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
        <p className="mt-3 text-muted-foreground">
          Like Duolingo meets ChatGPT Voice — designed for real-life confidence.
        </p>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative rounded-2xl border bg-card p-7 shadow-sm"
          >
            <span className="absolute right-6 top-6 text-5xl font-bold text-muted/40">{i + 1}</span>
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground">
              <s.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
