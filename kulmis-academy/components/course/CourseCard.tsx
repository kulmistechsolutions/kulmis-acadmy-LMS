import Link from "next/link";
import Image from "next/image";

type CourseCardProps = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  accessType?: string | null;
  /** Show "View course" CTA (dashboard); omit for landing */
  showCta?: boolean;
};

export function CourseCard({
  id,
  slug,
  title,
  description,
  thumbnailUrl,
  accessType = "free",
  showCta = false,
}: CourseCardProps) {
  const href = `/courses/${slug || id}`;

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 shadow-lg transition-all duration-300 hover:border-[var(--primary)]/40 hover:shadow-[0_0_32px_rgba(0,240,255,0.12)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:ring-offset-2 focus:ring-offset-[var(--background)]"
    >
      {/* Thumbnail - 16:9 like pro course platforms */}
      <div className="relative aspect-video w-full bg-[var(--border)]/50">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--muted)]">
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
        {/* Badge overlay */}
        <span className="absolute left-3 top-3 rounded-md bg-[var(--background)]/90 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-[var(--primary)] backdrop-blur-sm">
          {accessType}
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-[var(--foreground)] sm:text-lg">
          {title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--muted)]">
          {description ?? "—"}
        </p>
        {showCta && (
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)]">
            View course
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        )}
      </div>
    </Link>
  );
}
