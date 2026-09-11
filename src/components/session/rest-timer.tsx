import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RestTimerProps = {
  secondsRemaining: number;
  totalSeconds: number;
  onSkip: () => void;
  className?: string;
};

const RADIUS = 13;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatClock(seconds: number) {
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  return `${mm}:${String(ss).padStart(2, "0")}`;
}

/**
 * The floating rest pill: same rounded-pill treatment as the nav's Resume
 * pill, and drawn to occupy the same bottom slot — the caller decides
 * placement, this component only renders its contents.
 */
export function RestTimer({
  secondsRemaining,
  totalSeconds,
  onSkip,
  className,
}: RestTimerProps) {
  const progress = totalSeconds > 0 ? secondsRemaining / totalSeconds : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div
      className={cn(
        "bg-popover border-border flex h-13 items-center gap-3 rounded-full border py-0 pr-2 pl-2.5 shadow-[0_12px_32px_rgb(0_0_0/0.42)]",
        className,
      )}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        aria-hidden
        className="shrink-0"
      >
        <circle
          cx="16"
          cy="16"
          r={RADIUS}
          strokeWidth="3"
          className="fill-none stroke-white/10"
        />
        <circle
          cx="16"
          cy="16"
          r={RADIUS}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 16 16)"
          className="stroke-primary fill-none transition-[stroke-dashoffset] duration-300 ease-linear"
        />
      </svg>
      <span className="text-label font-mono tabular-nums">
        {formatClock(secondsRemaining)}
      </span>
      <Button
        variant="secondary"
        size="icon-sm"
        aria-label="Skip rest"
        onClick={onSkip}
        className="rounded-full"
      >
        <X />
      </Button>
    </div>
  );
}
