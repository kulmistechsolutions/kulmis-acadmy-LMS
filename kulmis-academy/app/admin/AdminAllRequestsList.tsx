type RequestRow = {
  id: string;
  type: string;
  status: string;
  message: string | null;
  fullName: string | null;
  phone: string | null;
  paymentNumber: string | null;
  proofImageUrl: string | null;
  createdAt: string;
  reviewedAt: string | null;
  adminNote: string | null;
  user: { email: string };
};

export function AdminAllRequestsList({ requests }: { requests: RequestRow[] }) {
  if (requests.length === 0) {
    return <p className="text-[var(--muted)]">No Pro requests yet.</p>;
  }

  return (
    <div className="space-y-3">
      {requests.map((r) => (
        <div
          key={r.id}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 p-4 backdrop-blur"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium text-[var(--foreground)]">
                {r.type === "PRO_ACCESS" ? "Pro access" : r.type} — {r.fullName || r.user.email}
              </p>
              <p className="text-xs text-[var(--muted)]">{r.user.email}</p>
              {(r.phone || r.paymentNumber) && (
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {r.phone && <>Phone: {r.phone}</>}
                  {r.phone && r.paymentNumber && " · "}
                  {r.paymentNumber && <>Payment: {r.paymentNumber}</>}
                </p>
              )}
              {r.proofImageUrl && (
                <a href={r.proofImageUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs text-[var(--primary)] hover:underline">
                  View proof image
                </a>
              )}
              {r.message && (
                <p className="mt-1 text-sm text-[var(--muted)]">{r.message}</p>
              )}
              <p className="mt-1 text-xs text-[var(--muted)]">
                Requested {new Date(r.createdAt).toLocaleString()}
                {r.reviewedAt && (
                  <> · Reviewed {new Date(r.reviewedAt).toLocaleString()}</>
                )}
              </p>
              {r.adminNote && r.status !== "PENDING" && (
                <p className="mt-1 text-xs text-[var(--muted)]">Note: {r.adminNote}</p>
              )}
            </div>
            <span
              className={
                r.status === "PENDING"
                  ? "rounded bg-amber-500/20 px-2.5 py-1 text-xs font-medium text-amber-600 dark:text-amber-400"
                  : r.status === "APPROVED"
                    ? "rounded bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400"
                    : "rounded bg-red-500/20 px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400"
              }
            >
              {r.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
