"use client";

import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Tab-switch transition: content crossfades only (opacity, `fast` 120ms) —
 * no slide, since tabs are parallel destinations with no inherent order
 * (DESIGN_SYSTEM.md §4 "Navigation transitions"). `mode="popLayout"` pulls
 * the exiting screen out of flow immediately so the incoming one doesn't
 * have to share height with it mid-fade.
 *
 * Applies to every `/app/*` navigation today. Once drill-down routes exist
 * (list → detail), they'll want the directional-slide treatment instead —
 * this component will need to tell the two apart (e.g. by route depth)
 * rather than crossfading everything uniformly.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  );
}
