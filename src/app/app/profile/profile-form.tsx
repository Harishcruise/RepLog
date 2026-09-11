"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { AccountSection } from "./account-section";
import { IdentitySection } from "./identity-section";
import { PreferencesSection } from "./preferences-section";
import { StatsStrip } from "./stats-strip";

type ProfileFormProps = {
  name: string;
  email: string;
  memberSince: string;
};

/** Thin orchestrator — see CODE_STANDARDS.md "Feature-screen pattern". */
export function ProfileForm({ name, email, memberSince }: ProfileFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/app"
        className="text-caption text-muted-foreground hover:text-foreground flex items-center gap-1.5 self-start font-sans font-medium transition-colors"
      >
        <ChevronLeft className="size-4" />
        Home
      </Link>

      <IdentitySection name={name} email={email} memberSince={memberSince} />
      <StatsStrip />
      <PreferencesSection />
      <AccountSection />

      <p className="text-micro text-muted-foreground/70 mt-2 flex justify-center gap-3 font-mono">
        <Link href="/terms" className="hover:text-foreground">
          Terms
        </Link>
        <span aria-hidden>·</span>
        <Link href="/privacy" className="hover:text-foreground">
          Privacy
        </Link>
      </p>
    </div>
  );
}
