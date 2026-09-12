"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import type { SetType } from "@/components/session/set-type";

import type { SessionExercise } from "./exercise";
import type { LoggedSet } from "./set";
import { useElapsedTimer } from "./use-elapsed-timer";
import { useKeypad } from "./use-keypad";

export type ActiveSessionController = ReturnType<typeof useActiveSession>;

type UseActiveSessionInput = {
  sessionId: string;
  initialName: string;
  startedAt: Date;
  initialExercises: SessionExercise[];
};

/**
 * State for the active-session screen. Sessions/sets don't have a schema yet
 * (SPEC.md milestone 2 — Schema), so rename/finish/discard are local-only
 * stubs today; they'll route through `lib/session` operations once that
 * table exists, same swap the Profile screen's stubs are waiting on.
 */
export function useActiveSession({
  sessionId,
  initialName,
  startedAt,
  initialExercises,
}: UseActiveSessionInput) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [exercises, setExercises] = useState(initialExercises);
  const elapsedSeconds = useElapsedTimer(startedAt);

  /** Framer Motion's Reorder.Group hands back the full reordered array on
   *  drop — just accept it as the new order. */
  const reorderExercises = useCallback((next: SessionExercise[]) => {
    setExercises(next);
  }, []);

  const removeExercise = useCallback((exerciseId: string) => {
    setExercises((prev) => prev.filter((e) => e.id !== exerciseId));
  }, []);

  const updateSet = useCallback(
    (exerciseId: string, setId: string, patch: Partial<LoggedSet>) => {
      setExercises((prev) =>
        prev.map((exercise) =>
          exercise.id !== exerciseId
            ? exercise
            : {
                ...exercise,
                sets: exercise.sets.map((set) =>
                  set.id === setId ? { ...set, ...patch } : set,
                ),
              },
        ),
      );
    },
    [],
  );

  const toggleSetComplete = useCallback((exerciseId: string, setId: string) => {
    setExercises((prev) =>
      prev.map((exercise) =>
        exercise.id !== exerciseId
          ? exercise
          : {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === setId ? { ...set, completed: !set.completed } : set,
              ),
            },
      ),
    );
  }, []);

  const setSetType = useCallback(
    (exerciseId: string, setId: string, type: SetType) => {
      updateSet(exerciseId, setId, { type });
    },
    [updateSet],
  );

  const keypad = useKeypad();

  const findSet = useCallback(
    (exerciseId: string, setId: string) =>
      exercises
        .find((exercise) => exercise.id === exerciseId)
        ?.sets.find((set) => set.id === setId),
    [exercises],
  );

  const openKeypad = useCallback(
    (exerciseId: string, setId: string, field: "kg" | "reps") => {
      const set = findSet(exerciseId, setId);
      if (!set) return;
      keypad.open(
        exerciseId,
        setId,
        field,
        field === "kg" ? set.weightKg : set.reps,
      );
    },
    [findSet, keypad],
  );

  /** Commits whatever's currently typed to the field the keypad is on —
   *  the one thing every keypad exit path (Next, Back, Save, Log set) does
   *  first, so nothing typed is ever silently lost by navigating away. */
  const commitKeypadField = useCallback(() => {
    if (!keypad.target) return;
    const parsed = Number(keypad.draft);
    const value = Number.isFinite(parsed) ? parsed : 0;
    updateSet(
      keypad.target.exerciseId,
      keypad.target.setId,
      keypad.step === "kg" ? { weightKg: value } : { reps: value },
    );
  }, [keypad.target, keypad.draft, keypad.step, updateSet]);

  const keypadSave = useCallback(() => {
    commitKeypadField();
    keypad.close();
  }, [commitKeypadField, keypad]);

  const keypadNext = useCallback(() => {
    if (!keypad.target) return;
    commitKeypadField();
    const set = findSet(keypad.target.exerciseId, keypad.target.setId);
    keypad.setStep("reps");
    keypad.setDraft(String(set?.reps ?? 0));
  }, [keypad, commitKeypadField, findSet]);

  const keypadBack = useCallback(() => {
    if (!keypad.target) return;
    commitKeypadField();
    const set = findSet(keypad.target.exerciseId, keypad.target.setId);
    keypad.setStep("kg");
    keypad.setDraft(String(set?.weightKg ?? 0));
  }, [keypad, commitKeypadField, findSet]);

  const keypadLogSet = useCallback(() => {
    if (!keypad.target) return;
    commitKeypadField();
    const { exerciseId, setId } = keypad.target;
    const set = findSet(exerciseId, setId);
    if (set && !set.completed) toggleSetComplete(exerciseId, setId);
    keypad.close();
  }, [keypad, commitKeypadField, findSet, toggleSetComplete]);

  /** Copies the last set's numbers as a starting point — mirrors how a
   *  brand-new set otherwise has nothing to ghost-placeholder against. */
  const addSet = useCallback((exerciseId: string) => {
    setExercises((prev) =>
      prev.map((exercise) => {
        if (exercise.id !== exerciseId) return exercise;
        const last = exercise.sets.at(-1);
        const newSet: LoggedSet = {
          id: crypto.randomUUID(),
          setNumber: exercise.sets.length + 1,
          type: "normal",
          previous: last ? { weightKg: last.weightKg, reps: last.reps } : null,
          weightKg: last?.weightKg ?? 0,
          reps: last?.reps ?? 0,
          completed: false,
        };
        return { ...exercise, sets: [...exercise.sets, newSet] };
      }),
    );
  }, []);

  const rename = useCallback((next: string) => {
    const trimmed = next.trim();
    if (trimmed) setName(trimmed);
  }, []);

  /** Leaves the session running in the background and returns to Home — the
   *  same as backgrounding the app. Distinct from finish/discard below. */
  const leaveRunning = useCallback(() => {
    router.push("/app");
  }, [router]);

  const finish = useCallback(() => {
    toast("Finish isn't wired up yet — no summary screen or schema.");
  }, []);

  const discard = useCallback(() => {
    router.push("/app");
  }, [router]);

  return {
    sessionId,
    name,
    elapsedSeconds,
    rename,
    leaveRunning,
    finish,
    discard,
    exercises,
    reorderExercises,
    removeExercise,
    toggleSetComplete,
    setSetType,
    addSet,
    keypad: {
      target: keypad.target,
      step: keypad.step,
      draft: keypad.draft,
      open: openKeypad,
      typeDigit: keypad.typeDigit,
      erase: keypad.erase,
      save: keypadSave,
      next: keypadNext,
      back: keypadBack,
      logSet: keypadLogSet,
    },
  };
}
