import type { ReactNode } from "react";

import { NavShell } from "./nav-shell";

/**
 * Wraps every `/app/*` screen: renders the screen, then the floating nav
 * shell on top. Content gets bottom padding so it isn't hidden behind the
 * floating stack when scrolled to the end (UX.md "Navigation model").
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex-1 pb-[150px]">{children}</div>
      <NavShell />
    </div>
  );
}
