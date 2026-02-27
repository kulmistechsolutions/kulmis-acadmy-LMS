export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-[var(--foreground)] sm:text-2xl">Settings</h1>
      <p className="mt-2 text-[var(--muted)]">Admin and platform settings.</p>

      <div className="mt-8 space-y-6 rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 p-6 backdrop-blur">
        <section>
          <h3 className="font-semibold text-[var(--foreground)]">Admin access</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Admin role is set via <code className="rounded bg-[var(--background)] px-1.5 py-0.5">NEXTAUTH_ADMIN_EMAILS</code> at
            sign-up, or by updating the user&apos;s <code className="rounded bg-[var(--background)] px-1.5 py-0.5">role</code> in the database.
          </p>
        </section>
        <section>
          <h3 className="font-semibold text-[var(--foreground)]">Pro subscriptions</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Pro access is granted when an admin approves a student request from the Subscriptions page. No Stripe integration by default.
          </p>
        </section>
      </div>
    </div>
  );
}
