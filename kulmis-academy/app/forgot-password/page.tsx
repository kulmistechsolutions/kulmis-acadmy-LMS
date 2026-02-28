"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error ?? "Something went wrong.");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[var(--background)] px-4">
      <Logo href="/" variant="compact" />
      <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-6 shadow-[0_0_40px_rgba(0,240,255,0.06)] backdrop-blur">
        <h1 className="text-center text-xl font-bold text-[var(--foreground)]">Forgot password?</h1>
        <p className="mt-2 text-center text-sm text-[var(--muted)]">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
        {status === "success" ? (
          <div className="mt-6 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/5 p-4 text-center text-sm text-[var(--foreground)]">
            If an account exists with that email, you will receive a reset link shortly. Check your
            inbox and spam folder.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)]">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
            {errorMessage && <p className="text-sm text-[var(--tertiary)]">{errorMessage}</p>}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-lg bg-[var(--primary)] py-2.5 text-sm font-medium text-[var(--primary-contrast)] transition-all duration-300 hover:opacity-90 disabled:opacity-50"
            >
              {status === "loading" ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}
        <p className="mt-4 text-center text-sm text-[var(--muted)]">
          <Link href="/sign-in" className="font-medium text-[var(--primary)] hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
