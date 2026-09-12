"use client";

import { useCallback, useState } from "react";

export type KeypadStep = "kg" | "reps";

export type KeypadTarget = {
  exerciseId: string;
  setId: string;
};

/**
 * Owns the docked keypad's open/closed state, which set/field it's editing,
 * and the in-progress typed string — nothing about what typing or closing
 * actually *does* to set data. That's useActiveSession's job (it composes
 * this hook and owns updateSet/toggleSetComplete), the same split as
 * useElapsedTimer/useRestTimer own their own ticking but not what a caller
 * does when they expire.
 */
export function useKeypad() {
  const [target, setTarget] = useState<KeypadTarget | null>(null);
  const [step, setStep] = useState<KeypadStep>("kg");
  const [draft, setDraft] = useState("");

  const open = useCallback(
    (
      exerciseId: string,
      setId: string,
      field: KeypadStep,
      initialValue: number,
    ) => {
      setTarget({ exerciseId, setId });
      setStep(field);
      setDraft(String(initialValue));
    },
    [],
  );

  const close = useCallback(() => {
    setTarget(null);
  }, []);

  const typeDigit = useCallback((digit: string) => {
    setDraft((prev) => prev + digit);
  }, []);

  const erase = useCallback(() => {
    setDraft((prev) => prev.slice(0, -1));
  }, []);

  return {
    target,
    step,
    draft,
    open,
    close,
    setStep,
    setDraft,
    typeDigit,
    erase,
  };
}

export type KeypadController = ReturnType<typeof useKeypad>;
