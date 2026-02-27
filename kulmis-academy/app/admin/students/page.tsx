import { prisma } from "@/lib/db";
import { StudentTable } from "@/components/admin/StudentTable";

export const dynamic = "force-dynamic";

export default async function AdminStudentsPage() {
  const db = prisma;
  if (!db) {
    return (
      <div>
        <h1 className="text-xl font-bold text-[var(--foreground)]">Students</h1>
        <p className="mt-2 text-[var(--muted)]">Database not configured.</p>
      </div>
    );
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      phone: true,
      role: true,
      isPro: true,
      createdAt: true,
      _count: { select: { requests: true } },
    },
  });

  const serialized = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="text-xl font-bold text-[var(--foreground)] sm:text-2xl">Students</h1>
      <p className="mt-2 text-[var(--muted)]">View and filter all registered users.</p>
      <section className="mt-6">
        <StudentTable users={serialized} />
      </section>
    </div>
  );
}
