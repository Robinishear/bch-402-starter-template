"use client";

import { useEffect, useState, useTransition } from "react";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { handleForgotPassword, handleResetPassword } from "../core/auth.actions";

const RESEND_SECONDS = 60;

type Step = "email" | "reset";

export function ForgotPasswordModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("email");
  const [pending, startTransition] = useTransition();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // resend countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const resetAll = () => {
    setStep("email");
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setError("");
    setCooldown(0);
  };

  const onOpenChange = (next: boolean) => {
    if (pending) return; // loading এর সময় বন্ধ হবে না
    setOpen(next);
    if (!next) resetAll();
  };

  const sendOtp = (isResend = false) => {
    setError("");
    startTransition(async () => {
      const res = await handleForgotPassword(email.trim());
      if (!res.success) {
        setError(res.message);
        return;
      }
      setStep("reset");
      setCooldown(RESEND_SECONDS);
      if (isResend) toast.success("A new OTP has been sent.");
    });
  };

  const submitReset = () => {
    setError("");
    startTransition(async () => {
      const res = await handleResetPassword({
        email: email.trim(),
        otp,
        newPassword,
        confirmPassword,
      });
      if (!res.success) {
        setError(res.message);
        return;
      }
      toast.success(res.message);
      setOpen(false);
      resetAll();
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-emerald-300 transition-colors hover:text-emerald-200 hover:underline underline-offset-4"
      >
        Forgot password?
      </button>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md rounded-2xl border-white/10 bg-[#0b0f0e] text-gray-200">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-white">
              {step === "email" ? "Forgot your password?" : "Reset your password"}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-400">
              {step === "email" ? (
                "Enter your email and we will send you a 6-digit code."
              ) : (
                <>
                  We sent a code to <span className="font-medium text-gray-200">{email}</span>. It expires in 10 minutes.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {step === "email" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendOtp();
              }}
              className="space-y-4"
            >
              <Input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                disabled={pending}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                required
              />

              {error && <p className="text-sm text-red-300">{error}</p>}

              <Button
                type="submit"
                disabled={pending || !email.trim()}
                className="h-10 w-full bg-emerald-500 text-black hover:bg-emerald-400"
              >
                {pending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Sending code...
                  </>
                ) : (
                  "Send code"
                )}
              </Button>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitReset();
              }}
              className="space-y-4"
            >
              <Input
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="000000"
                value={otp}
                disabled={pending}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="h-12 border-white/10 bg-white/5 text-center font-mono text-2xl tracking-[0.6em] text-white placeholder:text-gray-600"
                required
              />

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="New password"
                  value={newPassword}
                  disabled={pending}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-10 border-white/10 bg-white/5 pr-10 text-white placeholder:text-gray-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 text-gray-400 hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>

              <Input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Confirm new password"
                value={confirmPassword}
                disabled={pending}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-10 border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                required
              />

              {error && <p className="text-sm text-red-300">{error}</p>}

              <Button
                type="submit"
                disabled={pending || otp.length !== 6 || !newPassword || !confirmPassword}
                className="h-10 w-full bg-emerald-500 text-black hover:bg-emerald-400"
              >
                {pending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Updating password...
                  </>
                ) : (
                  "Reset password"
                )}
              </Button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => {
                    setStep("email");
                    setOtp("");
                    setError("");
                  }}
                  className="inline-flex items-center gap-1 text-gray-400 hover:text-white disabled:opacity-50"
                >
                  <ArrowLeft className="size-3.5" /> Change email
                </button>

                <button
                  type="button"
                  disabled={pending || cooldown > 0}
                  onClick={() => sendOtp(true)}
                  className="text-emerald-300 hover:text-emerald-200 disabled:text-gray-500"
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}