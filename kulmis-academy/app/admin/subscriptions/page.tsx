import { prisma } from "@/lib/db";
import { AdminRequestsClient } from "../AdminRequestsClient";
import { AdminAllRequestsList } from "../AdminAllRequestsList";

export const dynamic = "force-dynamic";

export default async function AdminSubscriptionsPage() {
  const db = prisma;
  if (!db) {
    return (
      <div>
        <h1 className="text-xl font-bold text-[var(--foreground)]">Subscriptions</h1>
        <p className="mt-2 text-[var(--muted)]">Database not configured.</p>
      </div>
    );
  }

  const [pending, allRequests, proCount] = await Promise.all([
    db.studentRequest.findMany({
      where: { status: "PENDING" },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    }),
    db.studentRequest.findMany({
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: "desc" },
    }),
    db.user.count({ where: { isPro: true } }),
  ]);

  const serializedPending = pending.map((r) => ({
    ...r,
    fullName: r.fullName ?? null,
    phone: r.phone ?? null,
    paymentNumber: r.paymentNumber ?? null,
    proofImageUrl: r.proofImageUrl ?? null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    reviewedAt: r.reviewedAt?.toISOString() ?? null,
    user: {
      ...r.user,
      createdAt: r.user.createdAt.toISOString(),
      updatedAt: r.user.updatedAt.toISOString(),
    },
  }));

  const serializedRequests = allRequests.map((r) => ({
    id: r.id,
    type: r.type,
    status: r.status,
    message: r.message,
    fullName: r.fullName ?? null,
    phone: r.phone ?? null,
    paymentNumber: r.paymentNumber ?? null,
    proofImageUrl: r.proofImageUrl ?? null,
    createdAt: r.createdAt.toISOString(),
    reviewedAt: r.reviewedAt?.toISOString() ?? null,
    adminNote: r.adminNote,
    user: { email: r.user.email },
  }));

  const approvedCount = allRequests.filter((r) => r.status === "APPROVED").length;
  const rejectedCount = allRequests.filter((r) => r.status === "REJECTED").length;

  return (
    <div>
      <h1 className="text-xl font-bold text-[var(--foreground)] sm:text-2xl">Subscriptions</h1>
      <p className="mt-2 text-[var(--muted)]">Manage Pro access requests and view subscription status.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 p-4 backdrop-blur">
          <p className="text-xs font-medium uppercase text-[var(--muted)]">Pending</p>
          <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{pending.length}</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 p-4 backdrop-blur">
          <p className="text-xs font-medium uppercase text-[var(--muted)]">Approved</p>
          <p className="mt-1 text-2xl font-bold text-emerald-400">{approvedCount}</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 p-4 backdrop-blur">
          <p className="text-xs font-medium uppercase text-[var(--muted)]">Active Pro users</p>
          <p className="mt-1 text-2xl font-bold text-[var(--primary)]">{proCount}</p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-[var(--foreground)]">Pending requests</h2>
        <AdminRequestsClient initialRequests={serializedPending} />
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold text-[var(--foreground)]">All requests</h2>
        <AdminAllRequestsList requests={serializedRequests} />
      </section>
    </div>
  );
}
