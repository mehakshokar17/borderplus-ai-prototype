"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="container pb-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-violet-600 to-fuchsia-600 px-8 py-16 text-center shadow-2xl shadow-primary/20 sm:px-16"
      >
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="relative z-10 flex flex-col items-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur">
            <Sparkles className="h-4 w-4" /> No sign-up needed to try
          </span>
          <h2 className="mt-6 max-w-2xl text-balance text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Your next conversation could be your best one.
          </h2>
          <p className="mt-4 max-w-xl text-lg text-white/80">
            Pick a scenario, speak your mind, and watch your confidence climb — one coached reply
            at a time.
          </p>
          <Button asChild size="lg" className="group mt-9 bg-white text-primary hover:bg-white/90">
            <Link href="/scenarios">
              Start Practicing
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
