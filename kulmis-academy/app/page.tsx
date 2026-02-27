import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";
import { NeonBackground } from "@/components/NeonBackground";
import { CourseCard } from "@/components/course/CourseCard";
import { getCourses } from "@/lib/sanity";

export const dynamic = "force-dynamic";

export default async function Home() {
  const courses = await getCourses();

  return (
    <div className="relative min-h-screen text-[var(--foreground)]">
      <NeonBackground />
      <Header />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <section id="courses" className="border-t border-[var(--border)] py-12 sm:py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl lg:text-4xl">
              Explore courses
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-[var(--muted)] sm:mt-4 sm:text-base">
              {courses.length
                ? "Hand-picked courses to level up your skills."
                : "Add courses in the Sanity Studio."}
            </p>
            <div className="mt-8 grid gap-6 sm:mt-10 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-8">
              {courses.length > 0
                ? courses.map((c) => (
                    <CourseCard
                      key={c._id}
                      id={c._id}
                      slug={c.slug ?? c._id}
                      title={c.title}
                      description={c.description}
                      thumbnailUrl={c.thumbnailUrl}
                      accessType={c.accessType}
                    />
                  ))
                : [1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 p-6 backdrop-blur"
                    >
                      <div className="aspect-video rounded-xl bg-[var(--border)]/50" />
                      <h3 className="mt-4 font-semibold text-[var(--foreground)]">Course placeholder</h3>
                      <p className="mt-1 text-sm text-[var(--muted)]">Add in Studio</p>
                    </div>
                  ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
