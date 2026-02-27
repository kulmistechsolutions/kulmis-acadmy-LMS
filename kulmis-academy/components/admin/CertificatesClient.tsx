"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Award, ExternalLink, FileCheck } from "lucide-react";

type CertRow = {
  id: string;
  certificateId: string;
  fullName: string;
  courseTitle: string;
  completionDate: string;
  createdAt: string;
};

export function CertificatesClient({
  certificates,
  courseTitles,
}: {
  certificates: CertRow[];
  courseTitles: string[];
}) {
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = certificates;
    if (courseFilter !== "all") {
      list = list.filter((c) => c.courseTitle === courseFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.fullName.toLowerCase().includes(q) ||
          c.courseTitle.toLowerCase().includes(q) ||
          c.certificateId.toLowerCase().includes(q)
      );
    }
    return list;
  }, [certificates, courseFilter, search]);

  const thisMonth = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    return certificates.filter((c) => c.createdAt >= start).length;
  }, [certificates]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.9)] backdrop-blur-xl transition-all duration-300 ease-out hover:border-[var(--primary)]/40 hover:shadow-[0_0_0_1px_rgba(0,240,255,0.2),0_20px_60px_rgba(15,23,42,1)]">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
              <Award className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Total issued</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">{certificates.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.9)] backdrop-blur-xl transition-all duration-300 ease-out hover:border-[var(--primary)]/40 hover:shadow-[0_0_0_1px_rgba(0,240,255,0.2),0_20px_60px_rgba(15,23,42,1)]">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--secondary)]/10 text-[var(--secondary)]">
              <FileCheck className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">This month</p>
              <p className="text-2xl font-bold text-[var(--foreground)]">{thisMonth}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 px-4 py-3 backdrop-blur-md">
        <input
          type="search"
          placeholder="Search by name, course, or ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[200px] flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)]/80 px-4 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none"
        />
        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="rounded-lg border border-[var(--border)] bg-[var(--background)]/80 px-4 py-2 text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none"
        >
          <option value="all">All courses</option>
          {courseTitles.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-12 text-center backdrop-blur-xl">
          <Award className="mx-auto h-12 w-12 text-[var(--muted)]" />
          <p className="mt-4 text-[var(--muted)]">
            {certificates.length === 0 ? "No certificates issued yet." : "No certificates match the filters."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 shadow-[0_18px_45px_rgba(15,23,42,0.9)] backdrop-blur-xl">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="sticky top-0 border-b border-[var(--border)] bg-[var(--surface)]/95">
              <tr>
                <th className="px-4 py-3 font-medium text-[var(--foreground)]">Student</th>
                <th className="px-4 py-3 font-medium text-[var(--foreground)]">Course</th>
                <th className="px-4 py-3 font-medium text-[var(--foreground)]">Completion date</th>
                <th className="px-4 py-3 font-medium text-[var(--foreground)]">Certificate ID</th>
                <th className="px-4 py-3 font-medium text-[var(--foreground)]"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-[var(--border)]/50 transition-colors last:border-0 hover:bg-[var(--background)]/40"
                >
                  <td className="px-4 py-3 font-medium text-[var(--foreground)]">{c.fullName}</td>
                  <td className="px-4 py-3 text-[var(--muted)]">{c.courseTitle}</td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {new Date(c.completionDate).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--muted)]">{c.certificateId}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/verify/${c.certificateId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--primary)]/50 bg-[var(--primary)]/10 px-3 py-1.5 text-sm font-medium text-[var(--primary)] transition-all hover:bg-[var(--primary)]/20 hover:shadow-[0_0_16px_rgba(0,240,255,0.2)]"
                    >
                      Verify <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
