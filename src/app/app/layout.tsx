import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell/app-shell";
import { createClient } from "@/lib/supabase/server";

/** Gates every /app/* route and wraps it in the floating nav shell. */
export default async function AppLayout({ children }: LayoutProps<"/app">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/app");

  return <AppShell>{children}</AppShell>;
}
