import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Dashboard } from "@/features/dashboard/dashboard";

export const metadata: Metadata = { title: "Dashboard · BorderPlus AI" };

export default function DashboardPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="container py-12">
        <Dashboard />
      </section>
    </main>
  );
}
