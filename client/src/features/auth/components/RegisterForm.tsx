"use client";

import { useActionState, useEffect } from "react";

import { handleRegister } from "../core/auth.actions";
import { showErrorAlert, showSuccessAlert } from "../swal/swal_register";
import { AuthCard, FormField, SubmitButton } from "./AuthCard";

const FIELDS = [
  { name: "name", label: "Name", type: "text", placeholder: "Your name", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", placeholder: "user@example.com", autoComplete: "email" },
  { name: "password", label: "Password", type: "password", placeholder: "••••••••", autoComplete: "new-password" },
] as const;

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(handleRegister, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) showSuccessAlert(state.message);
    else showErrorAlert(state.message);
  }, [state]);

  return (
    <AuthCard
      eyebrow="Get started"
      title="Create your account"
      subtitle="Pay per request with BCH. No subscription."
      footerText="Already have an account?"
      footerLabel="Login"
      footerHref="/login"
    >
      <form action={formAction} noValidate className="space-y-4">
        {FIELDS.map((field) => (
          <FormField key={field.name} {...field} />
        ))}
        <SubmitButton pending={isPending} label="Register" pendingLabel="Registering…" />
      </form>
    </AuthCard>
  );
}