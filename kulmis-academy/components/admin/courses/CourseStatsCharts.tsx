"use client";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type LessonCompletionDatum = { lesson: string; completed: number; total: number };
type WatchByLessonDatum = { lesson: string; hours: number };
type ProgressBucket = { name: string; value: number; color: string };

const BUCKET_COLORS = ["#1E293B", "#475569", "#00F0FF", "#22c55e"];

export function CourseStatsCharts({
  lessonCompletion,
  watchByLesson,
  progressDistribution,
}: {
  lessonCompletion: LessonCompletionDatum[];
  watchByLesson: WatchByLessonDatum[];
  progressDistribution: ProgressBucket[];
}) {
  return (
    <div className="mt-8 space-y-8">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-4 backdrop-blur-xl lg:p-6">
        <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Lesson completion</h3>
        <div className="h-64 w-full lg:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={lessonCompletion} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="lesson" stroke="var(--muted)" fontSize={11} />
              <YAxis stroke="var(--muted)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                }}
              />
              <Bar dataKey="completed" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-4 backdrop-blur-xl lg:p-6">
        <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Watch time by lesson (hours)</h3>
        <div className="h-64 w-full lg:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={watchByLesson} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="lesson" stroke="var(--muted)" fontSize={11} />
              <YAxis stroke="var(--muted)" fontSize={12} unit="h" />
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                }}
              />
              <Bar dataKey="hours" fill="var(--secondary)" radius={[4, 4, 0, 0]} name="Hours" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-4 backdrop-blur-xl lg:p-6">
        <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Student progress distribution</h3>
        <div className="mx-auto h-64 w-full max-w-xs lg:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={progressDistribution.length > 0 ? progressDistribution : [{ name: "No data", value: 1, color: "#1E293B" }]}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {(progressDistribution.length > 0 ? progressDistribution : [{ name: "No data", value: 1, color: "#1E293B" }]).map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
