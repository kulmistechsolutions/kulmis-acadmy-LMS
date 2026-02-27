"use client";

import { ProgressBar } from "./ProgressBar";

type UserStatsCardProps = {
  completed: number;
  total: number;
  className?: string;
};

export function UserStatsCard({ completed, total, className = "" }: UserStatsCardProps) {
  const percent = total > 0 ? (completed / total) * 100 : 0;
  return (
    <div
      className={`rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 p-4 backdrop-blur ${className}`}
    >
      <ProgressBar percent={percent} completed={completed} total={total} />
      {percent >= 100 && (
        <p className="mt-3 text-center text-sm font-medium text-[var(--primary)]">
          🏆 Course complete! Certificate unlocked.
        </p>
      )}
    </div>
  );
}
