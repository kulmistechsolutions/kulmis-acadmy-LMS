import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const db = prisma;
  if (!db) {
    return (
      <div>
        <h1 className="text-xl font-bold text-[var(--foreground)]">Analytics</h1>
        <p className="mt-2 text-[var(--muted)]">Database not configured.</p>
      </div>
    );
  }

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setUTCHours(0, 0, 0, 0);
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - 7);
  const monthStart = new Date(now);
  monthStart.setMonth(monthStart.getMonth() - 1);

  const [todayCount, weekCount, monthCount, allSessions] = await Promise.all([
    db.visitorSession.count({ where: { createdAt: { gte: todayStart } } }),
    db.visitorSession.count({ where: { createdAt: { gte: weekStart } } }),
    db.visitorSession.count({ where: { createdAt: { gte: monthStart } } }),
    db.visitorSession.findMany({
      where: { durationSeconds: { not: null } },
      select: { durationSeconds: true },
    }),
  ]);

  const avgSessionSeconds =
    allSessions.length > 0
      ? allSessions.reduce((a, s) => a + (s.durationSeconds ?? 0), 0) / allSessions.length
      : 0;
  const avgSession = `${Math.round(avgSessionSeconds / 60)}m`;

  return (
    <div>
      <h1 className="text-xl font-bold text-[var(--foreground)] sm:text-2xl">Visitor Analytics</h1>
      <p className="mt-2 text-[var(--muted)]">
        Track visits and session metrics. Add tracking to your app to record VisitorSession rows.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 p-5 backdrop-blur">
          <p className="text-xs font-medium uppercase text-[var(--muted)]">Visitors today</p>
          <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{todayCount}</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 p-5 backdrop-blur">
          <p className="text-xs font-medium uppercase text-[var(--muted)]">This week</p>
          <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{weekCount}</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 p-5 backdrop-blur">
          <p className="text-xs font-medium uppercase text-[var(--muted)]">This month</p>
          <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{monthCount}</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 p-5 backdrop-blur">
          <p className="text-xs font-medium uppercase text-[var(--muted)]">Avg session</p>
          <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{avgSession}</p>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 p-6 backdrop-blur">
        <h3 className="font-semibold text-[var(--foreground)]">How to track visitors</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Create <code className="rounded bg-[var(--background)] px-1.5 py-0.5">VisitorSession</code> records
          via an API route when users land on key pages, or integrate Google Analytics and use this page for
          internal metrics only. Bounce rate can be added with a custom field when you have enough data.
        </p>
      </div>
    </div>
  );
}
