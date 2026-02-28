"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [valid, setValid] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token || token.length < 32) {
      setValid(false);
      return;
    }
    fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        setValid(data.valid === true);
        setEmail(data.email ?? null);
      })
      .catch(() => setValid(false));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage(null);
    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      setStatus("error");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setStatus("error");
      return;
    }
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword,
          confirmPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error ?? "Something went wrong.");
        return;
      }
      setStatus("success");
      setTimeout(() => router.push("/sign-in"), 2000);
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  if (valid === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[var(--background)] px-4">
        <Logo href="/" variant="compact" />
        <div className="text-[var(--muted)]">Checking link…</div>
      </div>
    );
  }
  if (valid === false) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[var(--background)] px-4">
        <Logo href="/" variant="compact" />
        <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-6 text-center">
          <h1 className="text-xl font-bold text-[var(--foreground)]">Invalid or expired link</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            This reset link has expired or is invalid. Please request a new one.
          </p>
          <Link
            href="/forgot-password"
            className="mt-4 inline-block font-medium text-[var(--primary)] hover:underline"
          >
            Request new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[var(--background)] px-4">
      <Logo href="/" variant="compact" />
      <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-6 shadow-[0_0_40px_rgba(0,240,255,0.06)] backdrop-blur">
        <h1 className="text-center text-xl font-bold text-[var(--foreground)]">Set new password</h1>
        {email && (
          <p className="mt-1 text-center text-sm text-[var(--muted)]">for {email}</p>
        )}
        {status === "success" ? (
          <p className="mt-6 text-center text-sm text-[var(--foreground)]">
            Password updated. Redirecting to sign in…
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-[var(--foreground)]"
              >
                New password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none"
                placeholder="At least 8 characters"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-[var(--foreground)]"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>
            {errorMessage && <p className="text-sm text-[var(--tertiary)]">{errorMessage}</p>}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-lg bg-[var(--primary)] py-2.5 text-sm font-medium text-[var(--primary-contrast)] transition-all duration-300 hover:opacity-90 disabled:opacity-50"
            >
              {status === "loading" ? "Updating…" : "Update password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
          <div className="text-[var(--muted)]">Loading…</div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
