import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import type { SetType } from "./set-type";

// Normal uses the app's --accent/--accent-foreground tokens (the same
// tinted green the set-type picker already uses for its "DEFAULT" tag) —
// it's the default type, so it gets the default/brand color rather than a
// plain neutral one. Warmup/Failure reuse --warning/--destructive (their
// oklch values match the design exactly); Drop set has no equivalent
// token, so its base hue is a one-off literal.
const badgeVariants = cva(
  "flex size-[22px] items-center justify-center rounded-[7px] text-[12px] font-semibold",
  {
    variants: {
      type: {
        normal: "bg-accent text-accent-foreground",
        warmup:
          "border-[1.5px] border-[color-mix(in_oklch,var(--warning)_55%,transparent)] bg-[color-mix(in_oklch,var(--warning)_22%,var(--secondary))] text-[oklch(0.88_0.11_78)]",
        dropset:
          "border-[1.5px] border-[color-mix(in_oklch,oklch(0.75_0.14_305)_55%,transparent)] bg-[color-mix(in_oklch,oklch(0.75_0.14_305)_22%,var(--secondary))] text-[oklch(0.85_0.12_305)]",
        failure:
          "border-[1.5px] border-[color-mix(in_oklch,var(--destructive)_55%,transparent)] bg-[color-mix(in_oklch,var(--destructive)_22%,var(--secondary))] text-[oklch(0.80_0.15_25)]",
      },
    },
    defaultVariants: { type: "normal" },
  },
);

type SetBadgeProps = {
  setNumber: number;
  className?: string;
} & VariantProps<typeof badgeVariants>;

// Every type — Normal included, now that it has real color — stays at full
// strength once its set is done, so scanning tags across completed sets
// still works. There's no "dimmed" state to opt into anymore.
export function SetBadge({ setNumber, type, className }: SetBadgeProps) {
  return (
    <span className={cn(badgeVariants({ type }), className)}>{setNumber}</span>
  );
}

export type { SetType };
