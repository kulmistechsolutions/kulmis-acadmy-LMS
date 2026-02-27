"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Activity,
  BookOpen,
  Award,
  Settings2,
} from "lucide-react";

const navItems: { href: string; label: string; icon: ReactNode }[] = [
  { href: "/admin", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: "/admin/students", label: "Students", icon: <Users className="h-4 w-4" /> },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: <CreditCard className="h-4 w-4" /> },
  { href: "/admin/analytics", label: "Analytics", icon: <Activity className="h-4 w-4" /> },
  { href: "/admin/courses", label: "Courses", icon: <BookOpen className="h-4 w-4" /> },
  { href: "/admin/certificates", label: "Certificates", icon: <Award className="h-4 w-4" /> },
  { href: "/admin/settings", label: "Settings", icon: <Settings2 className="h-4 w-4" /> },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--primary)]/40 bg-[var(--background)]/80 text-[var(--foreground)] shadow-[0_0_0_1px_rgba(0,240,255,0.25),0_0_20px_rgba(0,240,255,0.4)] backdrop-blur-sm transition-all duration-300 ease-out hover:scale-105 lg:hidden"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay on mobile */}
      <button
        type="button"
        aria-hidden
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden ${open ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar panel */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-[var(--border)]/80 bg-[var(--surface)]/95 shadow-[0_0_40px_rgba(0,0,0,0.6)] transition-transform duration-300 ease-out lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center border-b border-[var(--border)]/80 px-4 lg:pl-6">
          <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-lg font-semibold text-transparent">
            Admin
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 lg:p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-out ${
                      isActive
                        ? "border border-[var(--primary)]/50 bg-gradient-to-r from-[var(--primary)]/15 to-[var(--secondary)]/10 text-[var(--primary)] shadow-[0_0_24px_rgba(0,240,255,0.35)]"
                        : "border border-transparent text-[var(--muted)] hover:border-[var(--border)] hover:bg-[var(--background)]/60 hover:text-[var(--foreground)] hover:shadow-[0_0_18px_rgba(15,23,42,0.9)]"
                    }`}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--background)]/70 text-[var(--primary)] shadow-[0_0_16px_rgba(0,240,255,0.28)]" aria-hidden>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-[var(--border)] p-3 lg:p-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--muted)] hover:bg-[var(--background)]/60 hover:text-[var(--foreground)]"
          >
            ← Dashboard
          </Link>
        </div>
      </aside>
    </>
  );
}
