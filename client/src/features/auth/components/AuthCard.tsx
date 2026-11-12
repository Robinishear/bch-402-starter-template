import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SocialButtons from "./SocialButtons";
import { AuthCardProps } from "./constants";

export function AuthCard({ eyebrow, title, subtitle, footerText, footerLabel, footerHref, children }: AuthCardProps) {
  return (
    <div className="mx-auto my-12 w-full max-w-md px-3">
      <div className="rounded-3xl bg-linear-to-b from-emerald-500/40 via-white/10 to-white/5 p-px shadow-[0_24px_80px_-20px_rgba(16,185,129,0.35)]">
        <div className="rounded-[23px] bg-[#04100c]/90 p-6 sm:p-8">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-400/80">{eyebrow}</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">{title}</h2>
            <p className="mt-2 text-sm text-gray-400">{subtitle}</p>
          </div>

          <div className="mt-7">{children}</div>

          <div className="my-6 flex items-center gap-3 text-xs text-gray-500">
            <span className="h-px flex-1 bg-white/10" />
            or continue with
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <SocialButtons />

          <p className="mt-6 text-center text-sm text-gray-400">
            {footerText}{" "}
            <Link href={footerHref} className="font-medium text-emerald-300 transition-colors hover:text-emerald-200">
              {footerLabel}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

type FormFieldProps = ComponentProps<typeof Input> & { name: string; label: string };

export function FormField({ name, label, ...props }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm text-gray-300">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        className="h-11 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20"
        {...props}
      />
    </div>
  );
}

type SubmitButtonProps = { pending: boolean; label: string; pendingLabel: string };

export function SubmitButton({ pending, label, pendingLabel }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-11 w-full rounded-xl bg-emerald-500 font-semibold text-black shadow-[0_0_28px_rgba(16,185,129,0.35)] hover:bg-emerald-400"
    >
      {pending && <Loader2 className="animate-spin" />}
      {pending ? pendingLabel : label}
    </Button>
  );
}