import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // design system §6: height 48, 16px text (no iOS zoom), --card fill, --input border
        "border-input bg-card text-body text-foreground h-12 w-full min-w-0 rounded-lg border px-3.5 shadow-xs transition-[color,box-shadow] outline-none",
        "placeholder:text-muted-foreground/70 selection:bg-primary selection:text-primary-foreground",
        "file:text-label file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/25",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
