import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-4 pt-24 text-center">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl md:text-6xl">
          Master technology & AI with{" "}
          <span className="bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--tertiary)] bg-clip-text text-transparent">
            Kulmis Academy
          </span>
        </h1>
        <p className="mt-6 text-lg text-[var(--muted)] sm:text-xl">
          High-quality courses in web development, AI, machine learning, and software engineering. Learn at your pace, from anywhere.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-lg bg-[var(--primary)] px-6 py-3 text-base font-medium text-[var(--primary-contrast)] transition-all duration-300 hover:opacity-90"
          >
            Start Learning
          </Link>
          <Link
            href="#pricing"
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-base font-medium text-[var(--foreground)] transition-colors hover:border-[var(--primary)]"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
