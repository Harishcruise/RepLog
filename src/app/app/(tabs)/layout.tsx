import { TabHeader } from "@/components/app-shell/tab-header";
import { createClient } from "@/lib/supabase/server";

/** Renders the shared avatar/name/streak header once for all 4 main tabs. */
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

  return (
    <>
      <TabHeader name={name} />
      {children}
    </>
  );
}
