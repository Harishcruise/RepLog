"use client";

import { Reorder, useDragControls } from "framer-motion";
import { EllipsisVertical, GripVertical } from "lucide-react";
import type { PointerEvent, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { SessionExercise } from "./exercise";

type ExerciseCardProps = {
  exercise: SessionExercise;
  onRemove: () => void;
  children?: ReactNode;
};

/**
 * Draggable wrapper for one exercise's card — must render inside a
 * `Reorder.Group`. Only the grip handle starts a drag (`dragListener={false}`
 * + `dragControls`), so tapping anywhere else on the card — the kebab now,
 * set rows once they're built — is never mistaken for a reorder gesture.
 */
export function ExerciseCard({
  exercise,
  onRemove,
  children,
}: ExerciseCardProps) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={exercise}
      dragListener={false}
      dragControls={dragControls}
      className="bg-card border-border flex flex-col gap-2.5 rounded-2xl border p-3.5"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onPointerDown={(e: PointerEvent<HTMLButtonElement>) =>
              dragControls.start(e)
            }
            aria-label={`Reorder ${exercise.name}`}
            className="text-muted-foreground -ml-1 flex size-7 shrink-0 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
          >
            <GripVertical className="size-4" />
          </button>
          <span className="text-h3 truncate font-sans">{exercise.name}</span>
          <span className="bg-secondary text-muted-foreground shrink-0 rounded-full px-2 py-0.5 font-sans text-[11.5px] font-medium">
            {exercise.muscle}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Exercise options"
            >
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem variant="destructive" onSelect={onRemove}>
              Remove exercise
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {children}
    </Reorder.Item>
  );
}
