import type { SetType } from "@/components/session/set-type";

export type LoggedSet = {
  id: string;
  setNumber: number;
  type: SetType;
  /** Last time's numbers, shown as a ghost placeholder until logged — null
   *  if there's no history for this exercise yet. */
  previous: { weightKg: number; reps: number } | null;
  weightKg: number;
  reps: number;
  completed: boolean;
};
