import { ChevronLeft } from "lucide-react";
import Link from "next/link";

type BackLinkProps = {
  /** Where it navigates to. */
  href: string;
  /** Names the destination (e.g. "Home", "Profile") — not a generic "Back". */
  label: string;
};

/**
 * The "‹ Label" back link used by every pushed `/app/*` screen (Profile,
 * Body, ...) that sits outside the tab bar.
 *
 * In-flow at the top of the content on narrow (mobile) viewports — the
 * centred column's left edge already sits near the real screen edge there.
 * From `sm:` up, the centred column no longer touches the window edges, so
 * the link switches to `fixed`, pinned to the actual viewport's top-left
 * corner (with a card-style chip so it doesn't read as orphaned text over
 * bare background) instead of tracking the narrow column's edge.
 */
export function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="text-caption text-muted-foreground hover:text-foreground sm:border-border sm:bg-card flex w-fit items-center gap-1.5 self-start font-sans font-medium transition-colors sm:fixed sm:top-5 sm:left-5 sm:z-10 sm:rounded-full sm:border sm:px-3.5 sm:py-2 sm:shadow-md"
    >
      <ChevronLeft className="size-4" />
      {label}
    </Link>
  );
}
