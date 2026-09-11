import {
  Dumbbell,
  History,
  Home,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

/** The nav shell's 4 fixed tabs. See UX.md "Navigation model". */
export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/app/history", label: "History", icon: History },
  { href: "/app/exercises", label: "Exercises", icon: Dumbbell },
  { href: "/app/progress", label: "Progress", icon: TrendingUp },
];
