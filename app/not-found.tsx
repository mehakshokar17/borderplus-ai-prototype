import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-mesh p-6 text-center">
      <div>
        <p className="text-6xl font-bold text-gradient">404</p>
        <h1 className="mt-4 text-2xl font-bold">We couldn&apos;t find that page</h1>
        <p className="mt-2 text-muted-foreground">The scenario or page you&apos;re looking for doesn&apos;t exist.</p>
        <Button asChild variant="gradient" className="mt-6"><Link href="/scenarios">Browse scenarios</Link></Button>
      </div>
    </main>
  );
}
