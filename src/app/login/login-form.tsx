"use client";

import {
  ArrowRight,
  ChevronLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { LogoMark } from "@/components/brand/logo-mark";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authErrorMessage } from "@/lib/auth/errors";
import {
  sendEmailOtp,
  signInWithPassword,
  signUp,
  verifyEmailOtp,
} from "@/lib/auth/operations";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";
type Step = "form" | "code";
type OtpType = "email" | "signup";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const [mode, setMode] = useState<Mode>("signin");
  const [step, setStep] = useState<Step>("form");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [otpType, setOtpType] = useState<OtpType>("email");
  const [code, setCode] = useState("");
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  function finish(message: string) {
    toast.success(message);
    router.replace(next);
    router.refresh();
  }

  function goToCodeStep(type: OtpType) {
    setOtpType(type);
    setCode("");
    setResendIn(30);
    setStep("code");
  }

  async function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    if (mode === "signin") {
      const res = await signInWithPassword(supabase, { email, password });
      if (res.ok) finish("Signed in");
      else setError(authErrorMessage(res.code));
    } else {
      const res = await signUp(supabase, {
        name: name.trim() || undefined,
        email,
        password,
      });
      if (!res.ok) setError(authErrorMessage(res.code));
      else if (res.data === "session") finish("Account created");
      else goToCodeStep("signup"); // confirm-email is on — collect the code
    }

    setPending(false);
  }

  async function sendCode() {
    setError(null);
    setPending(true);
    const res = await sendEmailOtp(supabase, {
      email,
      createUser: mode === "signup",
    });
    if (res.ok) goToCodeStep("email");
    else setError(authErrorMessage(res.code));
    setPending(false);
  }

  async function verifyCode(token: string) {
    if (token.length < 6 || pending) return;
    setError(null);
    setPending(true);
    const res = await verifyEmailOtp(supabase, { email, token, type: otpType });
    if (res.ok) {
      finish("Signed in");
    } else {
      setError(authErrorMessage(res.code));
      setCode("");
    }
    setPending(false);
  }

  const cta = mode === "signin" ? "Sign in" : "Create account";

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center gap-3.5">
        <LogoMark className="size-13" />
        <div className="flex flex-col items-center gap-1">
          <span className="font-display text-[27px] font-semibold tracking-[-0.014em]">
            RepLog
          </span>
          <span className="text-label text-muted-foreground font-sans">
            {step === "code"
              ? "Almost there."
              : mode === "signin"
                ? "Log every set. Watch it climb."
                : "Start your first workout in a minute."}
          </span>
        </div>
      </div>

      {step === "form" ? (
        <>
          <Tabs
            value={mode}
            onValueChange={(v) => {
              setMode(v as Mode);
              setError(null);
            }}
            className="mt-10"
          >
            <TabsList variant="segmented">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={submitPassword} className="mt-6 flex flex-col gap-4">
            {mode === "signup" ? (
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  autoComplete="name"
                  placeholder="What should we call you?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>
            ) : null}

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <Mail strokeWidth={1.8} />
                </InputGroupAddon>
                <InputGroupInput
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <Lock strokeWidth={1.8} />
                </InputGroupAddon>
                <InputGroupInput
                  id="password"
                  type={showPw ? "text" : "password"}
                  required
                  minLength={mode === "signup" ? 8 : undefined}
                  autoComplete={
                    mode === "signup" ? "new-password" : "current-password"
                  }
                  placeholder={
                    mode === "signup" ? "At least 8 characters" : "••••••••"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-sm"
                    aria-label={showPw ? "Hide password" : "Show password"}
                    onClick={() => setShowPw((v) => !v)}
                  >
                    {showPw ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>

            {mode === "signin" ? (
              <div className="-mt-1 flex justify-end">
                <Link
                  href="/login/reset"
                  className="text-caption text-primary hover:text-primary-hover font-sans font-medium"
                >
                  Forgot password?
                </Link>
              </div>
            ) : null}

            {error ? (
              <FieldError>
                <TriangleAlert
                  className="size-3.5 shrink-0"
                  strokeWidth={2.2}
                />
                {error}
              </FieldError>
            ) : null}

            <Button
              type="submit"
              size="lg"
              className="mt-1 w-full"
              disabled={pending}
            >
              {pending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  {cta}
                  <ArrowRight />
                </>
              )}
            </Button>
          </form>

          <FieldSeparator className="my-5">or</FieldSeparator>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={pending || !email}
            onClick={sendCode}
          >
            <Mail />
            Email me a sign-in code
          </Button>

          {mode === "signup" ? (
            <p className="text-micro text-muted-foreground/80 mt-8 text-center font-sans leading-4">
              By creating an account you agree to the{" "}
              <Link
                href="/terms"
                className="text-primary hover:text-primary-hover"
              >
                Terms
              </Link>{" "}
              &amp;{" "}
              <Link
                href="/privacy"
                className="text-primary hover:text-primary-hover"
              >
                Privacy Policy
              </Link>
              .
            </p>
          ) : null}
        </>
      ) : (
        <div className="mt-9 flex flex-col">
          <button
            type="button"
            onClick={() => {
              setStep("form");
              setError(null);
              setCode("");
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
              onComplete={verifyCode}
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
            {resendIn > 0 ? (
              <>
                Didn&apos;t get it?{" "}
                <span className="tabular-nums">
                  Resend in 0:{String(resendIn).padStart(2, "0")}
                </span>
              </>
            ) : (
              <>
                Didn&apos;t get it?{" "}
                <button
                  type="button"
                  onClick={sendCode}
                  disabled={pending}
                  className="text-primary hover:text-primary-hover font-medium disabled:opacity-50"
                >
                  Resend code
                </button>
              </>
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
            onClick={() => verifyCode(code)}
          >
            {pending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Verify & continue"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
