import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCourseById } from "@/lib/sanity";
import { getHostFromCourse } from "@/lib/course-utils";
import { CourseStatsCharts } from "@/components/admin/courses/CourseStatsCharts";

export const dynamic = "force-dynamic";

const BUCKET_COLORS = ["#1E293B", "#475569", "#00F0FF", "#22c55e"];

export default async function AdminCourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const db = prisma;
  const course = await getCourseById(courseId);
  if (!course) notFound();

  if (!db) {
    return (
      <div>
        <p className="text-[var(--muted)]">Database not configured.</p>
      </div>
    );
  }

  const lessonCount = course.lessons?.length ?? 0;
  const [progressRows, certificates] = await Promise.all([
    db.userProgress.findMany({
      where: { courseId },
      select: { userId: true, lessonIndex: true, completed: true, lastPositionSeconds: true },
    }),
    db.certificate.findMany({
      where: { courseId },
      orderBy: { createdAt: "desc" },
      select: { id: true, certificateId: true, fullName: true, courseTitle: true, completionDate: true, createdAt: true },
    }),
  ]);

  const totalWatchSeconds = progressRows.reduce((a, p) => a + p.lastPositionSeconds, 0);
  const totalWatchHours = Math.round((totalWatchSeconds / 3600) * 10) / 10;
  const uniqueStudents = new Set(progressRows.map((p) => p.userId)).size;
  const avgWatchPerStudent = uniqueStudents > 0 ? Math.round((totalWatchSeconds / uniqueStudents / 3600) * 10) / 10 : 0;

  const byLesson: Record<number, { completed: number; total: number; seconds: number }> = {};
  for (let i = 0; i < lessonCount; i++) byLesson[i] = { completed: 0, total: 0, seconds: 0 };
  progressRows.forEach((p) => {
    if (byLesson[p.lessonIndex] != null) {
      byLesson[p.lessonIndex].total += 1;
      if (p.completed) byLesson[p.lessonIndex].completed += 1;
      byLesson[p.lessonIndex].seconds += p.lastPositionSeconds;
    }
  });

  const lessonCompletion = Object.entries(byLesson).map(([idx, v]) => ({
    lesson: `L${Number(idx) + 1}`,
    completed: v.completed,
    total: v.total,
  }));
  const watchByLesson = Object.entries(byLesson).map(([idx, v]) => ({
    lesson: `L${Number(idx) + 1}`,
    hours: Math.round((v.seconds / 3600) * 10) / 10,
  }));

  const completionByUser: Record<string, number> = {};
  progressRows.forEach((p) => {
    if (!completionByUser[p.userId]) completionByUser[p.userId] = 0;
    if (p.completed) completionByUser[p.userId]++;
  });
  const buckets = [0, 0, 0, 0];
  Object.values(completionByUser).forEach((completed) => {
    const pct = lessonCount > 0 ? (completed / lessonCount) * 100 : 0;
    if (pct <= 25) buckets[0]++;
    else if (pct <= 50) buckets[1]++;
    else if (pct <= 75) buckets[2]++;
    else buckets[3]++;
  });
  const progressDistribution = [
    { name: "0–25%", value: buckets[0], color: BUCKET_COLORS[0] },
    { name: "25–50%", value: buckets[1], color: BUCKET_COLORS[1] },
    { name: "50–75%", value: buckets[2], color: BUCKET_COLORS[2] },
    { name: "75–100%", value: buckets[3], color: BUCKET_COLORS[3] },
  ].filter((d) => d.value > 0);
  if (progressDistribution.length === 0) progressDistribution.push({ name: "No data", value: 1, color: "#1E293B" });

  const totalCompletions = progressRows.filter((p) => p.completed).length;
  const maxPossible = lessonCount * uniqueStudents || 1;
  const avgCompletionPct = Math.round((totalCompletions / maxPossible) * 100);

  let dropOffLesson = 0;
  let minRate = 1;
  Object.entries(byLesson).forEach(([idx, v]) => {
    const rate = v.total > 0 ? v.completed / v.total : 1;
    if (rate < minRate) {
      minRate = rate;
      dropOffLesson = Number(idx);
    }
  });

  let mostWatchedLesson = 0;
  let maxSec = 0;
  Object.entries(byLesson).forEach(([idx, v]) => {
    if (v.seconds > maxSec) {
      maxSec = v.seconds;
      mostWatchedLesson = Number(idx);
    }
  });

  const host = getHostFromCourse(course);

  return (
    <div>
      <Link
        href="/admin/courses"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--primary)]"
      >
        ← Courses
      </Link>
      <h1 className="mt-4 text-xl font-bold text-[var(--foreground)] sm:text-2xl">{course.title}</h1>
      <p className="mt-2 text-[var(--muted)]">Course analytics and engagement metrics.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            course.accessType === "pro" ? "bg-[var(--primary)]/20 text-[var(--primary)]" : "bg-emerald-500/20 text-emerald-400"
          }`}
        >
          {course.accessType === "pro" ? "Pro" : "Free"}
        </span>
        <span className="rounded-full bg-[var(--border)]/80 px-2.5 py-1 text-xs text-[var(--muted)]">
          Host: {host}
        </span>
        <span className="rounded-full bg-[var(--border)]/80 px-2.5 py-1 text-xs text-[var(--muted)]">
          {lessonCount} lessons
        </span>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 p-4 backdrop-blur">
          <p className="text-xs font-medium uppercase text-[var(--muted)]">Students enrolled</p>
          <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{uniqueStudents}</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 p-4 backdrop-blur">
          <p className="text-xs font-medium uppercase text-[var(--muted)]">Avg completion</p>
          <p className="mt-1 text-2xl font-bold text-[var(--primary)]">{avgCompletionPct}%</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 p-4 backdrop-blur">
          <p className="text-xs font-medium uppercase text-[var(--muted)]">Total watch hours</p>
          <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{totalWatchHours}h</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 p-4 backdrop-blur">
          <p className="text-xs font-medium uppercase text-[var(--muted)]">Avg watch / student</p>
          <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{avgWatchPerStudent}h</p>
        </div>
      </section>

      <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 p-4 backdrop-blur">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">Engagement</h3>
        <ul className="mt-2 space-y-1 text-sm text-[var(--muted)]">
          <li>Drop-off lesson: Lesson {dropOffLesson + 1} (lowest completion)</li>
          <li>Most watched lesson: Lesson {mostWatchedLesson + 1}</li>
        </ul>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Certificates</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">{certificates.length} issued</p>
        {certificates.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--muted)]">No certificates yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]/60">
            <table className="w-full min-w-[400px] text-left text-sm">
              <thead className="border-b border-[var(--border)]">
                <tr>
                  <th className="px-4 py-2 font-medium text-[var(--foreground)]">Student</th>
                  <th className="px-4 py-2 font-medium text-[var(--foreground)]">Issue date</th>
                  <th className="px-4 py-2 font-medium text-[var(--foreground)]">Verify</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((c) => (
                  <tr key={c.id} className="border-b border-[var(--border)]/50 last:border-0">
                    <td className="px-4 py-2 text-[var(--foreground)]">{c.fullName}</td>
                    <td className="px-4 py-2 text-[var(--muted)]">
                      {c.completionDate.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <Link
                        href={`/verify/${c.certificateId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--primary)] hover:underline"
                      >
                        Verify
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Charts</h2>
        <CourseStatsCharts
          lessonCompletion={lessonCompletion}
          watchByLesson={watchByLesson}
          progressDistribution={progressDistribution}
        />
      </section>
    </div>
  );
}
