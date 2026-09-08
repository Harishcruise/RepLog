import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

// No landing page — bounce to the app or to sign-in.
export default async function Root() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  redirect(user ? "/app" : "/login");
}
