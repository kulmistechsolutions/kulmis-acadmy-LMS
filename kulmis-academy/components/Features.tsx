const features = [
  {
    title: "Web Development",
    description: "From fundamentals to full-stack. Build modern apps with the latest tools.",
  },
  {
    title: "AI & Machine Learning",
    description: "Hands-on courses in AI, ML, and data science for real-world impact.",
  },
  {
    title: "Vibe Coding",
    description: "Ship faster with AI-assisted development and best practices.",
  },
  {
    title: "Progress Tracking",
    description: "Resume where you left off. Track completion and earn certificates on Pro.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-t border-[var(--border)] py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-[var(--foreground)] sm:text-3xl lg:text-4xl">
          What you’ll learn
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-[var(--muted)]">
          Technology and AI courses designed for clarity and real-world use.
        </p>
        <div className="mt-8 grid gap-6 sm:mt-12 sm:grid-cols-2 sm:gap-8 lg:mt-16 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 p-6 backdrop-blur transition-all duration-300 hover:border-[var(--primary)]/50"
            >
              <h3 className="text-lg font-semibold text-[var(--foreground)]">{f.title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
