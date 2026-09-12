import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import type { SetType } from "./set-type";

// Warmup/Failure reuse the app's --warning/--destructive tokens (their oklch
// values match the design exactly); Drop set has no equivalent token, so its
// base hue is a one-off literal.
const badgeVariants = cva(
  "flex size-[22px] items-center justify-center rounded-[7px] text-[12px] font-semibold",
  {
    variants: {
      type: {
        normal: "bg-secondary text-secondary-foreground",
        warmup:
          "border-[1.5px] border-[color-mix(in_oklch,var(--warning)_55%,transparent)] bg-[color-mix(in_oklch,var(--warning)_22%,var(--secondary))] text-[oklch(0.88_0.11_78)]",
        dropset:
          "border-[1.5px] border-[color-mix(in_oklch,oklch(0.75_0.14_305)_55%,transparent)] bg-[color-mix(in_oklch,oklch(0.75_0.14_305)_22%,var(--secondary))] text-[oklch(0.85_0.12_305)]",
        failure:
          "border-[1.5px] border-[color-mix(in_oklch,var(--destructive)_55%,transparent)] bg-[color-mix(in_oklch,var(--destructive)_22%,var(--secondary))] text-[oklch(0.80_0.15_25)]",
      },
      dimmed: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      // Only the plain (Normal) badge dims once its set is done — a tagged
      // badge keeps full color so scanning types across done sets still works.
      { type: "normal", dimmed: true, className: "bg-transparent opacity-50" },
    ],
    defaultVariants: { type: "normal", dimmed: false },
  },
);

type SetBadgeProps = {
  setNumber: number;
  className?: string;
} & VariantProps<typeof badgeVariants>;

export function SetBadge({
  setNumber,
  type,
  dimmed,
  className,
}: SetBadgeProps) {
  return (
    <span className={cn(badgeVariants({ type, dimmed }), className)}>
      {setNumber}
    </span>
  );
}

export type { SetType };
