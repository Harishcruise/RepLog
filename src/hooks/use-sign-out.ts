"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

/**
 * Shared sign-out logic (used by the Home placeholder button today, and
 * Profile's "Sign out" row) — kept as a hook rather than a component since
 * each caller renders its own UI (a plain button vs. a row-with-icon).
 */
export function useSignOut() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const signOut = async () => {
    setPending(true);
    await createClient().auth.signOut();
    router.replace("/login");
    router.refresh();
  };

  return { pending, signOut };
}
