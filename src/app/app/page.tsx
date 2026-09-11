import { LogoMark } from "@/components/brand/logo-mark";
import { createClient } from "@/lib/supabase/server";

import { SignOutButton } from "./sign-out-button";

// Auth is gated once in `app/app/layout.tsx` — this page just reads the
// (already-verified) user for display.
export default async function AppHome() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto flex w-full max-w-sm flex-col items-center gap-4 px-6 pt-[22vh] text-center">
      <LogoMark className="size-13" />
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-h1">You&apos;re in</h1>
        <p className="text-caption text-muted-foreground font-sans">
          {user?.email}
        </p>
      </div>
      <p className="text-micro text-muted-foreground/70 font-mono">
        dashboard coming next
      </p>
      <SignOutButton />
    </main>
  );
}
