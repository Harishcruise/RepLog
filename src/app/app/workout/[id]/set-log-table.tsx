"use client";

import { Check } from "lucide-react";

import type { SetType } from "@/components/session/set-type";
import { SetTypePicker } from "@/components/session/set-type-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import type { LoggedSet } from "./set";

type SetLogTableProps = {
  sets: LoggedSet[];
  onToggleComplete: (setId: string) => void;
  onTypeChange: (setId: string, type: SetType) => void;
};

function formatPrevious(previous: LoggedSet["previous"]) {
  return previous ? `${previous.weightKg} × ${previous.reps}` : "—";
}

/**
 * SET · PREV · KG · REPS · ✓ for one exercise. A completed row stays
 * grid-aligned to the same columns (values under their real headers) but
 * de-emphasized — see docs/UX.md's "completed rows quiet down" note; the
 * earlier free-floating-text version briefly read as "PREV: 100 kg × 8",
 * which was the actual bug that decision fixed.
 */
export function SetLogTable({
  sets,
  onToggleComplete,
  onTypeChange,
}: SetLogTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-7">SET</TableHead>
          <TableHead>PREV</TableHead>
          <TableHead className="w-[54px] text-center">KG</TableHead>
          <TableHead className="w-[46px] text-center">REPS</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {sets.map((set) => {
          // Pending KG/REPS read as a muted ghost (pre-filled from last
          // time); completed values are plain muted text, not bold — the
          // active/pending row is the one meant to keep visual weight.
          const numberClass = cn(
            "text-center font-mono text-[15px]",
            set.completed
              ? "text-muted-foreground font-medium"
              : "text-muted-foreground/70 font-normal",
          );

          return (
            <TableRow key={set.id}>
              <TableCell>
                <SetTypePicker
                  setNumber={set.setNumber}
                  type={set.type}
                  onTypeChange={(type) => onTypeChange(set.id, type)}
                />
              </TableCell>
              <TableCell className="text-caption text-muted-foreground font-mono text-[15px]">
                {formatPrevious(set.previous)}
              </TableCell>
              {/* TODO: tapping KG/REPS opens the docked numeric keypad once it's built */}
              <TableCell className={numberClass}>{set.weightKg}</TableCell>
              <TableCell className={numberClass}>{set.reps}</TableCell>
              <TableCell>
                <button
                  type="button"
                  aria-label={
                    set.completed
                      ? `Reopen set ${set.setNumber}`
                      : `Complete set ${set.setNumber}`
                  }
                  onClick={() => onToggleComplete(set.id)}
                  className={cn(
                    // Outer box stays 27px in both states — sizing it off
                    // `completed` made it the row's tallest element while
                    // pending, then shrink on check, visibly squeezing the
                    // row's padding. rounded-sm (8px in this project's
                    // scale) — rounded-lg is 12px here (see tokens.css
                    // --radius), which on a 27px box reads as a near-circle
                    // instead of the design's rounded-square outline.
                    "flex size-[27px] items-center justify-center rounded-sm",
                    !set.completed && "border-border border-2",
                  )}
                >
                  {set.completed && (
                    // Matches ActiveSession.dc.html's .done-check — a
                    // quiet icon-only check, not a filled box (that's
                    // .check.on, unused dead CSS from an earlier pass).
                    <Check
                      className="size-5 text-[oklch(0.70_0.15_137)]"
                      strokeWidth={3}
                    />
                  )}
                </button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
