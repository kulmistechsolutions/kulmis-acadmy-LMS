import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <DashboardSidebar isAdmin={user.role === "admin"} />
      <main className="min-h-screen pl-0 md:pl-64">
        {children}
      </main>
    </div>
  );
}
