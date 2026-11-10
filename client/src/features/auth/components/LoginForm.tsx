"use client";

import { useActionState, useEffect } from "react";

import { handleLogin } from "../core/auth.actions";
import { showErrorAlert } from "../swal/swal_register";
import { AuthCard, FormField, SubmitButton } from "./AuthCard";
import { ForgotPasswordModal } from "./ForgotPasswordModal";

const FIELDS = [
  { name: "email", label: "Email", type: "email", placeholder: "user@example.com", autoComplete: "email" },
  { name: "password", label: "Password", type: "password", placeholder: "••••••••", autoComplete: "current-password" },
] as const;

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(handleLogin, null);

  useEffect(() => {
    if (state && !state.success) showErrorAlert(state.message);
  }, [state]);

  return (
    <AuthCard
      eyebrow="Welcome back"
      title="Login to your account"
      subtitle="Pay per request with BCH. No subscription."
      footerText="Don't have an account?"
      footerLabel="Register"
      footerHref="/register"
    >
      <form action={formAction} noValidate className="space-y-4">
        {FIELDS.map((field) => (
          <FormField key={field.name} {...field} />
        ))}
        <SubmitButton pending={isPending} label="Login" pendingLabel="Logging in…" />
      </form>
      <div className="flex justify-end">
  <ForgotPasswordModal />
</div>
    </AuthCard>
  );
}