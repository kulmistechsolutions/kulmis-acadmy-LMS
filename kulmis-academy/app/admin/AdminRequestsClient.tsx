"use client";

import { useState } from "react";

type RequestWithUser = {
  id: string;
  userId: string;
  type: string;
  status: string;
  message: string | null;
  fullName: string | null;
  phone: string | null;
  paymentNumber: string | null;
  proofImageUrl: string | null;
  createdAt: string;
  user: { id: string; email: string; role: string };
};

export function AdminRequestsClient({
  initialRequests,
}: {
  initialRequests: RequestWithUser[];
}) {
  const [requests, setRequests] = useState(initialRequests);
  const [adminNote, setAdminNote] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string | null>(null);

  async function handleAction(requestId: string, action: "approve" | "reject") {
    setLoading(requestId);
    try {
      const res = await fetch(`/api/admin/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          adminNote: adminNote[requestId] || null,
        }),
      });
      if (!res.ok) return;
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      setAdminNote((prev) => {
        const next = { ...prev };
        delete next[requestId];
        return next;
      });
    } finally {
      setLoading(null);
    }
  }

  if (requests.length === 0) {
    return (
      <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 p-4 backdrop-blur sm:mt-8 sm:p-6">
        <p className="text-[var(--muted)]">No pending requests.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 shadow-[var(--shadow)] backdrop-blur">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="px-4 py-3 font-medium text-[var(--muted)]">User / Name</th>
            <th className="px-4 py-3 font-medium text-[var(--muted)]">Phone</th>
            <th className="px-4 py-3 font-medium text-[var(--muted)]">Payment #</th>
            <th className="px-4 py-3 font-medium text-[var(--muted)]">Proof</th>
            <th className="px-4 py-3 font-medium text-[var(--muted)]">Date</th>
            <th className="px-4 py-3 font-medium text-[var(--muted)]">Status</th>
            <th className="px-4 py-3 font-medium text-[var(--muted)]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id} className="border-b border-[var(--border)]/80 transition-colors hover:bg-[var(--background)]/30">
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-[var(--foreground)]">
                    {r.fullName || r.user.email}
                  </p>
                  <p className="text-xs text-[var(--muted)]">{r.user.email}</p>
                </div>
              </td>
              <td className="px-4 py-3 text-[var(--foreground)]">{r.phone ?? "—"}</td>
              <td className="px-4 py-3 font-mono text-[var(--foreground)]">{r.paymentNumber ?? "—"}</td>
              <td className="px-4 py-3">
                {r.proofImageUrl ? (
                  <a
                    href={r.proofImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-12 w-12 overflow-hidden rounded-lg border border-[var(--border)] transition-opacity hover:opacity-90"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.proofImageUrl}
                      alt="Proof"
                      className="h-full w-full object-cover"
                    />
                  </a>
                ) : (
                  <span className="text-[var(--muted)]">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-[var(--muted)]">
                {new Date(r.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <span className="rounded bg-amber-500/20 px-2 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                  Pending
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    placeholder="Note"
                    value={adminNote[r.id] ?? ""}
                    onChange={(e) =>
                      setAdminNote((prev) => ({ ...prev, [r.id]: e.target.value }))
                    }
                    className="max-w-24 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-xs text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none"
                  />
                  <button
                    onClick={() => handleAction(r.id, "approve")}
                    disabled={loading === r.id}
                    className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-[var(--primary-contrast)] transition-all hover:opacity-90 disabled:opacity-50"
                  >
                    {loading === r.id ? "…" : "Approve"}
                  </button>
                  <button
                    onClick={() => handleAction(r.id, "reject")}
                    disabled={loading === r.id}
                    className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] hover:border-[var(--tertiary)] disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Mobile card fallback: show cards on small screens if needed */}
      <div className="border-t border-[var(--border)] p-4 sm:hidden">
        <p className="text-xs text-[var(--muted)]">Scroll table horizontally for full view, or use desktop.</p>
      </div>
    </div>
  );
}
