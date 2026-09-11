"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const REST_PRESETS_SECONDS = [60, 90, 120, 180, 240] as const;

function formatRest(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Units + default rest. Both are local-only stubs today — there's no
 * `profiles` table yet (SPEC.md milestone 2), so nothing here persists
 * across a reload. Once that table exists, these become real reads/writes
 * with no change to the UI.
 */
export function PreferencesSection() {
  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [restSeconds, setRestSeconds] = useState(120);
  const [restDraft, setRestDraft] = useState(restSeconds);
  const [restDialogOpen, setRestDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-muted-foreground font-display px-0.5 text-[11px] font-semibold tracking-[0.07em] uppercase">
        Preferences
      </span>
      <div className="border-border bg-card divide-border divide-y overflow-hidden rounded-xl border">
        <div className="flex items-center justify-between px-4 py-3.5">
          <span className="text-body font-sans font-medium">Units</span>
          <div className="bg-muted flex gap-0.5 rounded-md p-0.5">
            <button
              type="button"
              onClick={() => setUnit("kg")}
              className={cn(
                "font-display rounded px-3 py-1 text-[12px] font-semibold",
                unit === "kg"
                  ? "bg-primary-subtle text-primary-hover"
                  : "text-muted-foreground",
              )}
            >
              kg
            </button>
            <button
              type="button"
              onClick={() => setUnit("lb")}
              className={cn(
                "font-display rounded px-3 py-1 text-[12px] font-semibold",
                unit === "lb"
                  ? "bg-primary-subtle text-primary-hover"
                  : "text-muted-foreground",
              )}
            >
              lb
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setRestDraft(restSeconds);
            setRestDialogOpen(true);
          }}
          className="flex w-full items-center justify-between px-4 py-3.5"
        >
          <span className="text-body font-sans font-medium">Default rest</span>
          <span className="text-muted-foreground flex items-center gap-2 text-[13px]">
            <span className="font-mono">{formatRest(restSeconds)}</span>
            <ChevronRight className="size-[15px]" />
          </span>
        </button>
      </div>

      <Dialog open={restDialogOpen} onOpenChange={setRestDialogOpen}>
        <DialogContent>
          <DialogTitle>Default rest</DialogTitle>
          <div className="flex flex-wrap gap-2">
            {REST_PRESETS_SECONDS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRestDraft(s)}
                className={cn(
                  "rounded-full border px-3.5 py-2 font-mono text-[13px] font-semibold",
                  s === restDraft
                    ? "border-primary/45 bg-primary-subtle text-primary-hover"
                    : "border-input text-muted-foreground",
                )}
              >
                {formatRest(s)}
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setRestSeconds(restDraft);
                setRestDialogOpen(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
