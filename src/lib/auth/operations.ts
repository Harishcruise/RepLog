import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import {
  emailSchema,
  passwordSchema,
  signInSchema,
  signUpSchema,
  verifyOtpSchema,
  type SignInInput,
  type SignUpInput,
  type VerifyOtpInput,
} from "@/lib/validation/auth";

import { toAuthErrorCode, type AuthErrorCode } from "./errors";

/**
 * Framework-free auth primitives. Each takes a Supabase client (browser or
 * server) plus typed input and returns a normalized {@link AuthResult} — they
 * never throw. The calling UI owns the flow/state machine.
 */

type Sb = SupabaseClient<Database>;

export type AuthResult<T = undefined> =
  { ok: true; data: T } | { ok: false; code: AuthErrorCode };

const fail = (code: AuthErrorCode) => ({ ok: false as const, code });
const done = <T>(data: T) => ({ ok: true as const, data });

export async function signInWithPassword(
  sb: Sb,
  input: SignInInput,
): Promise<AuthResult> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) return fail("invalid_input");
  try {
    const { error } = await sb.auth.signInWithPassword(parsed.data);
    return error ? fail(toAuthErrorCode(error)) : done(undefined);
  } catch (err) {
    return fail(toAuthErrorCode(err));
  }
}

export type SignUpOutcome = "session" | "needs_confirmation";

export async function signUp(
  sb: Sb,
  input: SignUpInput,
): Promise<AuthResult<SignUpOutcome>> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    const weak = parsed.error.issues.some((i) => i.path[0] === "password");
    return fail(weak ? "weak_password" : "invalid_input");
  }
  try {
    const { data, error } = await sb.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: { data: { display_name: parsed.data.name ?? null } },
    });
    if (error) return fail(toAuthErrorCode(error));
    return done(data.session ? "session" : "needs_confirmation");
  } catch (err) {
    return fail(toAuthErrorCode(err));
  }
}

export async function sendEmailOtp(
  sb: Sb,
  input: { email: string; createUser: boolean },
): Promise<AuthResult> {
  const email = emailSchema.safeParse(input.email);
  if (!email.success) return fail("invalid_input");
  try {
    const { error } = await sb.auth.signInWithOtp({
      email: email.data,
      options: { shouldCreateUser: input.createUser },
    });
    return error ? fail(toAuthErrorCode(error)) : done(undefined);
  } catch (err) {
    return fail(toAuthErrorCode(err));
  }
}

export async function verifyEmailOtp(
  sb: Sb,
  input: VerifyOtpInput,
): Promise<AuthResult> {
  const parsed = verifyOtpSchema.safeParse(input);
  if (!parsed.success) return fail("invalid_or_expired_code");
  try {
    const { error } = await sb.auth.verifyOtp(parsed.data);
    return error ? fail(toAuthErrorCode(error)) : done(undefined);
  } catch (err) {
    return fail(toAuthErrorCode(err));
  }
}

/** Sends a password-recovery email (6-digit code, per the template). */
export async function sendPasswordReset(
  sb: Sb,
  input: { email: string },
): Promise<AuthResult> {
  const email = emailSchema.safeParse(input.email);
  if (!email.success) return fail("invalid_input");
  try {
    const { error } = await sb.auth.resetPasswordForEmail(email.data);
    return error ? fail(toAuthErrorCode(error)) : done(undefined);
  } catch (err) {
    return fail(toAuthErrorCode(err));
  }
}

/** Sets a new password on the current (e.g. recovery) session. */
export async function updatePassword(
  sb: Sb,
  input: { password: string },
): Promise<AuthResult> {
  const parsed = passwordSchema.safeParse(input.password);
  if (!parsed.success) return fail("weak_password");
  try {
    const { error } = await sb.auth.updateUser({ password: parsed.data });
    return error ? fail(toAuthErrorCode(error)) : done(undefined);
  } catch (err) {
    return fail(toAuthErrorCode(err));
  }
}
