import { z } from "zod";

/** Shared by the login form and the auth operations. */

export const emailSchema = z.email();

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});
export type SignInInput = z.infer<typeof signInSchema>;

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.");

export const signUpSchema = z.object({
  name: z.string().trim().max(80).optional(),
  email: emailSchema,
  password: passwordSchema,
});
export type SignUpInput = z.infer<typeof signUpSchema>;

export const otpTokenSchema = z
  .string()
  .regex(/^\d{6}$/, "Enter the 6-digit code.");

export const verifyOtpSchema = z.object({
  email: emailSchema,
  token: otpTokenSchema,
  type: z.enum(["email", "signup", "recovery"]),
});
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
