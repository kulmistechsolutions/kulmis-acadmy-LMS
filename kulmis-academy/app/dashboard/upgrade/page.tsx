import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Page } from "@/components/ui/Page";
import { ProUpgradeForm } from "./ProUpgradeForm";

export const dynamic = "force-dynamic";

export default async function UpgradePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?callbackUrl=/dashboard/upgrade");

  if (user.isPro) {
    return (
      <Page title="Already Pro" subtitle="You have full access.">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-6">
          <p className="text-[var(--muted)]">Your account is already upgraded. Enjoy full access and certificates.</p>
          <Link href="/dashboard" className="mt-4 inline-block text-[var(--primary)] hover:underline">Back to Dashboard</Link>
        </div>
      </Page>
    );
  }

  const pending = prisma
    ? await prisma.studentRequest.findFirst({
        where: { userId: user.id, type: "PRO_ACCESS", status: "PENDING" },
      })
    : null;

  if (pending) {
    return (
      <Page title="Request Pending" subtitle="Your Pro upgrade request is under review.">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-6">
          <p className="text-[var(--muted)]">We have received your request. Please contact support to confirm your payment. You will be upgraded once approved.</p>
          <Link href="/dashboard" className="mt-4 inline-block text-[var(--primary)] hover:underline">Back to Dashboard</Link>
        </div>
      </Page>
    );
  }

  return (
    <Page title="Upgrade to Pro" subtitle="Request Pro access with payment proof.">
      <ProUpgradeForm userEmail={user.email} />
    </Page>
  );
}
