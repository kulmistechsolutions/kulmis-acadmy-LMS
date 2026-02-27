"use client";

export type LessonItem = {
  index: number;
  title: string;
  videoUrl?: string | null;
  isCompleted?: boolean;
  isLocked?: boolean;
};

type LessonSidebarProps = {
  lessons: LessonItem[];
  currentIndex: number;
  onSelect: (index: number) => void;
  className?: string;
};

export function LessonSidebar({
  lessons,
  currentIndex,
  onSelect,
  className = "",
}: LessonSidebarProps) {
  return (
    <aside
      className={`flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur ${className}`}
    >
      <div className="border-b border-[var(--border)] px-4 py-3">
        <h2 className="text-sm font-semibold text-[var(--foreground)]">Lessons</h2>
      </div>
      <ul className="lesson-sidebar-list flex-1 space-y-0.5 overflow-y-auto p-2">
        {lessons.map((lesson) => {
          const isActive = lesson.index === currentIndex;
          const isLocked = lesson.isLocked;
          return (
            <li key={lesson.index}>
              <button
                type="button"
                onClick={() => onSelect(lesson.index)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-200 hover:bg-[var(--border)]/50 hover:text-[var(--foreground)] ${
                  isActive
                    ? "border border-[var(--primary)]/60 bg-[var(--primary)]/10 text-[var(--foreground)] shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                    : ""
                }`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[var(--border)]/80 text-xs font-medium text-[var(--muted)]">
                  {lesson.index + 1}
                </span>
                {lesson.isCompleted && !isActive && (
                  <span className="shrink-0 text-[var(--primary)]" title="Completed">
                    ✓
                  </span>
                )}
                <span className="min-w-0 flex-1 truncate">{lesson.title}</span>
                {isLocked && <span className="shrink-0 text-[var(--muted)]" title="Pro">🔒</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
