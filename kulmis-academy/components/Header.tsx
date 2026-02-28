"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Logo } from "@/components/Logo";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export function Header() {
  const { data: session, status } = useSession();
  const isSignedIn = status === "authenticated" && !!session?.user;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = (
    <>
      <Link
        href="#features"
        className="block rounded-lg px-4 py-2 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--border)]/50 hover:text-[var(--foreground)] md:inline-block md:rounded-none md:px-0 md:py-0 md:hover:bg-transparent"
        onClick={() => setMobileMenuOpen(false)}
      >
        Features
      </Link>
      <Link
        href="#pricing"
        className="block rounded-lg px-4 py-2 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--border)]/50 hover:text-[var(--foreground)] md:inline-block md:rounded-none md:px-0 md:py-0 md:hover:bg-transparent"
        onClick={() => setMobileMenuOpen(false)}
      >
        Pricing
      </Link>
      <Link
        href="#courses"
        className="block rounded-lg px-4 py-2 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--border)]/50 hover:text-[var(--foreground)] md:inline-block md:rounded-none md:px-0 md:py-0 md:hover:bg-transparent"
        onClick={() => setMobileMenuOpen(false)}
      >
        Courses
      </Link>
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-lg">
      <div className="mx-auto flex h-14 min-h-[3.5rem] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo href="/" className="shrink-0" />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 md:flex">
          <ThemeSwitcher />
          {navLinks}
          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-contrast)] transition-all duration-300 hover:opacity-90"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => signOut({ redirect: false }).then(() => { window.location.href = "/"; })}
                className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-contrast)] transition-all duration-300 hover:opacity-90"
              >
                Start Learning
              </Link>
            </>
          )}
        </nav>

        {/* Mobile: right side theme + auth + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeSwitcher />
          {isSignedIn && (
            <button
              type="button"
              onClick={() => signOut({ redirect: false }).then(() => { window.location.href = "/"; })}
              className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--foreground)]"
            >
              Sign out
            </button>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="rounded-lg p-2 text-[var(--foreground)] hover:bg-[var(--border)]/50"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      <div
        className={`absolute left-0 right-0 top-14 border-b border-[var(--border)] bg-[var(--surface)]/98 backdrop-blur-lg transition-all duration-200 md:hidden ${
          mobileMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 p-4">
          {navLinks}
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-[var(--primary)] px-4 py-3 text-center font-medium text-[var(--primary-contrast)]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-lg border border-[var(--border)] px-4 py-3 text-center text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg bg-[var(--primary)] px-4 py-3 text-center font-medium text-[var(--primary-contrast)]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Start Learning
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
