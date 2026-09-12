export type SetType = "normal" | "warmup" | "dropset" | "failure";

export const DEFAULT_SET_TYPE: SetType = "normal";

export const SET_TYPES: { value: SetType; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "warmup", label: "Warmup" },
  { value: "dropset", label: "Drop set" },
  { value: "failure", label: "Failure" },
];
