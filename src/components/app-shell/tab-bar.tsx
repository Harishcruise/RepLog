"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { cn } from "@/lib/utils";

import type { NavItem } from "./nav-items";

type TabBarProps = {
  items: readonly NavItem[];
  activeHref: string;
};

/**
 * Icon-only tabs at rest; the active tab is a fixed-width volt pill with
 * icon + label that slides between positions (shared layout animation) —
 * see UX.md "Navigation model" and DESIGN_SYSTEM.md §4.
 */
export function TabBar({ items, activeHref }: TabBarProps) {
  return (
    <nav
      aria-label="Primary"
      className="bg-popover/95 inline-flex items-center gap-1.5 rounded-full border border-white/[0.09] p-1.5 shadow-[0_12px_32px_rgb(0_0_0/0.42)] backdrop-blur-md"
    >
      {items.map((item) => {
        const active = item.href === activeHref;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex h-[42px] items-center justify-center gap-1.5 rounded-full",
              active ? "w-[104px]" : "bg-secondary w-[42px] shrink-0",
            )}
          >
            {active ? (
              <motion.span
                layoutId="nav-active-pill"
                transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
                className="bg-primary absolute inset-0 rounded-full"
              />
            ) : null}
            <Icon
              className={cn(
                "relative size-[19px] shrink-0",
                active ? "text-primary-foreground" : "text-foreground/70",
              )}
              strokeWidth={2}
            />
            {active ? (
              <span className="font-display text-primary-foreground relative text-[13px] font-semibold whitespace-nowrap">
                {item.label}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
