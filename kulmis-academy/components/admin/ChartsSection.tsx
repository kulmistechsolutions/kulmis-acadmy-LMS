"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
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
  Legend,
} from "recharts";

const FILTERS = ["7d", "30d"] as const;

type ChartsSectionProps = {
  studentGrowth: { date: string; count: number }[];
  courseWatchHours: { course: string; hours: number }[];
  subscriptionDistribution: { name: string; value: number; color: string }[];
};

const PIE_COLORS = ["#00F0FF", "#A020F0"];

export function ChartsSection({
  studentGrowth,
  courseWatchHours,
  subscriptionDistribution,
}: ChartsSectionProps) {
  const [filter, setFilter] = useState<"7d" | "30d">("7d");
  const growth = filter === "7d" ? studentGrowth.slice(-7) : studentGrowth;

  return (
    <div className="mt-10 space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Charts</h2>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ease-out ${
                filter === f
                  ? "bg-[var(--primary)]/25 text-[var(--primary)] shadow-[0_0_18px_rgba(0,240,255,0.35)]"
                  : "border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background)]/60"
              }`}
            >
              {f === "7d" ? "7 days" : "30 days"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-1">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.9)] backdrop-blur-xl transition-all duration-300 ease-out hover:border-[var(--primary)]/40 hover:shadow-[0_0_0_1px_rgba(0,240,255,0.2),0_20px_60px_rgba(15,23,42,1)] lg:p-6">
          <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Student growth (registrations)</h3>
          <div className="h-64 w-full lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growth} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--muted)" fontSize={12} />
                <YAxis stroke="var(--muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                  }}
                  labelStyle={{ color: "var(--foreground)" }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ fill: "var(--primary)", r: 4 }}
                  name="Registrations"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.9)] backdrop-blur-xl transition-all duration-300 ease-out hover:border-[var(--primary)]/40 hover:shadow-[0_0_0_1px_rgba(0,240,255,0.2),0_20px_60px_rgba(15,23,42,1)] lg:p-6">
          <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Course watch time (hours)</h3>
          <div className="h-64 w-full overflow-x-auto lg:h-80">
            <ResponsiveContainer width="100%" height="100%" minWidth={300}>
              <BarChart
                data={courseWatchHours.slice(0, 10)}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" stroke="var(--muted)" fontSize={12} unit="h" />
                <YAxis type="category" dataKey="course" stroke="var(--muted)" fontSize={11} width={70} />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                  }}
                />
                <Bar dataKey="hours" fill="var(--primary)" radius={[0, 4, 4, 0]} name="Hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.9)] backdrop-blur-xl transition-all duration-300 ease-out hover:border-[var(--primary)]/40 hover:shadow-[0_0_0_1px_rgba(0,240,255,0.2),0_20px_60px_rgba(15,23,42,1)] lg:p-6">
          <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Subscription distribution</h3>
          <div className="mx-auto h-64 w-full max-w-sm lg:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subscriptionDistribution.length > 0 ? subscriptionDistribution : [{ name: "No data", value: 1, color: "#1E293B" }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {(subscriptionDistribution.length > 0 ? subscriptionDistribution : [{ name: "No data", value: 1, color: "#1E293B" }]).map((d, i) => (
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
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
