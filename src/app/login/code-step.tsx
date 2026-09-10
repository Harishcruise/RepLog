"use client";

import { ChevronLeft, Loader2, TriangleAlert } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import type { LoginController } from "./use-login";

/** 6-digit email OTP entry. Shared shape with the /login/reset flow. */
export function CodeStep({ login }: { login: LoginController }) {
  const { email, error, pending, resendIn } = login;
  const [code, setCode] = useState("");

  async function verify(token: string) {
    const ok = await login.verifyCode(token);
    if (!ok) setCode("");
  }

  return (
    <div className="mt-9 flex flex-col">
      <button
        type="button"
        onClick={() => {
          setCode("");
          login.backToForm();
        }}
        className="text-caption text-muted-foreground hover:text-foreground flex items-center gap-1.5 self-start font-sans font-medium transition-colors"
      >
        <ChevronLeft className="size-4" />
        Use password instead
      </button>

      <h1 className="font-display text-h2 mt-6">Enter your code</h1>
      <p className="text-body text-muted-foreground mt-2 font-sans">
        We sent a 6-digit code to{" "}
        <span className="text-foreground">{email}</span>. It expires in 10
        minutes.
      </p>

      <div className="mt-7">
        <InputOTP
          maxLength={6}
          autoFocus
          value={code}
          onChange={setCode}
          onComplete={(t: string) => void verify(t)}
          containerClassName="justify-between"
        >
          <InputOTPGroup className="w-full justify-between">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="text-caption text-muted-foreground mt-4 font-sans">
        Didn&apos;t get it?{" "}
        {resendIn > 0 ? (
          <span className="tabular-nums">
            Resend in 0:{String(resendIn).padStart(2, "0")}
          </span>
        ) : (
          <button
            type="button"
            onClick={() => void login.sendCode()}
            disabled={pending}
            className="text-primary hover:text-primary-hover font-medium disabled:opacity-50"
          >
            Resend code
          </button>
        )}
      </div>

      {error ? (
        <FieldError className="mt-4">
          <TriangleAlert className="size-3.5 shrink-0" strokeWidth={2.2} />
          {error}
        </FieldError>
      ) : null}

      <Button
        type="button"
        size="lg"
        className="mt-6 w-full"
        disabled={pending || code.length < 6}
        onClick={() => void verify(code)}
      >
        {pending ? <Loader2 className="animate-spin" /> : "Verify & continue"}
      </Button>
    </div>
  );
}
