"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Coffee, Plane, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const pillars = [
  { icon: Briefcase, title: "Workplace", desc: "Sound sharp in meetings & 1:1s." },
  { icon: Coffee, title: "Daily Life", desc: "Order, chat, and connect with ease." },
  { icon: Plane, title: "Immigration", desc: "Handle official conversations calmly." },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-mesh">
      <div className="container relative z-10 flex flex-col items-center pt-24 pb-20 text-center sm:pt-32">
        <motion.div initial="hidden" animate="show" variants={container} className="flex flex-col items-center">
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" /> The first version of BorderPlus AI
            </span>
          </motion.div>
          <motion.h1
            variants={item}
            className="mt-6 max-w-4xl text-balance text-5xl font-bold tracking-tight sm:text-7xl"
          >
            Practice Real Conversations <span className="text-gradient">with AI</span>
          </motion.h1>
          <motion.p variants={item} className="mt-6 max-w-xl text-lg text-muted-foreground">
            Build confidence before speaking in real life. Rehearse realistic scenarios with an AI
            partner and get instant, kind coaching after every reply.
          </motion.p>
          <motion.div variants={item} className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="gradient" className="group">
              <Link href="/scenarios">
                Start Practicing
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard">View your progress</Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
          className="mt-20 grid w-full max-w-4xl gap-5 sm:grid-cols-3"
        >
          {pillars.map((p) => (
            <motion.div
              key={p.title}
              variants={item}
              whileHover={{ y: -6 }}
              className="glass rounded-2xl p-6 text-left shadow-lg shadow-black/5"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-violet-500 text-white shadow-md">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 flex items-center gap-2 font-semibold">
                <span className="text-emerald-500">✓</span> {p.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
