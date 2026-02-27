type UserRow = {
  id: string;
  email: string;
  phone: string | null;
  role: string;
  isPro: boolean;
  createdAt: string;
  _count: { requests: number };
};

export function AdminUsersTable({ users }: { users: UserRow[] }) {
  if (users.length === 0) {
    return (
      <p className="text-[var(--muted)]">No users yet.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur">
      <table className="w-full min-w-[400px] text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--surface)]/80">
            <th className="px-4 py-3 font-medium text-[var(--foreground)]">Email</th>
            <th className="px-4 py-3 font-medium text-[var(--foreground)]">Mobile</th>
            <th className="px-4 py-3 font-medium text-[var(--foreground)]">Role</th>
            <th className="px-4 py-3 font-medium text-[var(--foreground)]">Pro</th>
            <th className="px-4 py-3 font-medium text-[var(--foreground)]">Requests</th>
            <th className="px-4 py-3 font-medium text-[var(--foreground)]">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-[var(--border)]/50 last:border-0">
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
                  <span className="rounded bg-[var(--primary)]/20 px-2 py-0.5 text-xs font-medium text-[var(--primary)]">
                    Yes
                  </span>
                ) : (
                  <span className="text-[var(--muted)]">No</span>
                )}
              </td>
              <td className="px-4 py-3 text-[var(--muted)]">{u._count.requests}</td>
              <td className="px-4 py-3 text-[var(--muted)]">
                {new Date(u.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
