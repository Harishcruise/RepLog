import type { ReactNode } from "react";

import { NavShell } from "./nav-shell";
import { PageTransition } from "./page-transition";

/**
 * Wraps the 4 main tabs only (rendered from `(tabs)/layout.tsx`, not the
 * outer `/app` layout — pushed screens like Profile/Body must NOT get the
 * floating nav, per Profile.dc.html / Body.dc.html): an optional header
 * (rendered once, outside the crossfade — it's identical across tabs, no
 * reason to re-animate it on every switch), the screen itself (crossfading
 * between routes), then the floating nav shell on top. Content gets bottom
 * padding so it isn't hidden behind the floating stack when scrolled to the
 * end (UX.md "Navigation model").
 */
export function AppShell({
  header,
  children,
}: {
  header?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      {header}
      <div className="flex-1 pb-[150px]">
        <PageTransition>{children}</PageTransition>
      </div>
      <NavShell />
    </div>
  );
}
