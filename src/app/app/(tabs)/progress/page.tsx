import { TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Progress" };

// Dummy screen — real progress charts + heatmap land in SPEC.md milestones 8–9.
export default function ProgressPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-col items-center gap-3 px-6 pt-[14vh] text-center">
      <TrendingUp className="text-muted-foreground size-8" strokeWidth={1.6} />
      <h1 className="font-display text-h1">Progress</h1>
      <p className="text-micro text-muted-foreground/70 font-mono">
        charts + heatmap coming next
      </p>
    </main>
  );
}
