"use client";

import { useState, type ComponentProps } from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/_core/utils/utils";
import { Button } from "@/components/ui/button";
import { socialLogin } from "../lib/auth-client";

type Provider = "google" | "github";

function GoogleIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function GithubIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

const PROVIDERS = [
  { id: "google", label: "Continue with Google", Icon: GoogleIcon },
  { id: "github", label: "Continue with GitHub", Icon: GithubIcon },
] as const;

export default function SocialButtons() {
  const [loading, setLoading] = useState<Provider | null>(null);

  const handle = async (provider: Provider) => {
    setLoading(provider);
    try {
      await socialLogin(provider);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="mx-auto mt-4 w-full max-w-md space-y-3">
      {PROVIDERS.map(({ id, label, Icon }) => {
        const isLoading = loading === id;

        return (
          <Button
            key={id}
            type="button"
            variant="outline"
            onClick={() => handle(id)}
            disabled={loading !== null}
            aria-busy={isLoading}
            className={cn(
              "h-11 w-full gap-3 rounded-xl border-white/10 bg-white/5 text-sm font-medium text-white shadow-none transition",
              "hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-white",
              isLoading && "border-emerald-500/40 bg-emerald-500/10 disabled:opacity-100",
            )}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Icon className="size-5" />}
            {isLoading ? "Redirecting…" : label}
          </Button>
        );
      })}
    </div>
  );
}