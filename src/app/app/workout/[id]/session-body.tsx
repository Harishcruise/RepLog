"use client";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import { ReorderList } from "@/components/reorder/reorderable-list";
import { NumberPad } from "@/components/session/number-pad";

import { ExerciseCard } from "./exercise-card";
import type { ActiveSessionController } from "./use-active-session";

type SessionBodyProps = {
  controller: ActiveSessionController;
};

/** Scrollable region between the sticky header and the docked keypad / (future)
 *  rest pill — owns nothing itself, just lays out the reorderable exercise
 *  cards the controller already tracks. The bottom slot (same one NavShell
 *  would occupy on the tab screens — free here, this screen has no nav
 *  shell) holds exactly one floating element at a time: the docked keypad
 *  while a KG/REPS cell is being edited, "Add exercise" otherwise. */
export function SessionBody({ controller }: SessionBodyProps) {
  const { keypad } = controller;
  const isKeypadOpen = keypad.target !== null;

  return (
    <div
      className={
        // Extra clearance while the (taller) keypad is docked, so the
        // focused row's card can still scroll clear of it.
        isKeypadOpen
          ? "flex-1 overflow-y-auto px-4 pt-3.5 pb-[300px]"
          : "flex-1 overflow-y-auto px-4 pt-3.5 pb-24"
      }
    >
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
            onOpenKeypad={(setId, field) =>
              keypad.open(exercise.id, setId, field)
            }
            activeSetId={
              keypad.target?.exerciseId === exercise.id
                ? keypad.target.setId
                : null
            }
            activeField={
              keypad.target?.exerciseId === exercise.id ? keypad.step : null
            }
          />
        ))}
      </ReorderList>

      {isKeypadOpen ? (
        <div className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-sm">
          <NumberPad
            step={keypad.step}
            value={keypad.draft}
            onDigit={keypad.typeDigit}
            onErase={keypad.erase}
            onSave={keypad.save}
            onNext={keypad.next}
            onBack={keypad.back}
            onLogSet={keypad.logSet}
          />
        </div>
      ) : (
        // ActiveSession.dc.html's own "Add exercise" spec (dashed border,
        // transparent-on-the-page look) — floated fixed at the bottom
        // instead of inline at the end of the list so it's reachable
        // without scrolling, with a solid bg so scrolled cards don't show
        // through it.
        <div className="fixed inset-x-0 bottom-5 z-20 mx-auto w-full max-w-sm px-4">
          <button
            type="button"
            onClick={() => toast("Exercise picker isn't built yet.")}
            className="text-primary bg-background font-display text-label flex h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[oklch(1_0_0/14%)] font-medium shadow-[0_10px_28px_rgb(0_0_0/0.38)]"
          >
            <Plus className="size-4" />
            Add exercise
          </button>
        </div>
      )}
    </div>
  );
}
