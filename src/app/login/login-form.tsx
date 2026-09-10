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
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";
type Step = "form" | "code";
type OtpType = "email" | "signup";

function friendlyError(err: unknown): string {
  const m =
    err instanceof Error ? err.message : typeof err === "string" ? err : "";
  if (/invalid login credentials/i.test(m)) return "Wrong email or password.";
  if (/email not confirmed/i.test(m))
    return "Confirm your email first — enter the code we sent.";
  if (/expired|invalid.*(token|otp)|otp.*invalid/i.test(m))
    return "That code didn't work. Try again or resend.";
  if (/already registered|already exists/i.test(m))
    return "That email already has an account — sign in instead.";
  if (/rate limit|too many|after \d+ seconds/i.test(m))
    return "Too many attempts. Wait a minute and try again.";
  if (/password should be at least|at least 8/i.test(m))
    return "Password must be at least 8 characters.";
  return m || "Something went wrong. Try again.";
}

function Field({
  id,
  label,
  icon,
  trailing,
  children,
}: {
  id: string;
  label: string;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        {icon ? (
          <span className="text-muted-foreground/70 pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2">
            {icon}
          </span>
        ) : null}
        {children}
        {trailing ? (
          <span className="absolute top-1/2 right-2 -translate-y-1/2">
            {trailing}
          </span>
        ) : null}
      </div>
    </div>
  );
}

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

  async function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        finish("Signed in");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: name.trim() || null } },
      });
      if (error) throw error;
      if (data.session) {
        finish("Account created");
      } else {
        // email confirmation is on — collect the 6-digit code
        setOtpType("signup");
        setCode("");
        setResendIn(30);
        setStep("code");
      }
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setPending(false);
    }
  }

  async function sendCode() {
    setError(null);
    setPending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: mode === "signup" },
      });
      if (error) throw error;
      setOtpType("email");
      setCode("");
      setResendIn(30);
      setStep("code");
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setPending(false);
    }
  }

  async function verifyCode(token: string) {
    if (token.length < 6 || pending) return;
    setError(null);
    setPending(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: otpType,
      });
      if (error) throw error;
      finish("Signed in");
    } catch (err) {
      setError(friendlyError(err));
      setCode("");
    } finally {
      setPending(false);
    }
  }

  const cta = mode === "signin" ? "Sign in" : "Create account";

  return (
    <div className="flex flex-col">
      {/* brand */}
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
              <Field id="name" label="Name">
                <Input
                  id="name"
                  autoComplete="name"
                  placeholder="What should we call you?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>
            ) : null}

            <Field
              id="email"
              label="Email"
              icon={<Mail className="size-[18px]" strokeWidth={1.8} />}
            >
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>

            <Field
              id="password"
              label="Password"
              icon={<Lock className="size-[18px]" strokeWidth={1.8} />}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="text-muted-foreground hover:text-foreground flex size-9 items-center justify-center rounded-md transition-colors"
                >
                  {showPw ? (
                    <EyeOff className="size-[18px]" strokeWidth={1.8} />
                  ) : (
                    <Eye className="size-[18px]" strokeWidth={1.8} />
                  )}
                </button>
              }
            >
              <Input
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
                className="pr-11 pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
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

            {error ? <ErrorLine message={error} /> : null}

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

          <div className="my-5 flex items-center gap-3">
            <span className="bg-border h-px flex-1" />
            <span className="text-micro text-muted-foreground font-sans">
              or
            </span>
            <span className="bg-border h-px flex-1" />
          </div>

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

          {error ? <ErrorLine message={error} className="mt-4" /> : null}

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

function ErrorLine({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <p
      className={`text-caption text-destructive flex items-center gap-1.5 font-sans ${className ?? ""}`}
      role="alert"
    >
      <TriangleAlert className="size-3.5 shrink-0" strokeWidth={2.2} />
      {message}
    </p>
  );
}
