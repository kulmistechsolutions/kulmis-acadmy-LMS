"use client";

import { useState, useMemo } from "react";

type UserRow = {
  id: string;
  email: string;
  phone: string | null;
  role: string;
  isPro: boolean;
  createdAt: string;
  _count: { requests: number };
};

const PAGE_SIZE = 10;

export function StudentTable({ users }: { users: UserRow[] }) {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<"all" | "free" | "pro">("all");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let list = users;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (u) =>
          u.email.toLowerCase().includes(q) ||
          (u.phone && u.phone.toLowerCase().includes(q))
      );
    }
    if (planFilter === "pro") list = list.filter((u) => u.isPro);
    if (planFilter === "free") list = list.filter((u) => !u.isPro);
    return list;
  }, [users, search, planFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  if (users.length === 0) {
    return <p className="text-[var(--muted)]">No users yet.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search by email or mobile…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          className="rounded-xl border border-[var(--border)] bg-[var(--background)]/60 px-4 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none min-w-[200px]"
        />
        <select
          value={planFilter}
          onChange={(e) => {
            setPlanFilter(e.target.value as "all" | "free" | "pro");
            setPage(0);
          }}
          className="rounded-xl border border-[var(--border)] bg-[var(--background)]/60 px-4 py-2 text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none"
        >
          <option value="all">All plans</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur">
        <table className="w-full min-w-[500px] text-left text-sm">
          <thead className="sticky top-0 border-b border-[var(--border)] bg-[var(--surface)]/95">
            <tr>
              <th className="px-4 py-3 font-medium text-[var(--foreground)]">Email</th>
              <th className="px-4 py-3 font-medium text-[var(--foreground)]">Mobile</th>
              <th className="px-4 py-3 font-medium text-[var(--foreground)]">Role</th>
              <th className="px-4 py-3 font-medium text-[var(--foreground)]">Plan</th>
              <th className="px-4 py-3 font-medium text-[var(--foreground)]">Requests</th>
              <th className="px-4 py-3 font-medium text-[var(--foreground)]">Joined</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((u) => (
              <tr
                key={u.id}
                className="border-b border-[var(--border)]/50 transition-colors last:border-0 hover:bg-[var(--background)]/40"
              >
                <td className="px-4 py-3 text-[var(--foreground)]">{u.email}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{u.phone ?? "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      u.role === "admin"
                        ? "rounded bg-[var(--primary)]/20 px-2 py-0.5 text-xs font-medium text-[var(--primary)]"
                        : "text-[var(--muted)]"
                    }
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {u.isPro ? (
                    <span className="rounded bg-[var(--primary)]/20 px-2 py-0.5 text-xs font-medium text-[var(--primary)]">Pro</span>
                  ) : (
                    <span className="text-[var(--muted)]">Free</span>
                  )}
                </td>
                <td className="px-4 py-3 text-[var(--muted)]">{u._count.requests}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-[var(--muted)]">
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] disabled:opacity-50 hover:bg-[var(--surface)]/80"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] disabled:opacity-50 hover:bg-[var(--surface)]/80"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
