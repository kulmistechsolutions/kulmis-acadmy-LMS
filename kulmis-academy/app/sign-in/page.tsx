"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const isUpgradeFlow = callbackUrl.includes("upgrade");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("Invalid email or password.");
        return;
      }
      if (res?.ok) {
        router.push(callbackUrl);
        router.refresh();
        return;
      }
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[var(--background)] px-4">
      <Logo href="/" variant="compact" />
      <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-6 shadow-[0_0_40px_rgba(0,240,255,0.06)] backdrop-blur">
        <h1 className="text-center text-xl font-bold text-[var(--foreground)]">Sign in</h1>
        {isUpgradeFlow && (
          <p className="mt-3 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/5 px-3 py-2 text-center text-sm text-[var(--foreground)]">
            Please create an account or login before upgrading to Pro.
          </p>
        )}
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
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--foreground)]">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
          {error && (
            <p className="text-sm text-[var(--tertiary)]">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--primary)] py-2.5 text-sm font-medium text-[var(--primary-contrast)] transition-all duration-300 hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-[var(--muted)]">
          Don&apos;t have an account?{" "}
          <Link href={"/sign-up" + (callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : "")} className="font-medium text-[var(--primary)] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="text-[var(--muted)]">Loading…</div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
