import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Page } from "@/components/ui/Page";
import { Award, Download, CheckCircle2 } from "lucide-react";
import { ShareCertificateButton } from "./ShareCertificateButton";

export const dynamic = "force-dynamic";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || "http://localhost:3000";
const origin = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;

export default async function DashboardCertificatesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const db = prisma;
  if (!db) {
    return (
      <Page title="My Certificates" subtitle="View and download your certificates.">
        <p className="text-[var(--muted)]">Database not configured.</p>
      </Page>
    );
  }

  const certificates = await db.certificate.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Page
      title="My Certificates"
      subtitle="View, download, and share your course completion certificates."
    >
      {certificates.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-12 text-center shadow-[0_18px_45px_rgba(15,23,42,0.9)] backdrop-blur-xl">
          <Award className="mx-auto h-12 w-12 text-[var(--muted)]" />
          <p className="mt-4 text-[var(--muted)]">You don&apos;t have any certificates yet.</p>
          <p className="mt-1 text-sm text-[var(--muted)]">Complete a course 100% to earn one.</p>
          <Link
            href="/dashboard/courses"
            className="mt-6 inline-block rounded-xl bg-[var(--primary)]/20 px-4 py-2 text-sm font-medium text-[var(--primary)] hover:bg-[var(--primary)]/30"
          >
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {certificates.map((cert) => {
            const issuedDate = new Date(cert.completionDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            const verifyUrl = `${origin}/verify/${cert.certificateId}`;
            return (
              <div
                key={cert.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.9)] backdrop-blur-xl transition-all hover:border-[var(--primary)]/40"
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                        <Award className="h-6 w-6" />
                      </span>
                      <div>
                        <h2 className="text-lg font-bold text-[var(--foreground)]">Certificate of Completion</h2>
                        <p className="text-[var(--primary)]">{cert.courseTitle}</p>
                        <p className="text-xs text-[var(--muted)]">course completion</p>
                      </div>
                    </div>
                    <div className="mt-6 rounded-xl border border-[var(--cert-border)]/50 bg-[var(--cert-bg)]/80 p-4">
                      <p className="text-2xl font-semibold text-[var(--primary)]">{cert.fullName}</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">Completed on {issuedDate}</p>
                    </div>
                    <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm text-[var(--muted)]">Student: <strong className="text-[var(--foreground)]">{cert.fullName}</strong></span>
                      </div>
                      <div className="text-sm text-[var(--muted)]">Issue date: <strong className="text-[var(--foreground)]">{issuedDate}</strong></div>
                      <div className="text-sm text-[var(--muted)]">Verification: <Link href={verifyUrl} className="text-[var(--primary)] hover:underline" target="_blank" rel="noopener noreferrer">{verifyUrl}</Link></div>
                    </dl>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                    <a
                      href={`/api/certificate/download?certificateId=${encodeURIComponent(cert.certificateId)}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-medium text-[var(--primary-contrast)] shadow-[var(--shadow-lg)] hover:opacity-90 sm:w-auto"
                    >
                      <Download className="h-4 w-4" /> Download PDF
                    </a>
                    <ShareCertificateButton verifyUrl={verifyUrl} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Page>
  );
}
