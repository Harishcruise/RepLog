import type { Metadata } from "next";

import { ResetForm } from "./reset-form";

export const metadata: Metadata = { title: "Reset password" };

export default function ResetPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col px-6 pt-[12vh] pb-10">
      <ResetForm />
    </main>
  );
}
