import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

import { authErrorMessage } from "@/lib/auth/errors";
import {
  sendEmailOtp,
  signInWithPassword,
  signUp,
  verifyEmailOtp,
} from "@/lib/auth/operations";
import { createClient } from "@/lib/supabase/client";

import { useResendTimer } from "./use-resend-timer";

export type Mode = "signin" | "signup";
export type Step = "form" | "code";
type OtpType = "email" | "signup";

const RESEND_SECONDS = 30;

/**
 * The /login state machine. Owns the shared state (mode, step, email) and
 * orchestrates the `lib/auth` operations. No JSX — the screen components read
 * this and render.
 */
export function useLogin({ next }: { next: string }) {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const resend = useResendTimer();

  const [mode, setMode] = useState<Mode>("signin");
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const otpType = useRef<OtpType>("email");

  const finish = useCallback(
    (message: string) => {
      toast.success(message);
      router.replace(next);
      router.refresh();
    },
    [router, next],
  );

  const changeMode = useCallback((m: Mode) => {
    setMode(m);
    setError(null);
  }, []);

  const backToForm = useCallback(() => {
    setStep("form");
    setError(null);
  }, []);

  const toCodeStep = useCallback(
    (type: OtpType) => {
      otpType.current = type;
      resend.start(RESEND_SECONDS);
      setStep("code");
    },
    [resend],
  );

  const submitCredentials = useCallback(
    async (input: { name?: string; password: string }) => {
      setError(null);
      setPending(true);

      if (mode === "signin") {
        const res = await signInWithPassword(supabase, {
          email,
          password: input.password,
        });
        if (res.ok) finish("Signed in");
        else setError(authErrorMessage(res.code));
      } else {
        const res = await signUp(supabase, {
          name: input.name,
          email,
          password: input.password,
        });
        if (!res.ok) setError(authErrorMessage(res.code));
        else if (res.data === "session") finish("Account created");
        else toCodeStep("signup"); // confirm-email is on — collect the code
      }

      setPending(false);
    },
    [mode, email, supabase, finish, toCodeStep],
  );

  const sendCode = useCallback(async () => {
    setError(null);
    setPending(true);
    const res = await sendEmailOtp(supabase, {
      email,
      createUser: mode === "signup",
    });
    if (res.ok) toCodeStep("email");
    else setError(authErrorMessage(res.code));
    setPending(false);
  }, [supabase, email, mode, toCodeStep]);

  /** Returns true on success (the caller can clear its local input on failure). */
  const verifyCode = useCallback(
    async (token: string) => {
      if (token.length < 6 || pending) return false;
      setError(null);
      setPending(true);
      const res = await verifyEmailOtp(supabase, {
        email,
        token,
        type: otpType.current,
      });
      setPending(false);
      if (res.ok) {
        finish("Signed in");
        return true;
      }
      setError(authErrorMessage(res.code));
      return false;
    },
    [supabase, email, pending, finish],
  );

  return {
    mode,
    step,
    email,
    error,
    pending,
    resendIn: resend.seconds,
    setEmail,
    changeMode,
    backToForm,
    submitCredentials,
    sendCode,
    verifyCode,
  };
}

export type LoginController = ReturnType<typeof useLogin>;
