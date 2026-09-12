"use client";

import { EllipsisVertical } from "lucide-react";
import type { ReactNode } from "react";

import {
  DraggableItem,
  DragHandle,
} from "@/components/reorder/reorderable-list";
import { Badge } from "@/components/ui/badge";
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

/** One exercise's card — must render inside a `ReorderList`. Composes the
 *  generic drag-reorder primitives rather than owning drag logic itself. */
export function ExerciseCard({
  exercise,
  onRemove,
  children,
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

      {children}
    </DraggableItem>
  );
}
