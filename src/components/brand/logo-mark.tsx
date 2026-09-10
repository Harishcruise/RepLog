import { Dumbbell } from "lucide-react";

import { cn } from "@/lib/utils";

/** Volt square + dumbbell. Size it with a `size-*` class (default 44px). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "bg-primary text-primary-foreground inline-flex size-11 items-center justify-center rounded-xl",
        className,
      )}
    >
      <Dumbbell className="size-[55%]" strokeWidth={2} aria-hidden />
    </span>
  );
}
