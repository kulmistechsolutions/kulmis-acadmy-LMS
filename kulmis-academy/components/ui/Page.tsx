import Link from "next/link";

type PageProps = {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
  /** Extra actions (e.g. link) next to title on desktop */
  action?: React.ReactNode;
};

const pageTitleClass = "text-xl font-bold text-[var(--foreground)] sm:text-2xl";
const pageSubtitleClass = "mt-2 text-[var(--muted)]";

export function Page({ title, subtitle, backHref, backLabel, children, action }: PageProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--primary)]"
        >
          ← {backLabel ?? "Back"}
        </Link>
      )}
      <div className={`flex flex-wrap items-start justify-between gap-4 ${backHref ? "mt-4" : ""}`}>
        <div>
          <h1 className={pageTitleClass}>{title}</h1>
          {subtitle != null && <p className={pageSubtitleClass}>{subtitle}</p>}
        </div>
        {action != null && <div className="shrink-0">{action}</div>}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

/** Shared glass card style - use for all content cards across app */
export const cardClass =
  "rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 shadow-[0_18px_45px_rgba(15,23,42,0.9)] backdrop-blur-xl transition-all duration-300 ease-out hover:border-[var(--primary)]/40 hover:shadow-[0_0_0_1px_rgba(0,240,255,0.2),0_20px_60px_rgba(15,23,42,0.12)]";

/** Lighter card for nested/smaller blocks */
export const cardClassLight =
  "rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur transition-all hover:border-[var(--primary)]/30";
