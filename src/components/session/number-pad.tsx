import { ArrowLeft } from "lucide-react";

export type NumberPadStep = "kg" | "reps";

type NumberPadProps = {
  step: NumberPadStep;
  value: string;
  onDigit: (digit: string) => void;
  onErase: () => void;
  onSave: () => void;
  onNext: () => void;
  onBack: () => void;
  onLogSet: () => void;
  /** Longest string this pad will hand to onDigit — guards the caller the
   *  same way a native input's maxLength does, since nothing about `value`
   *  is trusted to already be bounded. 4 chars covers any realistic
   *  weight/rep entry and keeps the mono display from overflowing its row. */
  maxLength?: number;
};

type PadKey =
  { kind: "digit"; value: string } | { kind: "erase" } | { kind: "save" };

/** Matches ActiveSession.dc.html's docked-keypad grid order exactly: the
 *  Save key sits once in the DOM and spans two rows (grid-row: span 2),
 *  which is what pushes 7/8/9 below it rather than beside it. */
const PAD_KEYS: PadKey[] = [
  { kind: "digit", value: "1" },
  { kind: "digit", value: "2" },
  { kind: "digit", value: "3" },
  { kind: "erase" },
  { kind: "digit", value: "4" },
  { kind: "digit", value: "5" },
  { kind: "digit", value: "6" },
  { kind: "save" },
  { kind: "digit", value: "7" },
  { kind: "digit", value: "8" },
  { kind: "digit", value: "9" },
  { kind: "digit", value: "." },
  { kind: "digit", value: "0" },
];

/**
 * The docked numeric keypad from ActiveSession.dc.html (frames 2-3): replaces
 * the OS keyboard when a KG/REPS cell is tapped, so height is predictable and
 * it never covers the row above it. Two steps chained by the header action —
 * "Next: Reps →" on kg, "← Back: KG" + "Log set" on reps. The grid's Save key
 * always means the same thing regardless of step: commit the typed value to
 * that one field and close, no other side effects. Log set is the only
 * action that actually completes the set (checks it off, starts rest) — the
 * caller owns that distinction, this component just renders the two labels.
 *
 * The "." key is a source deviation, not a style one: reps are always whole
 * numbers, so it's disabled on the reps step even though the mockup draws
 * the same 13-key grid on both steps.
 */
export function NumberPad({
  step,
  value,
  onDigit,
  onErase,
  onSave,
  onNext,
  onBack,
  onLogSet,
  maxLength = 4,
}: NumberPadProps) {
  return (
    <div className="bg-card border-border rounded-t-[20px] border-t px-4 pt-3.5 pb-[22px]">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-micro text-primary-hover font-semibold">
          {step === "kg" ? "Weight (kg)" : "Reps"}
        </span>

        <div className="flex items-center gap-1.5">
          {step === "kg" ? (
            <button
              type="button"
              onClick={onNext}
              className="bg-primary-subtle text-primary-hover font-display text-caption flex h-[30px] items-center rounded-md px-3 font-semibold"
            >
              Next: Reps →
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onBack}
                className="bg-secondary text-foreground font-display text-caption flex h-[30px] items-center rounded-md px-3 font-semibold"
              >
                ← Back: KG
              </button>
              <button
                type="button"
                onClick={onLogSet}
                className="bg-primary-subtle text-primary-hover font-display text-caption flex h-[30px] items-center rounded-md px-3 font-semibold"
              >
                Log set
              </button>
            </>
          )}
        </div>
      </div>

      {/* min-h holds text-stat's own line-height even when value is "" —
          otherwise an empty text node collapses the row to 0 and the grid
          below jumps up (hit erasing every digit down to nothing). */}
      <div className="text-stat mb-3 min-h-[2.125rem] font-mono font-semibold">
        {value}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {PAD_KEYS.map((key, i) => {
          if (key.kind === "erase") {
            return (
              <button
                key={i}
                type="button"
                onClick={onErase}
                aria-label="Erase last digit"
                className="border-border text-muted-foreground flex h-[46px] items-center justify-center rounded-md border"
              >
                <ArrowLeft className="size-[18px]" />
              </button>
            );
          }

          if (key.kind === "save") {
            return (
              <button
                key={i}
                type="button"
                onClick={onSave}
                className="border-primary/50 bg-secondary text-primary-hover text-caption row-span-2 h-[46px] rounded-md border-[1.5px] font-mono font-semibold"
              >
                Save
              </button>
            );
          }

          const disabled =
            (step === "reps" && key.value === ".") || value.length >= maxLength;
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onDigit(key.value)}
              className="border-border text-foreground flex h-[46px] items-center justify-center rounded-md border bg-[oklch(0.335_0.013_153)] font-mono text-[18px] font-medium disabled:pointer-events-none disabled:opacity-40"
            >
              {key.value}
            </button>
          );
        })}
      </div>
    </div>
  );
}
