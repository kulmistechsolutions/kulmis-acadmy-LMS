"use client";

type ProgressBarProps = {
  percent: number;
  completed: number;
  total: number;
  className?: string;
};

export function ProgressBar({ percent, completed, total, className = "" }: ProgressBarProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--muted)]">Course Progress</span>
        <span className="font-medium text-[var(--primary)]">{Math.round(percent)}%</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-[var(--muted)]">
        {completed} / {total} lessons completed
      </p>
    </div>
  );
}
