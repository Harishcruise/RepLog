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

type CodeStepProps = {
  /** Address the code was sent to — shown in the sub-heading. */
  email: string;
  /** Current error message, or `null`. */
  error: string | null;
  /** Whether a verify/resend request is in flight. */
  pending: boolean;
  /** Seconds left on the resend cooldown (0 = can resend). */
  resendIn: number;
  /** Label for the back link (e.g. "Use password instead", "Back"). */
  backLabel: string;
  /** Verify the entered code. Return `true` on success. */
  onVerify: (token: string) => Promise<boolean>;
  /** Request a fresh code. */
  onResend: () => void;
  /** Leave the code step. */
  onBack: () => void;
};

/** 6-digit email OTP entry. Shared by /login (sign-in) and /login/reset. */
export function CodeStep({
  email,
  error,
  pending,
  resendIn,
  backLabel,
  onVerify,
  onResend,
  onBack,
}: CodeStepProps) {
  const [code, setCode] = useState("");

  async function verify(token: string) {
    const ok = await onVerify(token);
    if (!ok) setCode("");
  }

  return (
    <div className="mt-9 flex flex-col">
      <button
        type="button"
        onClick={() => {
          setCode("");
          onBack();
        }}
        className="text-caption text-muted-foreground hover:text-foreground flex items-center gap-1.5 self-start font-sans font-medium transition-colors"
      >
        <ChevronLeft className="size-4" />
        {backLabel}
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
            onClick={onResend}
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
