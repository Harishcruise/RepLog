"use client";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { LoginController, Mode } from "./use-login";

/** Sign in / Create account — password primary, "email me a code" fallback. */
export function CredentialsForm({ login }: { login: LoginController }) {
  const { mode, email, error, pending } = login;

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const cta = mode === "signin" ? "Sign in" : "Create account";

  return (
    <>
      <Tabs
        value={mode}
        onValueChange={(v) => login.changeMode(v as Mode)}
        className="mt-10"
      >
        <TabsList variant="segmented">
          <TabsTrigger value="signin">Sign in</TabsTrigger>
          <TabsTrigger value="signup">Create account</TabsTrigger>
        </TabsList>
      </Tabs>

      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          void login.submitCredentials({
            name: name.trim() || undefined,
            password,
          });
        }}
      >
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
              onChange={(e) => login.setEmail(e.target.value)}
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
            <TriangleAlert className="size-3.5 shrink-0" strokeWidth={2.2} />
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
        onClick={() => void login.sendCode()}
      >
        <Mail />
        Email me a sign-in code
      </Button>

      {mode === "signup" ? (
        <p className="text-micro text-muted-foreground/80 mt-8 text-center font-sans leading-4">
          By creating an account you agree to the{" "}
          <Link href="/terms" className="text-primary hover:text-primary-hover">
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
  );
}
