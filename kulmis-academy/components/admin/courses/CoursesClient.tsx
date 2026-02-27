"use client";

import { useMemo, useState } from "react";
import { CourseFilters, defaultFilters, type CourseFilterState } from "./CourseFilters";
import { CourseTable } from "./CourseTable";
import { CourseCard } from "./CourseCard";
import type { EnrichedCourse } from "./types";

function filterAndSort(
  courses: EnrichedCourse[],
  filters: CourseFilterState
): EnrichedCourse[] {
  let list = [...courses];
  if (filters.access === "free") list = list.filter((c) => c.accessType !== "pro");
  if (filters.access === "pro") list = list.filter((c) => c.accessType === "pro");
  if (filters.host !== "all") {
    const h = filters.host;
    list = list.filter((c) => c.host.toLowerCase() === h);
  }
  if (filters.sort === "created") {
    list.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
  } else if (filters.sort === "watch") {
    list.sort((a, b) => b.totalWatchHours - a.totalWatchHours);
  } else if (filters.sort === "certificates") {
    list.sort((a, b) => b.certificatesIssued - a.certificatesIssued);
  } else {
    list.sort((a, b) => b.studentsEnrolled - a.studentsEnrolled);
  }
  return list;
}

export function CoursesClient({ courses }: { courses: EnrichedCourse[] }) {
  const [filters, setFilters] = useState<CourseFilterState>(defaultFilters);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const filtered = useMemo(() => filterAndSort(courses, filters), [courses, filters]);

  return (
    <div className="space-y-4">
      <CourseFilters
        filters={filters}
        onFiltersChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      {viewMode === "table" ? (
        <CourseTable courses={filtered} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CourseCard key={c.courseId} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}
