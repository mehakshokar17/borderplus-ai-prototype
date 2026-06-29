"use client";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";
import type { RadarPoint, WeeklyPoint } from "@/services/analytics";

export function WeeklyChart({ data }: { data: WeeklyPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="score" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(245 75% 59%)" stopOpacity={0.4} />
            <stop offset="100%" stopColor="hsl(245 75% 59%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} stroke="hsl(var(--muted-foreground))" />
        <YAxis domain={[0, 100]} tickLine={false} axisLine={false} fontSize={12} stroke="hsl(var(--muted-foreground))" />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid hsl(var(--border))",
            background: "hsl(var(--card))",
            color: "hsl(var(--foreground))",
            fontSize: 12,
          }}
          formatter={(v) => [v == null ? "—" : (v as number), "Avg score"]}
        />
        <Area type="monotone" dataKey="score" stroke="hsl(245 75% 59%)" strokeWidth={2.5} fill="url(#score)" connectNulls dot={{ r: 3 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SkillRadar({ data }: { data: RadarPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis dataKey="skill" fontSize={12} stroke="hsl(var(--muted-foreground))" />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Radar dataKey="value" stroke="hsl(280 75% 60%)" fill="hsl(280 75% 60%)" fillOpacity={0.35} strokeWidth={2} />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid hsl(var(--border))",
            background: "hsl(var(--card))",
            color: "hsl(var(--foreground))",
            fontSize: 12,
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
