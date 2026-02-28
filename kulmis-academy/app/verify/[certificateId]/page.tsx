import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export const dynamic = "force-dynamic";

function AwardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M15.5 9.5 12 3l-3.5 6.5-7 1 5 4.5L4 21l6-3.5 2 6 2-6L20 21l-2.5-6 5-4.5z" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" />
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
    </svg>
  );
}
function FileIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><path d="M14 2v6h6" />
    </svg>
  );
}

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}) {
  const { certificateId } = await params;
  const cert = prisma
    ? await prisma.certificate.findUnique({ where: { certificateId } })
    : null;
  if (!cert) notFound();

  const issuedDate = new Date(cert.completionDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof process.env.VERCEL_URL === "string" && process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
  const origin = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;
  const verifyUrl = `${origin}/verify/${cert.certificateId}`;
  const canonicalDomain = process.env.NEXT_PUBLIC_APP_URL
    ? (process.env.NEXT_PUBLIC_APP_URL.startsWith("http")
        ? process.env.NEXT_PUBLIC_APP_URL
        : `https://${process.env.NEXT_PUBLIC_APP_URL}`)
    : null;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold text-[var(--foreground)]" aria-label="Kulmis Academy – Home">
            Kulmis Academy
          </Link>
          <nav className="flex items-center gap-4">
            <ThemeSwitcher />
            <Link href="/#courses" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Courses</Link>
            <Link href="/#pricing" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Pricing</Link>
            <Link href="/sign-in" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">Sign In</Link>
            <Link
              href="/sign-up"
              className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-contrast)] shadow-[var(--shadow)] hover:opacity-90"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <h1 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">Certificate Verification</h1>
        <p className="mt-2 text-[var(--muted)]">
          Verify the authenticity of this credential issued by Kulmis Academy. This document confirms the student&apos;s successful completion of the course.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.9)] backdrop-blur-xl">
            <div className="rounded-xl border-2 border-[var(--cert-border)]/60 bg-[var(--cert-bg)] p-6 text-center">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)]/20 text-[var(--primary)]">
                <AwardIcon />
              </div>
              <h2 className="mt-4 text-lg font-bold text-[var(--foreground)]">Certificate of Completion</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{cert.courseTitle}</p>
              <p className="mt-4 text-2xl font-semibold text-[var(--primary)]">{cert.fullName}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Completed on {issuedDate}</p>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-[var(--muted)]">
              <FileIcon />
              <span>certificate_{cert.certificateId.slice(0, 8)}.pdf</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.9)] backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckIcon />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Credential Status</p>
                  <p className="text-xl font-bold text-emerald-400">Verified Authentic</p>
                </div>
              </div>
              <dl className="mt-6 space-y-4">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Issued To</dt>
                  <dd className="mt-1 font-medium text-[var(--foreground)]">{cert.fullName}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Course Name</dt>
                  <dd className="mt-1 text-[var(--foreground)]">{cert.courseTitle}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Issued Date</dt>
                  <dd className="mt-1 text-[var(--foreground)]">{issuedDate}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Verification Link</dt>
                  <dd className="mt-1 break-all font-mono text-sm text-[var(--primary)]">
                    {canonicalDomain ? `${canonicalDomain}/verify/${cert.certificateId}` : verifyUrl}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 p-4">
              <span className="shrink-0 text-[var(--primary)]"><InfoIcon /></span>
              <div className="text-sm text-[var(--foreground)]">
                <p>This certificate verifies that the student has completed the full curriculum for this course at Kulmis Academy.</p>
                <Link href="/#courses" className="mt-2 inline-block font-medium text-[var(--primary)] hover:underline">
                  View course curriculum →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/"
            className="rounded-xl border border-[var(--primary)]/50 bg-[var(--primary)]/10 px-6 py-3 text-sm font-medium text-[var(--primary)] transition-all hover:bg-[var(--primary)]/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]"
          >
            ← Back to Kulmis Academy
          </Link>
        </div>
      </main>

      <footer className="mt-16 border-t border-[var(--border)] py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-[var(--muted)]">
            <Link href="/" className="hover:text-[var(--primary)]">Privacy Policy</Link>
            <Link href="/" className="hover:text-[var(--primary)]">Terms of Service</Link>
            <Link href="/" className="hover:text-[var(--primary)]">Help Center</Link>
          </div>
          <p className="mt-4 text-center text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} Kulmis Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
