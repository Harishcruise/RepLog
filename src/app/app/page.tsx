import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { LogoMark } from "@/components/brand/logo-mark";

import { SignOutButton } from "./sign-out-button";

export default async function AppHome() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/app");

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col items-center justify-center gap-4 px-6 text-center">
      <LogoMark className="size-13" />
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-h1">You&apos;re in</h1>
        <p className="font-sans text-caption text-muted-foreground">
          {user.email}
        </p>
      </div>
      <p className="font-mono text-micro text-muted-foreground/70">
        dashboard coming next
      </p>
      <SignOutButton />
    </main>
  );
}
