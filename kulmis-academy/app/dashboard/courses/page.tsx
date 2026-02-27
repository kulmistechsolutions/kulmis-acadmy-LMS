import { getCourses } from "@/lib/sanity";
import { CourseCard } from "@/components/course/CourseCard";
import { Page, cardClass } from "@/components/ui/Page";

export const dynamic = "force-dynamic";

export default async function DashboardCoursesPage() {
  const courses = await getCourses();

  return (
    <Page
      title="My courses"
      subtitle="Browse and continue where you left off."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {courses.length === 0 ? (
          <div className={`col-span-full py-12 text-center text-[var(--muted)] ${cardClass} p-8`}>
            No courses yet. Check the home page for new content.
          </div>
        ) : (
          courses.map((c) => (
            <CourseCard
              key={c._id}
              id={c._id}
              slug={c.slug ?? c._id}
              title={c.title}
              description={c.description}
              thumbnailUrl={c.thumbnailUrl}
              accessType={c.accessType}
              showCta
            />
          ))
        )}
      </div>
    </Page>
  );
}
