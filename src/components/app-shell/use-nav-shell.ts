"use client";

import { usePathname } from "next/navigation";

import { NAV_ITEMS } from "./nav-items";
import { useActiveSession } from "./use-active-session";
import { useElapsedTimer } from "./use-elapsed-timer";
import { useScrollVisibility } from "./use-scroll-visibility";

/**
 * The nav shell's state: which tab is active, whether a workout is in
 * progress (drives the contextual pill), and whether the shell should be
 * visible right now. No JSX — see UX.md "Navigation model".
 */
export function useNavShell() {
  const pathname = usePathname();
  const session = useActiveSession();
  const elapsed = useElapsedTimer(session?.startedAt ?? null);
  const scrollVisible = useScrollVisibility();

  return {
    items: NAV_ITEMS,
    activeHref: matchActiveHref(pathname),
    session,
    elapsed,
    // Auto-hide never applies while a session is in progress — Resume is
    // the fastest way back into an active workout (UX.md "Auto-hide on
    // scroll").
    visible: session ? true : scrollVisible,
  };
}

/** The longest matching href "wins" so a nested route (e.g.
 *  /app/history/[id]) still highlights its parent tab. */
function matchActiveHref(pathname: string): string {
  let best = NAV_ITEMS[0]?.href ?? "/app";
  let bestLength = -1;

  for (const item of NAV_ITEMS) {
    const isMatch =
      item.href === "/app"
        ? pathname === "/app"
        : pathname.startsWith(item.href);
    if (isMatch && item.href.length > bestLength) {
      best = item.href;
      bestLength = item.href.length;
    }
  }

  return best;
}

export type NavShellController = ReturnType<typeof useNavShell>;
