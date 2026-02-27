"use client";

import Link from "next/link";
import Image from "next/image";
import type { EnrichedCourse } from "./types";

export function CourseTable({ courses }: { courses: EnrichedCourse[] }) {
  if (courses.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 p-8 text-center backdrop-blur">
        <p className="text-[var(--muted)]">No courses match the filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-xl">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="sticky top-0 border-b border-[var(--border)] bg-[var(--surface)]/95">
          <tr>
            <th className="px-4 py-3 font-medium text-[var(--foreground)]">Thumbnail</th>
            <th className="px-4 py-3 font-medium text-[var(--foreground)]">Title</th>
            <th className="px-4 py-3 font-medium text-[var(--foreground)]">Access</th>
            <th className="px-4 py-3 font-medium text-[var(--foreground)]">Host</th>
            <th className="px-4 py-3 font-medium text-[var(--foreground)]">Lessons</th>
            <th className="px-4 py-3 font-medium text-[var(--foreground)]">Duration</th>
            <th className="px-4 py-3 font-medium text-[var(--foreground)]">Watch hours</th>
            <th className="px-4 py-3 font-medium text-[var(--foreground)]">Completion</th>
            <th className="px-4 py-3 font-medium text-[var(--foreground)]">Certificates</th>
            <th className="px-4 py-3 font-medium text-[var(--foreground)]">Students</th>
            <th className="px-4 py-3 font-medium text-[var(--foreground)]">Created</th>
            <th className="px-4 py-3 font-medium text-[var(--foreground)]"></th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr
              key={c.courseId}
              className="border-b border-[var(--border)]/50 transition-colors last:border-0 hover:bg-[var(--background)]/40"
            >
              <td className="px-4 py-2">
                <div className="relative h-12 w-20 overflow-hidden rounded-lg bg-[var(--border)]">
                  {c.thumbnailUrl ? (
                    <Image src={c.thumbnailUrl} alt="" fill className="object-cover" sizes="80px" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-lg">🎬</span>
                  )}
                </div>
              </td>
              <td className="max-w-[200px] truncate font-medium text-[var(--foreground)]">{c.title}</td>
              <td className="px-4 py-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    c.accessType === "pro" ? "bg-[var(--primary)]/20 text-[var(--primary)]" : "bg-emerald-500/20 text-emerald-400"
                  }`}
                >
                  {c.accessType === "pro" ? "Pro" : "Free"}
                </span>
              </td>
              <td className="px-4 py-2 text-[var(--muted)]">{c.host}</td>
              <td className="px-4 py-2 tabular-nums text-[var(--foreground)]">{c.totalLessons}</td>
              <td className="px-4 py-2 text-[var(--muted)]">{c.totalDuration ?? "—"}</td>
              <td className="px-4 py-2 tabular-nums text-[var(--foreground)]">{c.totalWatchHours}h</td>
              <td className="px-4 py-2 tabular-nums text-[var(--primary)]">{c.completionRate}%</td>
              <td className="px-4 py-2 tabular-nums text-[var(--foreground)]">{c.certificatesIssued}</td>
              <td className="px-4 py-2 tabular-nums text-[var(--foreground)]">{c.studentsEnrolled}</td>
              <td className="px-4 py-2 text-[var(--muted)]">{c.createdDate ?? "—"}</td>
              <td className="px-4 py-2">
                <Link
                  href={`/admin/courses/${c.courseId}`}
                  className="text-sm font-medium text-[var(--primary)] hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
