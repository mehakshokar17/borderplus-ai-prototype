import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { ScenarioGrid } from "@/features/scenarios/scenario-grid";

export const metadata: Metadata = { title: "Choose a scenario · BorderPlus AI" };

export default function ScenariosPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="container py-12">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Choose a scenario</h1>
          <p className="mt-3 text-muted-foreground">
            Pick a real-life situation to rehearse. Each one is a short, 5-turn conversation with
            instant coaching after every reply.
          </p>
        </div>
        <div className="mt-10">
          <ScenarioGrid />
        </div>
      </section>
    </main>
  );
}
