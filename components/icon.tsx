"use client";
import * as React from "react";
import {
  Coffee, Presentation, MessageCircleQuestion, UserCog, Users, CupSoda,
  Home, Stethoscope, Plane, Landmark, Sparkles, Flame, CheckCircle2,
  Trophy, CalendarCheck, Compass, MessagesSquare, type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  Coffee, Presentation, MessageCircleQuestion, UserCog, Users, CupSoda,
  Home, Stethoscope, Plane, Landmark, Sparkles, Flame, CheckCircle2,
  Trophy, CalendarCheck, Compass, MessagesSquare,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = MAP[name] ?? Sparkles;
  return <Cmp className={className} />;
}
