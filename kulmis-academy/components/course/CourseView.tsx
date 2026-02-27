"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CoursePlayer } from "./CoursePlayer";
import { LessonSidebar, type LessonItem } from "./LessonSidebar";
import { ProgressBar } from "./ProgressBar";
import { UserStatsCard } from "./UserStatsCard";
import { CertificateFormModal } from "./CertificateFormModal";

type Lesson = {
  title?: string;
  videoUrl?: string | null;
  description?: string;
  order?: number;
  pdfUrl?: string | null;
  pdfSize?: number | null;
};

type CourseViewProps = {
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  accessType: string;
  lessons: Lesson[];
  isPro: boolean;
  initialProgress: { lessonIndex: number; completed: boolean }[];
  /** First incomplete lesson index, or 0 */
  initialLessonIndex?: number;
};

export function CourseView({
  courseId,
  courseTitle,
  courseSlug,
  accessType,
  lessons: rawLessons,
  isPro,
  initialProgress,
  initialLessonIndex = 0,
}: CourseViewProps) {
  const lessons = rawLessons
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) as (Lesson & { index?: number })[];
  lessons.forEach((l, i) => {
    l.index = i;
  });

  const [currentIndex, setCurrentIndex] = useState(() => {
    const max = Math.max(0, rawLessons.length - 1);
    return Math.min(Math.max(0, initialLessonIndex), max);
  });
  const [progress, setProgress] = useState<Record<number, { completed: boolean }>>(() => {
    const map: Record<number, { completed: boolean }> = {};
    initialProgress.forEach((p) => {
      map[p.lessonIndex] = { completed: p.completed };
    });
    return map;
  });
  const [saving, setSaving] = useState(false);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [certificateEligibility, setCertificateEligibility] = useState<{
    canClaim: boolean;
    alreadyIssued: boolean;
    certificateId: string | null;
  } | null>(null);
  const [lessonsDrawerOpen, setLessonsDrawerOpen] = useState(false);
  const [pdfDownloading, setPdfDownloading] = useState(false);

  const isProCourse = accessType === "pro";
  const canAccess = !isProCourse || isPro;

  const lessonItems: LessonItem[] = lessons.map((l, i) => ({
    index: i,
    title: l.title ?? `Lesson ${i + 1}`,
    videoUrl: l.videoUrl,
    isCompleted: !!progress[i]?.completed,
    isLocked: isProCourse && !isPro, // show 🔒 in sidebar; overlay on video
  }));

  const completedCount = Object.values(progress).filter((p) => p.completed).length;
  const totalCount = lessons.length;
  const percent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const saveProgress = useCallback(
    async (lessonIndex: number, completed: boolean) => {
      setSaving(true);
      try {
        await fetch(`/api/courses/${courseId}/progress`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonIndex, completed }),
        });
        setProgress((prev) => ({
          ...prev,
          [lessonIndex]: { ...prev[lessonIndex], completed },
        }));
      } finally {
        setSaving(false);
      }
    },
    [courseId]
  );

  const markComplete = useCallback(() => {
    if (progress[currentIndex]?.completed) return;
    saveProgress(currentIndex, true);
  }, [currentIndex, progress, saveProgress]);

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      setLessonsDrawerOpen(false); // close drawer on mobile when selecting a lesson
    },
    []
  );

  useEffect(() => {
    if (totalCount === 0 || percent < 100) return;
    let cancelled = false;
    fetch(`/api/courses/${courseId}/certificate`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled)
          setCertificateEligibility({
            canClaim: !!data.canClaim,
            alreadyIssued: !!data.alreadyIssued,
            certificateId: data.certificateId ?? null,
          });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [courseId, totalCount, percent]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight" && currentIndex < lessons.length - 1) {
        e.preventDefault();
        goTo(currentIndex + 1);
      }
      if (e.key === "ArrowLeft" && currentIndex > 0) {
        e.preventDefault();
        goTo(currentIndex - 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentIndex, lessons.length, goTo]);

  const currentLesson = lessons[currentIndex];
  const currentTitle = currentLesson?.title ?? `Lesson ${currentIndex + 1}`;
  const showUpgrade = isProCourse && !isPro;
  const hasPdf = !!currentLesson?.pdfUrl;
  const pdfRestricted = hasPdf && !isPro;

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDownloadPdf = useCallback(() => {
    if (!isPro || !hasPdf || pdfDownloading) return;
    setPdfDownloading(true);
    const url = `/api/lesson/download?courseId=${encodeURIComponent(courseId)}&lessonIndex=${currentIndex}`;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText);
        return r.blob();
      })
      .then((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${(currentLesson?.title ?? `lesson-${currentIndex + 1}`).replace(/[^a-z0-9.-]/gi, "-")}.pdf`;
        a.click();
        URL.revokeObjectURL(a.href);
      })
      .finally(() => setPdfDownloading(false));
  }, [courseId, currentIndex, currentLesson?.title, isPro, hasPdf, pdfDownloading]);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      {/* Top Navbar - min 44px touch targets on mobile */}
      <header className="sticky top-0 z-20 flex min-h-[3.5rem] items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--background)]/95 px-3 backdrop-blur sm:min-h-0 sm:px-6 sm:py-0 sm:leading-none">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
          {/* Mobile: Lessons drawer toggle - touch-friendly */}
          <button
            type="button"
            onClick={() => setLessonsDrawerOpen((o) => !o)}
            className="flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 px-3 py-2.5 text-sm font-medium text-[var(--foreground)] active:bg-[var(--border)]/50 lg:hidden"
            aria-label={lessonsDrawerOpen ? "Close lessons" : "Open lessons"}
          >
            <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span>Lessons</span>
            <span className="font-semibold text-[var(--primary)]">{currentIndex + 1}/{totalCount}</span>
          </button>
          <Link
            href="/#courses"
            className="min-h-[44px] shrink-0 rounded-xl px-2 py-2.5 text-sm text-[var(--muted)] hover:bg-[var(--border)]/30 hover:text-[var(--primary)] active:bg-[var(--border)]/50 sm:min-h-0"
          >
            ← Courses
          </Link>
          <span className="hidden text-[var(--border)] sm:inline">|</span>
          <span className="truncate text-sm font-medium text-[var(--foreground)] sm:max-w-[200px]">
            {courseTitle}
          </span>
        </div>
        <Link
          href="/dashboard"
          className="min-h-[44px] shrink-0 rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm font-medium text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] active:bg-[var(--border)]/30 sm:min-h-0"
        >
          Dashboard
        </Link>
      </header>

      {/* Sticky progress bar - compact on mobile */}
      <div className="sticky top-[3.5rem] z-10 border-b border-[var(--border)] bg-[var(--surface)]/90 px-3 py-2.5 backdrop-blur sm:top-14 sm:px-4 sm:py-3">
        <ProgressBar percent={percent} completed={completedCount} total={totalCount} />
      </div>

      {/* Mobile: Left slide-out Lessons drawer (collapsed by default) */}
      <div className="lg:hidden">
        {/* Overlay */}
        <button
          type="button"
          aria-label="Close lessons"
          className={`fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
            lessonsDrawerOpen ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
          }`}
          onClick={() => setLessonsDrawerOpen(false)}
        />
        {/* Drawer panel */}
        <div
          className={`fixed left-0 top-0 z-40 flex h-full w-[min(100vw-3rem,20rem)] max-w-[20rem] flex-col border-r border-[var(--border)] bg-[var(--surface)]/98 shadow-xl transition-transform duration-200 ease-out lg:hidden ${
            lessonsDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-14 shrink-0 items-center justify-end border-b border-[var(--border)] px-4">
            <button
              type="button"
              onClick={() => setLessonsDrawerOpen(false)}
              className="rounded-lg p-2 text-[var(--muted)] hover:bg-[var(--border)]/50 hover:text-[var(--foreground)]"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <LessonSidebar
              lessons={lessonItems}
              currentIndex={currentIndex}
              onSelect={goTo}
              className="h-full min-h-0 border-0 rounded-none bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* Main: Video always on top; sidebar only on desktop */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Desktop sidebar - hidden on mobile (lessons are in drawer) */}
        <div className="hidden w-72 shrink-0 border-r border-[var(--border)] lg:order-1 lg:block">
          <div className="sticky top-[7rem] max-h-[calc(100vh-7rem)]">
            <LessonSidebar
              lessons={lessonItems}
              currentIndex={currentIndex}
              onSelect={goTo}
              className="h-full"
            />
          </div>
        </div>

        {/* Main video + content - always first on mobile; full-bleed video on small screens */}
        <main className="min-w-0 flex-1 px-0 pb-6 sm:px-4 sm:pb-8 lg:px-6 lg:order-2">
          <div className="mx-auto max-w-4xl">
            <CoursePlayer
              videoUrl={currentLesson?.videoUrl}
              lessonTitle={currentTitle}
              lessonIndex={currentIndex}
              isCompleted={!!progress[currentIndex]?.completed}
              onMarkComplete={markComplete}
              isSaving={saving}
              showUpgradeOverlay={showUpgrade}
            />
            <div className="mt-4 flex flex-col gap-3 px-4 sm:flex-row sm:flex-wrap sm:justify-between sm:px-0">
              {currentIndex > 0 ? (
                <button
                  type="button"
                  onClick={() => goTo(currentIndex - 1)}
                  className="min-h-[44px] min-w-0 flex-1 rounded-xl border border-[var(--border)] px-4 py-3 text-sm font-medium text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] active:bg-[var(--border)]/30 sm:flex-initial sm:py-2"
                >
                  ← Previous lesson
                </button>
              ) : (
                <span />
              )}
              {currentIndex < lessons.length - 1 ? (
                <button
                  type="button"
                  onClick={() => goTo(currentIndex + 1)}
                  className="min-h-[44px] min-w-0 flex-1 rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-medium text-[var(--primary-contrast)] shadow-[var(--shadow)] hover:opacity-90 active:opacity-90 sm:flex-initial sm:py-2"
                >
                  Next lesson →
                </button>
              ) : (
                <span />
              )}
            </div>
            {currentLesson?.description && (
              <div className="mx-4 mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 p-4 backdrop-blur sm:mx-0">
                <h4 className="text-sm font-semibold text-[var(--foreground)]">About this lesson</h4>
                <p className="mt-2 text-sm text-[var(--muted)]">{currentLesson.description}</p>
              </div>
            )}
            {/* Lesson Resources – downloadable PDF (Pro only) */}
            {hasPdf && (
              <div className="mx-4 mt-6 sm:mx-0">
                <h4 className="mb-3 text-sm font-semibold text-[var(--foreground)]">Lesson Resources</h4>
                <div className="relative rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 p-4 shadow-[0_0_0_1px_var(--border),0_0_20px_rgba(0,240,255,0.08)] backdrop-blur transition-all duration-300 hover:border-[var(--primary)]/50 hover:shadow-[0_0_0_1px_var(--primary)/30,0_0_24px_rgba(0,240,255,0.15)]">
                  {pdfRestricted && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-[var(--background)]/95 backdrop-blur">
                      <p className="text-center text-sm font-medium text-[var(--foreground)]">
                        This resource is available for Pro members only.
                      </p>
                      <Link
                        href="/dashboard#pricing"
                        className="mt-3 min-h-[44px] rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-[var(--primary-contrast)] shadow-[var(--shadow)] transition-all hover:opacity-90"
                      >
                        Upgrade to Pro
                      </Link>
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[var(--foreground)]">
                        {currentLesson?.title ?? `Lesson ${currentIndex + 1}`}.pdf
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--muted)]">
                        {currentLesson?.pdfSize != null ? formatBytes(currentLesson.pdfSize) : "PDF"}
                        {pdfRestricted && (
                          <span className="ml-2 inline-flex items-center rounded bg-[var(--primary)]/20 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--primary)]">
                            Pro
                          </span>
                        )}
                      </p>
                    </div>
                    {isPro && (
                      <button
                        type="button"
                        onClick={handleDownloadPdf}
                        disabled={pdfDownloading}
                        className="min-h-[44px] shrink-0 rounded-xl border border-[var(--primary)] bg-[var(--primary)]/10 px-4 py-2.5 text-sm font-medium text-[var(--primary)] transition-all hover:bg-[var(--primary)]/20 hover:shadow-[0_0_16px_rgba(0,240,255,0.2)] disabled:opacity-60"
                      >
                        {pdfDownloading ? "Downloading…" : "Download PDF"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
            <UserStatsCard
              completed={completedCount}
              total={totalCount}
              className="mx-4 mt-6 sm:mx-0"
            />
            {percent >= 100 && certificateEligibility?.canClaim && (
              <div className="mt-6 flex justify-center px-4 sm:px-0">
                <button
                  type="button"
                  onClick={() => setCertificateModalOpen(true)}
                  className="min-h-[48px] w-full max-w-sm rounded-xl bg-[var(--primary)] px-6 py-3 font-medium text-[var(--primary-contrast)] shadow-[var(--shadow)] transition-all duration-300 hover:opacity-90 active:opacity-90"
                >
                  {certificateEligibility.alreadyIssued ? "Download Certificate" : "Get Certificate"}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
      <CertificateFormModal
        isOpen={certificateModalOpen}
        onClose={() => setCertificateModalOpen(false)}
        courseId={courseId}
        courseTitle={courseTitle}
        alreadyIssued={certificateEligibility?.alreadyIssued ?? false}
        certificateId={certificateEligibility?.certificateId ?? null}
        onSuccess={() => {
          setCertificateEligibility((prev) =>
            prev ? { ...prev, alreadyIssued: true } : null
          );
        }}
      />
    </div>
  );
}
