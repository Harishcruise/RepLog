import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

/**
 * Gates every /app/* route. Nothing else — the floating nav shell lives in
 * `(tabs)/layout.tsx` now, not here, so pushed screens (Profile, Body,
 * future workout/* routes) don't inherit it.
 */
export default async function AppLayout({ children }: LayoutProps<"/app">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/app");

  return <>{children}</>;
}
