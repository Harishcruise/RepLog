import type { LoggedSet } from "./set";

export type SessionExercise = {
  id: string;
  name: string;
  muscle: string;
  sets: LoggedSet[];
};
