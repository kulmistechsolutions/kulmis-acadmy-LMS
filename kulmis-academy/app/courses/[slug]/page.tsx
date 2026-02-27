import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/sanity";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CourseView } from "@/components/course/CourseView";

export const dynamic = "force-dynamic";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const user = await getCurrentUser();
  const isPro = user?.isPro ?? false;
  let progress: { lessonIndex: number; completed: boolean }[] = [];
  let initialLessonIndex = 0;

  if (user && prisma) {
    const rows = await prisma.userProgress.findMany({
      where: { userId: user.id, courseId: course._id },
      orderBy: { lessonIndex: "asc" },
    });
    progress = rows.map((r) => ({ lessonIndex: r.lessonIndex, completed: r.completed }));
    const firstIncomplete = progress.findIndex((p) => !p.completed);
    initialLessonIndex = firstIncomplete >= 0 ? firstIncomplete : Math.max(0, rows.length - 1);
  }

  const lessons = (course.lessons ?? []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <CourseView
      courseId={course._id}
      courseTitle={course.title}
      courseSlug={course.slug ?? slug}
      accessType={course.accessType ?? "free"}
      lessons={lessons}
      isPro={isPro}
      initialProgress={progress}
      initialLessonIndex={initialLessonIndex}
    />
  );
}
