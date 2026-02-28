"use client";

import { useState } from "react";
import { Page } from "@/components/ui/Page";

export default function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    if (newPassword.length < 8) {
      setMessage("New password must be at least 8 characters.");
      setStatus("error");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      setStatus("error");
      return;
    }
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Failed to update password.");
        return;
      }
      setStatus("success");
      setMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <Page title="Security" description="Change your password">
      <div className="mx-auto max-w-md">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Change password</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Use a strong password with at least 8 characters.
        </p>
        {status === "success" && (
          <p className="mt-3 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/5 px-3 py-2 text-sm text-[var(--foreground)]">
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-[var(--foreground)]"
            >
              Current password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-[var(--foreground)]"
            >
              New password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none"
              placeholder="At least 8 characters"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-[var(--foreground)]"
            >
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
          {status === "error" && message && (
            <p className="text-sm text-[var(--tertiary)]">{message}</p>
          )}
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-[var(--primary-contrast)] hover:opacity-90 disabled:opacity-50"
          >
            {status === "loading" ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </Page>
  );
}
