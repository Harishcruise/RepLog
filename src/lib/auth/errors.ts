import type { AuthError } from "@supabase/supabase-js";

/**
 * Stable, platform-agnostic auth failure codes. Web maps them to copy below;
 * a mobile client maps the same codes to its own strings / i18n.
 */
export type AuthErrorCode =
  | "invalid_credentials"
  | "email_not_confirmed"
  | "invalid_or_expired_code"
  | "account_exists"
  | "rate_limited"
  | "weak_password"
  | "invalid_input"
  | "unknown";

function isAuthError(e: unknown): e is AuthError {
  return typeof e === "object" && e !== null && "message" in e && "status" in e;
}

/** Normalize any thrown/returned auth error into an {@link AuthErrorCode}. */
export function toAuthErrorCode(err: unknown): AuthErrorCode {
  const code = isAuthError(err) ? (err.code ?? "") : "";
  const msg = err instanceof Error ? err.message.toLowerCase() : "";

  if (code === "invalid_credentials" || /invalid login credentials/.test(msg)) {
    return "invalid_credentials";
  }
  if (code === "email_not_confirmed" || /email not confirmed/.test(msg)) {
    return "email_not_confirmed";
  }
  if (
    code === "otp_expired" ||
    code === "otp_disabled" ||
    /token has expired|invalid otp|otp.*(invalid|expired)/.test(msg)
  ) {
    return "invalid_or_expired_code";
  }
  if (
    code === "user_already_exists" ||
    code === "email_exists" ||
    /already registered|already exists/.test(msg)
  ) {
    return "account_exists";
  }
  if (
    code === "over_email_send_rate_limit" ||
    code === "over_request_rate_limit" ||
    /rate limit|too many|for security purposes/.test(msg)
  ) {
    return "rate_limited";
  }
  if (
    code === "weak_password" ||
    /password should be at least|at least 8 characters/.test(msg)
  ) {
    return "weak_password";
  }
  return "unknown";
}

const MESSAGES: Record<AuthErrorCode, string> = {
  invalid_credentials: "Wrong email or password.",
  email_not_confirmed: "Confirm your email first — enter the code we sent.",
  invalid_or_expired_code: "That code didn't work. Try again or resend.",
  account_exists: "That email already has an account — sign in instead.",
  rate_limited: "Too many attempts. Wait a minute and try again.",
  weak_password: "Password must be at least 8 characters.",
  invalid_input: "Check the details and try again.",
  unknown: "Something went wrong. Try again.",
};

/** Web-facing copy for an {@link AuthErrorCode}. */
export function authErrorMessage(code: AuthErrorCode): string {
  return MESSAGES[code];
}
