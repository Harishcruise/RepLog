import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { authErrorMessage } from "@/lib/auth/errors";
import {
  sendPasswordReset,
  updatePassword,
  verifyEmailOtp,
} from "@/lib/auth/operations";
import { createClient } from "@/lib/supabase/client";

import { useResendTimer } from "../use-resend-timer";

export type ResetStep = "request" | "code" | "password";

const RESEND_SECONDS = 30;

/**
 * The /login/reset state machine: email → 6-digit code → new password.
 * `resetPasswordForEmail` → `verifyOtp(type: recovery)` (opens a recovery
 * session) → `updateUser({ password })` (user is signed in). No JSX.
 */
export function useReset() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const resend = useResendTimer();

  const [step, setStep] = useState<ResetStep>("request");
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const backToRequest = useCallback(() => {
    setStep("request");
    setError(null);
  }, []);

  const sendCode = useCallback(async () => {
    setError(null);
    setPending(true);
    const res = await sendPasswordReset(supabase, { email });
    setPending(false);
    if (res.ok) {
      resend.start(RESEND_SECONDS);
      setStep("code");
    } else {
      setError(authErrorMessage(res.code));
    }
  }, [supabase, email, resend]);

  /** Returns true on success so the code input can clear itself on failure. */
  const verifyCode = useCallback(
    async (token: string) => {
      if (token.length < 6 || pending) return false;
      setError(null);
      setPending(true);
      const res = await verifyEmailOtp(supabase, {
        email,
        token,
        type: "recovery",
      });
      setPending(false);
      if (res.ok) {
        setStep("password");
        return true;
      }
      setError(authErrorMessage(res.code));
      return false;
    },
    [supabase, email, pending],
  );

  const savePassword = useCallback(
    async (password: string) => {
      setError(null);
      setPending(true);
      const res = await updatePassword(supabase, { password });
      setPending(false);
      if (res.ok) {
        toast.success("Password updated — you're in.");
        router.replace("/app");
        router.refresh();
      } else {
        setError(authErrorMessage(res.code));
      }
    },
    [supabase, router],
  );

  return {
    step,
    email,
    error,
    pending,
    resendIn: resend.seconds,
    setEmail,
    backToRequest,
    sendCode,
    verifyCode,
    savePassword,
  };
}

export type ResetController = ReturnType<typeof useReset>;
