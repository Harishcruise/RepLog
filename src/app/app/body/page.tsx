import { ChevronLeft, Scale } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Bodyweight" };

// Dummy screen — real chart + "Log weight" dialog land per Body.dc.html,
// once bodyweight_logs exists (SPEC.md milestone 2).
export default function BodyPage() {
  return (
    <main className="relative mx-auto flex w-full max-w-sm flex-col items-center gap-3 px-6 pt-[22vh] text-center">
      <Link
        href="/app/profile"
        className="text-caption text-muted-foreground hover:text-foreground absolute top-5 left-5 flex items-center gap-1.5 font-sans font-medium transition-colors"
      >
        <ChevronLeft className="size-4" />
        Profile
      </Link>
      <Scale className="text-muted-foreground size-8" strokeWidth={1.6} />
      <h1 className="font-display text-h1">Bodyweight</h1>
      <p className="text-micro text-muted-foreground/70 font-mono">
        trend chart + log entry coming next
      </p>
    </main>
  );
}
