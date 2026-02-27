import { prisma } from "@/lib/db";
import { getCourses } from "@/lib/sanity";
import { getHostFromCourse } from "@/lib/course-utils";
import { CoursesClient } from "@/components/admin/courses/CoursesClient";
import type { EnrichedCourse } from "@/components/admin/courses/types";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const db = prisma;
  const courses = await getCourses().catch(() => []);

  if (!db) {
    return (
      <div>
        <h1 className="text-xl font-bold text-[var(--foreground)] sm:text-2xl">Courses</h1>
        <p className="mt-2 text-[var(--muted)]">Database not configured.</p>
      </div>
    );
  }

  const [progressRows, certificateCounts] = await Promise.all([
    db.userProgress.findMany({
      select: { courseId: true, userId: true, completed: true, lastPositionSeconds: true },
    }),
    db.certificate.groupBy({
      by: ["courseId"],
      _count: { id: true },
    }),
  ]);

  const certByCourse: Record<string, number> = {};
  certificateCounts.forEach((r) => {
    certByCourse[r.courseId] = r._count.id;
  });

  const byCourse: Record<
    string,
    { seconds: number; completions: number; userIds: Set<string> }
  > = {};
  progressRows.forEach((p) => {
    if (!byCourse[p.courseId]) {
      byCourse[p.courseId] = { seconds: 0, completions: 0, userIds: new Set() };
    }
    byCourse[p.courseId].seconds += p.lastPositionSeconds;
    if (p.completed) byCourse[p.courseId].completions += 1;
    byCourse[p.courseId].userIds.add(p.userId);
  });

  const enriched: EnrichedCourse[] = courses.map((c) => {
    const stat = byCourse[c._id] ?? { seconds: 0, completions: 0, userIds: new Set<string>() };
    const totalRecords = progressRows.filter((r) => r.courseId === c._id).length;
    const lessonCount = c.lessons?.length ?? 0;
    const maxCompletions = lessonCount * stat.userIds.size || 1;
    const completionRate = Math.round((stat.completions / maxCompletions) * 100);
    const createdDate = c._createdAt
      ? new Date(c._createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
      : null;
    const createdAt = c._createdAt ?? null;

    return {
      courseId: c._id,
      title: c.title,
      slug: c.slug ?? c._id,
      thumbnailUrl: c.thumbnailUrl ?? null,
      accessType: c.accessType ?? "free",
      host: getHostFromCourse(c),
      totalLessons: lessonCount,
      totalDuration: null,
      totalWatchHours: Math.round((stat.seconds / 3600) * 10) / 10,
      completionRate: Math.min(100, completionRate),
      certificatesIssued: certByCourse[c._id] ?? 0,
      studentsEnrolled: stat.userIds.size,
      createdDate,
      createdAt,
    };
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-[var(--foreground)] sm:text-2xl">Courses</h1>
      <p className="mt-2 text-[var(--muted)]">Manage courses, view analytics, and track engagement.</p>
      <section className="mt-6">
        <CoursesClient courses={enriched} />
      </section>
    </div>
  );
}
