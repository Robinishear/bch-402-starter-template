// validations/auth.validation.ts
import { z } from "zod";

export const registerValidationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

export const loginValidationSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});


export const forgotPasswordValidationSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const resetPasswordValidationSchema = z
  .object({
    email: z.string().email("Enter a valid email address"),
    otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerValidationSchema>;
export type LoginFormValues = z.infer<typeof loginValidationSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordValidationSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordValidationSchema>;