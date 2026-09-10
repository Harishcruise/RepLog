"use client";

import { LogoMark } from "@/components/brand/logo-mark";

import { CodeStep } from "./code-step";
import { CredentialsForm } from "./credentials-form";
import { useLogin, type Mode, type Step } from "./use-login";

export function LoginForm({ next }: { next: string }) {
  const login = useLogin({ next });

  return (
    <div className="flex flex-col">
      <Header step={login.step} mode={login.mode} />
      {login.step === "form" ? (
        <CredentialsForm login={login} />
      ) : (
        <CodeStep login={login} />
      )}
    </div>
  );
}

function Header({ step, mode }: { step: Step; mode: Mode }) {
  const tagline =
    step === "code"
      ? "Almost there."
      : mode === "signin"
        ? "Log every set. Watch it climb."
        : "Start your first workout in a minute.";

  return (
    <div className="flex flex-col items-center gap-3.5">
      <LogoMark className="size-13" />
      <div className="flex flex-col items-center gap-1">
        <span className="font-display text-[27px] font-semibold tracking-[-0.014em]">
          RepLog
        </span>
        <span className="text-label text-muted-foreground font-sans">
          {tagline}
        </span>
      </div>
    </div>
  );
}
