import Link from "next/link";

const plans = [
  {
    name: "Free",
    description: "Get started with selected courses and basic dashboard access.",
    features: ["Limited course access", "Basic dashboard", "Community support"],
    cta: "Get started",
    href: "/dashboard",
    primary: false,
  },
  {
    name: "Pro",
    description: "Full access, certificates, and premium resources.",
    features: ["Full course access", "Downloadable resources", "Certificates", "Priority updates"],
    cta: "Upgrade to Pro",
    href: "/dashboard/upgrade",
    primary: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-[var(--border)] py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-[var(--foreground)] sm:text-3xl lg:text-4xl">
          Free vs Pro
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-[var(--muted)]">
          Start free. Upgrade when you’re ready for full access and certificates.
        </p>
        <div className="mt-8 grid gap-6 sm:mt-12 lg:mt-16 lg:max-w-4xl lg:mx-auto lg:grid-cols-2 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border bg-[var(--surface)]/60 p-6 backdrop-blur sm:p-8 ${
                plan.primary
                  ? "border-[var(--primary)] shadow-[0_0_30px_rgba(0,240,255,0.15)]"
                  : "border-[var(--border)]"
              }`}
            >
              <h3 className="text-xl font-semibold text-[var(--foreground)]">{plan.name}</h3>
              <p className="mt-2 text-[var(--muted)]">{plan.description}</p>
              <ul className="mt-6 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-[var(--foreground)]">
                    • {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`mt-8 block w-full rounded-lg py-3 text-center font-medium transition-all duration-300 ${
                  plan.primary
                    ? "bg-[var(--primary)] text-[var(--primary-contrast)] hover:opacity-90"
                    : "border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--primary)]"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
