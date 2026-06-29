"use client";
import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, RotateCcw, Sparkles } from "lucide-react";
import { useProgressStore } from "@/store/useProgressStore";
import { computeStats, computeRadar, computeWeekly } from "@/services/analytics";
import { StatCard } from "./stat-card";
import { WeeklyChart, SkillRadar } from "./charts";
import { Achievements } from "./achievements";
import { RecentActivity } from "./recent-activity";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function Dashboard() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const progress = useProgressStore();

  if (!mounted) return <DashboardSkeleton />;

  const stats = computeStats(progress);
  const hasData = progress.attempts.length > 0;

  if (!hasData) return <EmptyDashboard />;

  const radar = computeRadar(progress);
  const weekly = computeWeekly(progress);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Your progress</h1>
          <p className="mt-2 text-muted-foreground">Track your confidence growing, one conversation at a time.</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 rounded-full border bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-4 py-2"
          >
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-semibold">{progress.streakDays}-day streak</span>
          </motion.div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { if (confirm("Reset all your practice progress?")) progress.reset(); }}
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard index={0} label="Sessions" value={stats.sessions} icon="MessagesSquare" />
        <StatCard index={1} label="Avg Score" value={stats.averageScore} icon="TrendingUp" accent="from-violet-500 to-fuchsia-500" />
        <StatCard index={2} label="Best Score" value={stats.bestScore} icon="Trophy" accent="from-amber-400 to-orange-500" />
        <StatCard index={3} label="Hours" value={stats.hoursPracticed} icon="CalendarCheck" accent="from-cyan-500 to-blue-500" />
        <StatCard index={4} label="Completed" value={`${stats.completedScenarios}/${stats.totalScenarios}`} icon="CheckCircle2" accent="from-emerald-500 to-teal-500" />
        <StatCard index={5} label="Completion" value={`${stats.completionPct}%`} icon="Compass" accent="from-pink-500 to-rose-500" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader><CardTitle>Weekly progress</CardTitle></CardHeader>
          <CardContent><WeeklyChart data={weekly} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Skill breakdown</CardTitle></CardHeader>
          <CardContent><SkillRadar data={radar} /></CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
          <CardContent><RecentActivity attempts={progress.attempts} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Achievements</CardTitle></CardHeader>
          <CardContent><Achievements progress={progress} /></CardContent>
        </Card>
      </div>
    </div>
  );
}

function EmptyDashboard() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-primary to-violet-500 text-white shadow-xl shadow-primary/30 animate-float">
        <Sparkles className="h-10 w-10" />
      </div>
      <h1 className="mt-6 text-2xl font-bold">No practice yet</h1>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Complete your first conversation and your scores, charts, streak, and achievements will show up here.
      </p>
      <Button asChild size="lg" variant="gradient" className="mt-6">
        <Link href="/scenarios">Start your first conversation</Link>
      </Button>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-10 w-64" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    </div>
  );
}
