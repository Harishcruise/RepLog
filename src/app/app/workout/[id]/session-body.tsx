"use client";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import { ReorderList } from "@/components/reorder/reorderable-list";

import { ExerciseCard } from "./exercise-card";
import type { ActiveSessionController } from "./use-active-session";

type SessionBodyProps = {
  controller: ActiveSessionController;
};

/** Scrollable region between the sticky header and the (future) docked
 *  keypad / rest pill — owns nothing itself, just lays out the reorderable
 *  exercise cards the controller already tracks. */
export function SessionBody({ controller }: SessionBodyProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 pt-3.5 pb-6">
      <ReorderList
        values={controller.exercises}
        onReorder={controller.reorderExercises}
      >
        {controller.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onRemove={() => controller.removeExercise(exercise.id)}
            onToggleSetComplete={(setId) =>
              controller.toggleSetComplete(exercise.id, setId)
            }
            onSetTypeChange={(setId, type) =>
              controller.setSetType(exercise.id, setId, type)
            }
            onAddSet={() => controller.addSet(exercise.id)}
          />
        ))}
      </ReorderList>

      <button
        type="button"
        onClick={() => toast("Exercise picker isn't built yet.")}
        className="text-primary border-border text-label mt-3 flex h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed font-sans font-medium"
      >
        <Plus className="size-4" />
        Add exercise
      </button>
    </div>
  );
}
