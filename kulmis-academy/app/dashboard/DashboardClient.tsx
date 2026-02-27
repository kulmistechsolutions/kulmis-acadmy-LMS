"use client";

import { useState } from "react";
import Link from "next/link";
import { cardClass } from "@/components/ui/Page";

type Request = {
  id: string;
  type: string;
  status: string;
  message: string | null;
  adminNote: string | null;
  createdAt: string;
  reviewedAt: string | null;
};

export function DashboardClient({
  isPro,
  requests: initialRequests,
}: {
  isPro: boolean;
  requests: Request[];
}) {
  const [requests] = useState(initialRequests);
  const hasPending = requests.some((r) => r.status === "PENDING");

  return (
    <div className="mt-8 space-y-8">
      {!isPro && !hasPending && (
        <div className={`p-4 sm:p-6 ${cardClass}`}>
          <h2 className="font-semibold text-[var(--foreground)]">Request Pro access</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Submit your details and payment proof. An admin will review and approve.
          </p>
          <Link
            href="/dashboard/upgrade"
            className="mt-4 inline-block rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-contrast)] transition-all duration-300 hover:opacity-90"
          >
            Upgrade to Pro
          </Link>
        </div>
      )}

      {isPro && (
        <div className="rounded-xl border border-[var(--primary)]/50 bg-[var(--surface)]/60 p-4 backdrop-blur">
          <span className="text-sm font-medium text-[var(--primary)]">Pro</span>
          <p className="mt-1 text-sm text-[var(--muted)]">You have full access to courses and resources.</p>
        </div>
      )}

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 p-4 backdrop-blur sm:p-6">
        <h2 className="font-semibold text-[var(--foreground)]">Your requests</h2>
        {requests.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--muted)]">No requests yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {requests.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)]/60 px-4 py-3"
              >
                <div>
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {r.type === "PRO_ACCESS" ? "Pro access" : r.type}
                  </span>
                  <span
                    className={`ml-2 rounded px-2 py-0.5 text-xs ${
                      r.status === "PENDING"
                        ? "bg-[var(--border)] text-[var(--muted)]"
                        : r.status === "APPROVED"
                          ? "bg-[var(--primary)]/20 text-[var(--primary)]"
                          : "bg-[var(--tertiary)]/20 text-[var(--tertiary)]"
                    }`}
                  >
                    {r.status}
                  </span>
                  {r.message && <p className="mt-1 text-xs text-[var(--muted)]">{r.message}</p>}
                  {r.adminNote && r.status !== "PENDING" && (
                    <p className="mt-1 text-xs text-[var(--muted)]">Admin: {r.adminNote}</p>
                  )}
                </div>
                <span className="text-xs text-[var(--muted)]">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
