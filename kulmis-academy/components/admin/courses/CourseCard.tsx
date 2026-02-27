"use client";

import Link from "next/link";
import Image from "next/image";
import type { EnrichedCourse } from "./types";

export function CourseCard({ course }: { course: EnrichedCourse }) {
  return (
    <Link
      href={`/admin/courses/${course.courseId}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 shadow-[0_18px_45px_rgba(15,23,42,0.9)] backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--primary)]/50 hover:shadow-[0_0_0_1px_rgba(0,240,255,0.25),0_24px_60px_rgba(15,23,42,1)]"
    >
      <div className="relative aspect-video w-full bg-[var(--border)]">
        {course.thumbnailUrl ? (
          <Image
            src={course.thumbnailUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 400px) 100vw, 320px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--muted)]">
            <span className="text-4xl">🎬</span>
          </div>
        )}
        <div className="absolute left-2 top-2 flex gap-1.5">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              course.accessType === "pro"
                ? "bg-[var(--primary)]/30 text-[var(--primary)]"
                : "bg-emerald-500/20 text-emerald-400"
            }`}
          >
            {course.accessType === "pro" ? "Pro" : "Free"}
          </span>
          <span className="rounded-full bg-[var(--background)]/90 px-2 py-0.5 text-xs text-[var(--muted)]">
            {course.host}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-[var(--foreground)] line-clamp-2">{course.title}</h3>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Duration: {course.totalDuration ?? "—"} · Lessons: {course.totalLessons}
        </p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--muted)]">
          <span>Students: <strong className="text-[var(--foreground)]">{course.studentsEnrolled}</strong></span>
          <span>Certificates: <strong className="text-[var(--foreground)]">{course.certificatesIssued}</strong></span>
          <span>Watch: <strong className="text-[var(--foreground)]">{course.totalWatchHours}h</strong></span>
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]">Completion: <strong className="text-[var(--primary)]">{course.completionRate}%</strong></p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] group-hover:underline">
          View analytics →
        </span>
      </div>
    </Link>
  );
}
