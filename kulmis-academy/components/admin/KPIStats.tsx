"use client";

import { useEffect, useState, type ReactNode } from "react";

type KPICard = {
  title: string;
  value: string | number;
  trend?: string;
  icon: ReactNode;
};

export function KPIStats({ cards }: { cards: KPICard[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map((card) => (
        <KPICard key={card.title} {...card} />
      ))}
    </div>
  );
}

function KPICard({ title, value, trend, icon }: KPICard) {
  const [displayValue, setDisplayValue] = useState(typeof value === "number" ? 0 : value);

  useEffect(() => {
    if (typeof value !== "number") {
      setDisplayValue(value);
      return;
    }
    let start = 0;
    const end = value;
    const duration = 400;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayValue(Math.round(start + (end - start) * progress));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);

  return (
    <div className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.9)] backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[var(--primary)]/50 hover:shadow-[0_0_0_1px_rgba(0,240,255,0.25),0_22px_60px_rgba(15,23,42,1)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">{title}</p>
          <p className="mt-1 text-2xl font-bold text-[var(--foreground)] tabular-nums">{displayValue}</p>
          {trend && (
            <p className="mt-1 text-xs font-medium text-emerald-400">{trend}</p>
          )}
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-2xl transition-transform group-hover:scale-105" aria-hidden>
          {icon}
        </span>
      </div>
    </div>
  );
}
