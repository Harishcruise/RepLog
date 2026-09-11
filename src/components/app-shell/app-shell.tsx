import type { ReactNode } from "react";

import { NavShell } from "./nav-shell";
import { PageTransition } from "./page-transition";

/**
 * Wraps every `/app/*` screen: renders the screen (crossfading between
 * routes), then the floating nav shell on top. Content gets bottom padding
 * so it isn't hidden behind the floating stack when scrolled to the end
 * (UX.md "Navigation model").
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex-1 pb-[150px]">
        <PageTransition>{children}</PageTransition>
      </div>
      <NavShell />
    </div>
  );
}
