import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";

import { ProfileForm } from "./profile-form";

export const metadata: Metadata = { title: "Profile" };

// Auth is gated once in `app/app/layout.tsx` — this page just reads the
// (already-verified) user for display.
export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const metaName: unknown = user?.user_metadata?.display_name;
  const name =
    typeof metaName === "string" && metaName.trim().length > 0
      ? metaName
      : (user?.email?.split("@")[0] ?? "there");

  const memberSince = user?.created_at
    ? new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(
        new Date(user.created_at),
      )
    : "";

  return (
    <main className="mx-auto w-full max-w-sm px-5 pt-5 pb-10">
      <ProfileForm
        name={name}
        email={user?.email ?? ""}
        memberSince={memberSince}
      />
    </main>
  );
}
