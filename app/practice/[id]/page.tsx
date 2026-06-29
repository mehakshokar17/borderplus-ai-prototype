import { notFound } from "next/navigation";
import { getScenario, SCENARIOS } from "@/services/scenarios/data";
import { PracticeRoom } from "@/features/practice/practice-room";

export function generateStaticParams() {
  return SCENARIOS.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = getScenario(id);
  return { title: s ? `${s.title} · BorderPlus AI` : "Practice · BorderPlus AI" };
}

export default async function PracticePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scenario = getScenario(id);
  if (!scenario) notFound();
  return <PracticeRoom scenario={scenario} />;
}
