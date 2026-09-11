import { History } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "History" };

// Dummy screen — real session list lands in SPEC.md milestone 7.
export default function HistoryPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-col items-center gap-3 px-6 pt-[14vh] text-center">
      <History className="text-muted-foreground size-8" strokeWidth={1.6} />
      <h1 className="font-display text-h1">History</h1>
      <p className="text-micro text-muted-foreground/70 font-mono">
        session list coming next
      </p>
    </main>
  );
}
