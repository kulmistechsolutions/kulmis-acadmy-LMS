"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

type AdminTopbarProps = {
  adminEmail: string;
};

export function AdminTopbar({ adminEmail }: AdminTopbarProps) {
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--surface)]/90 px-4 backdrop-blur-md lg:pl-6 lg:pr-6">
      <div className="flex min-w-0 flex-1 items-center gap-4 lg:max-w-md">
        <label className="hidden shrink-0 text-sm text-[var(--muted)] sm:block">Search</label>
        <input
          type="search"
          placeholder="Search students, courses…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)]/60 px-4 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/50"
        />
      </div>
      <div className="relative flex shrink-0 items-center gap-2">
        <ThemeSwitcher />
        <button
          type="button"
          onClick={() => setProfileOpen((o) => !o)}
          className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)]/60 px-3 py-2 text-sm text-[var(--foreground)] transition-all hover:border-[var(--primary)]/50 hover:shadow-[0_0_16px_rgba(0,240,255,0.1)]"
        >
          <span className="hidden truncate max-w-[140px] sm:inline">{adminEmail}</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/20 text-[var(--primary)]">A</span>
        </button>
        {profileOpen && (
          <>
            <button
              type="button"
              aria-hidden
              className="fixed inset-0 z-40"
              onClick={() => setProfileOpen(false)}
            />
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-xl">
              <p className="truncate px-2 py-1 text-xs text-[var(--muted)]">{adminEmail}</p>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-[var(--foreground)] hover:bg-[var(--background)]/80"
              >
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
