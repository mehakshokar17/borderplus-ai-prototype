import Link from "next/link";
import { MessagesSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 font-semibold", className)}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-violet-500 text-white shadow-lg shadow-primary/30">
        <MessagesSquare className="h-5 w-5" />
      </span>
      <span className="text-lg tracking-tight">
        BorderPlus<span className="text-gradient"> AI</span>
      </span>
    </Link>
  );
}
