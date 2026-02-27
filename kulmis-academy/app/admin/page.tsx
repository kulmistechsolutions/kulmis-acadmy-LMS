import { prisma } from "@/lib/db";
import { getCourses } from "@/lib/sanity";
import { KPIStats } from "@/components/admin/KPIStats";
import { ChartsSection } from "@/components/admin/ChartsSection";
import { Users, UserPlus, CreditCard, DollarSign, PlayCircle } from "lucide-react";

export const dynamic = "force-dynamic";

function getStartOfDay(d: Date) {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x.toISOString().slice(0, 10);
}

export default async function AdminOverviewPage() {
  const db = prisma;
  const courses = await getCourses().catch(() => []);

  if (!db) {
    return (
      <div>
        <h1 className="text-xl font-bold text-[var(--foreground)] sm:text-2xl">Overview</h1>
        <p className="mt-2 text-[var(--muted)]">Database not configured.</p>
      </div>
    );
  }

  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const [
    totalStudents,
    newToday,
    proCount,
    allUsersForGrowth,
    progressForWatchTime,
    freeCount,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { createdAt: { gte: todayStart } } }),
    db.user.count({ where: { isPro: true } }),
    db.user.findMany({
      where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      select: { createdAt: true },
    }),
    db.userProgress.findMany({
      select: { courseId: true, lastPositionSeconds: true },
    }),
    db.user.count({ where: { isPro: false } }),
  ]);

  const growthByDay: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    growthByDay[getStartOfDay(d)] = 0;
  }
  allUsersForGrowth.forEach((u) => {
    const key = getStartOfDay(u.createdAt);
    if (growthByDay[key] !== undefined) growthByDay[key]++;
  });
  const studentGrowth = Object.entries(growthByDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date: date.slice(5), count }));

  const watchByCourse: Record<string, number> = {};
  progressForWatchTime.forEach((p) => {
    watchByCourse[p.courseId] = (watchByCourse[p.courseId] ?? 0) + p.lastPositionSeconds;
  });
  const courseTitles: Record<string, string> = {};
  courses.forEach((c) => {
    courseTitles[c._id] = c.title;
  });
  const courseWatchHours = Object.entries(watchByCourse)
    .map(([id, sec]) => ({
      course: courseTitles[id] ?? id.slice(0, 8),
      hours: Math.round((sec / 3600) * 10) / 10,
    }))
    .filter((r) => r.hours > 0)
    .sort((a, b) => b.hours - a.hours);

  const subscriptionDistribution = [
    { name: "Free", value: freeCount, color: "#94A3B8" },
    { name: "Pro", value: proCount, color: "#00F0FF" },
  ].filter((d) => d.value > 0);

  const kpiCards = [
    {
      title: "Total Students",
      value: totalStudents,
      trend: newToday > 0 ? `+${newToday} today` : undefined,
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "New Students (Today)",
      value: newToday,
      icon: <UserPlus className="h-5 w-5" />,
    },
    {
      title: "Active Pro Users",
      value: proCount,
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      title: "Total Revenue",
      value: "—",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      title: "Courses Available",
      value: courses.length,
      icon: <PlayCircle className="h-5 w-5" />,
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-[var(--foreground)] sm:text-2xl">Overview</h1>
      <p className="mt-2 text-[var(--muted)]">Key metrics and analytics at a glance.</p>

      <section className="mt-8">
        <KPIStats cards={kpiCards} />
      </section>

      <ChartsSection
        studentGrowth={studentGrowth}
        courseWatchHours={courseWatchHours}
        subscriptionDistribution={subscriptionDistribution}
      />
    </div>
  );
}
