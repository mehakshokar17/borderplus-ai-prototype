import { Navbar } from "@/components/navbar";
import { Hero } from "@/features/landing/hero";
import { StatsBand } from "@/features/landing/stats-band";
import { HowItWorks } from "@/features/landing/how-it-works";
import { FinalCta } from "@/features/landing/final-cta";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <StatsBand />
      <HowItWorks />
      <FinalCta />
      <footer className="border-t border-border/60 py-10 text-center text-sm text-muted-foreground">
        Built as an MVP concept for BorderPlus AI · Practice. Reflect. Speak with confidence.
      </footer>
    </main>
  );
}
