"use client";

import Link from "next/link";

export function UpgradeOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-[var(--background)]/90 backdrop-blur-md">
      <div className="mx-4 max-w-sm rounded-2xl border border-[var(--primary)]/50 bg-[var(--surface)]/80 p-8 text-center shadow-[0_0_40px_rgba(0,240,255,0.15)]">
        <span className="text-4xl">🔒</span>
        <h3 className="mt-4 text-xl font-semibold text-[var(--foreground)]">Pro lesson</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Upgrade to Pro to unlock this lesson and the full course.
        </p>
        <Link
          href="/dashboard/upgrade"
          className="mt-6 inline-block rounded-lg bg-[var(--primary)] px-6 py-3 font-medium text-[var(--primary-contrast)] transition-all duration-300 hover:opacity-90"
        >
          Upgrade to Pro
        </Link>
      </div>
    </div>
  );
}
