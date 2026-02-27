import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardClient } from "./DashboardClient";
import { Page } from "@/components/ui/Page";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const requests = prisma
    ? await prisma.studentRequest.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const serialized = requests.map((r) => ({
    id: r.id,
    type: r.type,
    status: r.status,
    message: r.message,
    adminNote: r.adminNote,
    createdAt: r.createdAt.toISOString(),
    reviewedAt: r.reviewedAt?.toISOString() ?? null,
  }));

  return (
    <Page
      title="Dashboard"
      subtitle={user.isPro ? "You have Pro access." : "Free plan. Request Pro access for full courses and resources."}
      action={
        <Link
          href="/dashboard/courses"
          className="rounded-xl border border-[var(--primary)]/50 bg-[var(--primary)]/10 px-4 py-2 text-sm font-medium text-[var(--primary)] transition-all hover:bg-[var(--primary)]/20 hover:shadow-[0_0_16px_rgba(0,240,255,0.2)]"
        >
          Browse courses →
        </Link>
      }
    >
      <DashboardClient
        isPro={user.isPro}
        requests={serialized}
      />
    </Page>
  );
}
