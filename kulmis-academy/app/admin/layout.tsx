import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <AdminSidebar />
      <div className="flex min-h-screen flex-1 flex-col min-w-0 pl-0 pt-14 lg:pl-64 lg:pt-0">
        <AdminTopbar adminEmail={admin.email} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
