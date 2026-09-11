"use client";

import { motion, MotionConfig } from "framer-motion";

import { cn } from "@/lib/utils";

import { ContextualBar } from "./contextual-bar";
import { TabBar } from "./tab-bar";
import { useNavShell } from "./use-nav-shell";

/**
 * The floating nav shell: contextual Start/Resume pill above the 4-tab
 * bar, present on every /app/* screen. `MotionConfig reducedMotion="user"`
 * makes every Framer Motion animation in this tree honour
 * `prefers-reduced-motion` (the CSS fallback in base.css only covers
 * plain CSS transitions, not Framer's own rAF-driven ones).
 */
export function NavShell() {
  const nav = useNavShell();

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        animate={{ y: nav.visible ? 0 : 96, opacity: nav.visible ? 1 : 0 }}
        transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex justify-center px-3.5 pb-5",
          !nav.visible && "pointer-events-none",
        )}
      >
        <div className="flex w-full max-w-sm flex-col items-center gap-2.5">
          <ContextualBar session={nav.session} elapsed={nav.elapsed} />
          <TabBar items={nav.items} activeHref={nav.activeHref} />
        </div>
      </motion.div>
    </MotionConfig>
  );
}
