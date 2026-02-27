"use client";

import { LayoutGrid, Table2 } from "lucide-react";

export type CourseFilterState = {
  access: "all" | "free" | "pro";
  host: "all" | "vimeo" | "youtube" | "custom";
  sort: "created" | "watch" | "certificates" | "students";
};

const defaultFilters: CourseFilterState = {
  access: "all",
  host: "all",
  sort: "created",
};

export function CourseFilters({
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
}: {
  filters: CourseFilterState;
  onFiltersChange: (f: CourseFilterState) => void;
  viewMode: "grid" | "table";
  onViewModeChange: (m: "grid" | "table") => void;
}) {
  const set = (key: keyof CourseFilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 px-4 py-3 backdrop-blur-md">
      <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Filters</span>
      <select
        value={filters.access}
        onChange={(e) => set("access", e.target.value)}
        className="rounded-lg border border-[var(--border)] bg-[var(--background)]/80 px-3 py-1.5 text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none"
      >
        <option value="all">All access</option>
        <option value="free">Free</option>
        <option value="pro">Pro</option>
      </select>
      <select
        value={filters.host}
        onChange={(e) => set("host", e.target.value)}
        className="rounded-lg border border-[var(--border)] bg-[var(--background)]/80 px-3 py-1.5 text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none"
      >
        <option value="all">All hosts</option>
        <option value="vimeo">Vimeo</option>
        <option value="youtube">YouTube</option>
        <option value="custom">Self-hosted</option>
      </select>
      <select
        value={filters.sort}
        onChange={(e) => set("sort", e.target.value)}
        className="rounded-lg border border-[var(--border)] bg-[var(--background)]/80 px-3 py-1.5 text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none"
      >
        <option value="created">Date created</option>
        <option value="watch">Most watched</option>
        <option value="certificates">Most certificates</option>
        <option value="students">Most students</option>
      </select>
      <div className="ml-auto flex gap-1">
        <button
          type="button"
          onClick={() => onViewModeChange("grid")}
          className={`rounded-lg p-2 transition-all ${
            viewMode === "grid"
              ? "bg-[var(--primary)]/20 text-[var(--primary)]"
              : "text-[var(--muted)] hover:bg-[var(--background)]/60 hover:text-[var(--foreground)]"
          }`}
          aria-label="Grid view"
        >
          <LayoutGrid className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange("table")}
          className={`rounded-lg p-2 transition-all ${
            viewMode === "table"
              ? "bg-[var(--primary)]/20 text-[var(--primary)]"
              : "text-[var(--muted)] hover:bg-[var(--background)]/60 hover:text-[var(--foreground)]"
          }`}
          aria-label="Table view"
        >
          <Table2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export { defaultFilters };
