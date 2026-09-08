import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { safeNext } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";

import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;
  const dest = safeNext(next);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(dest);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col px-6 pt-[14vh] pb-10">
      <LoginForm next={dest} />
    </main>
  );
}
