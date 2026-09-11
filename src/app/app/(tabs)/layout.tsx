import { AppShell } from "@/components/app-shell/app-shell";
import { TabHeader } from "@/components/app-shell/tab-header";
import { createClient } from "@/lib/supabase/server";

/**
 * The 4 main tabs only: shared avatar/name/streak header + the floating
 * nav shell. Pushed screens (Profile, Body, ...) sit outside this route
 * group and get neither — see app-shell.tsx.
 */
export default async function TabsLayout({ children }: LayoutProps<"/app">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const metaName: unknown = user?.user_metadata?.display_name;
  const name =
    typeof metaName === "string" && metaName.trim().length > 0
      ? metaName
      : (user?.email?.split("@")[0] ?? "there");

  return <AppShell header={<TabHeader name={name} />}>{children}</AppShell>;
}
