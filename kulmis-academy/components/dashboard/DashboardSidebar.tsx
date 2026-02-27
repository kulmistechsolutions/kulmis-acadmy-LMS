"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

type DashboardSidebarProps = {
  isAdmin: boolean;
};

export function DashboardSidebar({ isAdmin }: DashboardSidebarProps) {
  const [open, setOpen] = useState(false);

  const linkClass =
    "block rounded-lg px-4 py-2 text-sm text-[var(--muted)] hover:bg-[var(--border)]/50 hover:text-[var(--foreground)]";

  const nav = (
    <>
      <Link href="/dashboard/courses" className={linkClass} onClick={() => setOpen(false)}>
        Enrolled courses
      </Link>
      <Link href="/dashboard/certificates" className={linkClass} onClick={() => setOpen(false)}>
        My Certificates
      </Link>
      <Link href="/dashboard" className={linkClass} onClick={() => setOpen(false)}>
        Profile
      </Link>
      {isAdmin && (
        <Link href="/admin" className={linkClass} onClick={() => setOpen(false)}>
          Admin
        </Link>
      )}
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed left-0 right-0 top-0 z-30 flex h-14 items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/95 px-4 backdrop-blur md:hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg p-2 text-[var(--foreground)] hover:bg-[var(--border)]/50"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <Logo href="/" variant="compact" onClick={() => setOpen(false)} />
        <ThemeSwitcher />
      </div>

      {/* Mobile overlay */}
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        />
      )}

      {/* Sidebar: drawer on mobile, fixed on desktop */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 border-r border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur transition-transform duration-200 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-[var(--border)] px-4 md:h-16">
          <Logo href="/" variant="compact" onClick={() => setOpen(false)} />
          <ThemeSwitcher />
        </div>
        <nav className="space-y-1 p-4">{nav}</nav>
      </aside>

      {/* Spacer for mobile top bar; main content area */}
      <div className="h-14 md:hidden" aria-hidden />
    </>
  );
}
