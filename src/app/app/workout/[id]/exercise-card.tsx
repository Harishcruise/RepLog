"use client";

import { EllipsisVertical, Plus } from "lucide-react";

import {
  DraggableItem,
  DragHandle,
} from "@/components/reorder/reorderable-list";
import type { SetType } from "@/components/session/set-type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { SessionExercise } from "./exercise";
import { SetLogTable } from "./set-log-table";

type ExerciseCardProps = {
  exercise: SessionExercise;
  onRemove: () => void;
  onToggleSetComplete: (setId: string) => void;
  onSetTypeChange: (setId: string, type: SetType) => void;
  onAddSet: () => void;
  onOpenKeypad: (setId: string, field: "kg" | "reps") => void;
  activeSetId: string | null;
  activeField: "kg" | "reps" | null;
};

/** One exercise's card — must render inside a `ReorderList`. Composes the
 *  generic drag-reorder primitives rather than owning drag logic itself. */
export function ExerciseCard({
  exercise,
  onRemove,
  onToggleSetComplete,
  onSetTypeChange,
  onAddSet,
  onOpenKeypad,
  activeSetId,
  activeField,
}: ExerciseCardProps) {
  return (
    <DraggableItem
      value={exercise}
      className="bg-card border-border flex flex-col gap-2.5 rounded-2xl border p-3.5"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <DragHandle
            aria-label={`Reorder ${exercise.name}`}
            className="-ml-1"
          />
          <span className="text-h3 truncate font-sans">{exercise.name}</span>
          <Badge variant="muted" className="shrink-0">
            {exercise.muscle}
          </Badge>
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

      <SetLogTable
        sets={exercise.sets}
        onToggleComplete={onToggleSetComplete}
        onTypeChange={onSetTypeChange}
        onOpenKeypad={onOpenKeypad}
        activeSetId={activeSetId}
        activeField={activeField}
      />

      <button
        type="button"
        onClick={onAddSet}
        className="text-primary text-label flex h-9 items-center justify-center gap-1.5 font-sans font-medium"
      >
        <Plus className="size-3.5" />
        Add set
      </button>
    </DraggableItem>
  );
}
