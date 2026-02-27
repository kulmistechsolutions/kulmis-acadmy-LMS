import Link from "next/link";
import { prisma } from "@/lib/db";
import { CertificatesClient } from "@/components/admin/CertificatesClient";

export const dynamic = "force-dynamic";

export default async function AdminCertificatesPage() {
  const db = prisma;
  if (!db) {
    return (
      <div>
        <h1 className="text-xl font-bold text-[var(--foreground)] sm:text-2xl">Certificates</h1>
        <p className="mt-2 text-[var(--muted)]">Database not configured.</p>
      </div>
    );
  }

  const certificates = await db.certificate.findMany({
    orderBy: { createdAt: "desc" },
  });

  const courseTitles = [...new Set(certificates.map((c) => c.courseTitle))].sort();

  const rows = certificates.map((c) => ({
    id: c.id,
    certificateId: c.certificateId,
    fullName: c.fullName,
    courseTitle: c.courseTitle,
    completionDate: c.completionDate.toISOString(),
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[var(--foreground)] sm:text-2xl">Certificates</h1>
          <p className="mt-2 text-[var(--muted)]">Issued certificates, verify links, and filters by course.</p>
        </div>
        <Link
          href="/admin/certificates/templates"
          className="rounded-xl border border-[var(--primary)]/50 bg-[var(--primary)]/10 px-4 py-2 text-sm font-medium text-[var(--primary)] hover:bg-[var(--primary)]/20"
        >
          Template Designer
        </Link>
      </div>

      <section className="mt-6">
        <CertificatesClient certificates={rows} courseTitles={courseTitles} />
      </section>
    </div>
  );
}
