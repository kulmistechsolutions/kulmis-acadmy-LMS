"use client";

import { useCallback } from "react";
import { UpgradeOverlay } from "./UpgradeOverlay";

type CoursePlayerProps = {
  videoUrl: string | null | undefined;
  lessonTitle: string;
  lessonIndex: number;
  isCompleted: boolean;
  onMarkComplete: () => void;
  isSaving?: boolean;
  showUpgradeOverlay?: boolean;
};

export function CoursePlayer({
  videoUrl,
  lessonTitle,
  lessonIndex,
  isCompleted,
  onMarkComplete,
  isSaving = false,
  showUpgradeOverlay = false,
}: CoursePlayerProps) {
  const embed = useCallback(() => {
    if (!videoUrl) return null;
    try {
      const u = new URL(videoUrl);
      const host = u.hostname.toLowerCase();
      if (host.includes("youtube.com") || host.includes("youtu.be")) {
        const vid =
          u.searchParams.get("v") ||
          (u.pathname.startsWith("/embed/") ? u.pathname.split("/embed/")[1] : null) ||
          (u.hostname === "youtu.be" ? u.pathname.slice(1) : null);
        if (vid) {
          return (
            <iframe
              src={`https://www.youtube.com/embed/${vid}`}
              title={lessonTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
              suppressHydrationWarning
            />
          );
        }
      }
      if (host.includes("vimeo.com")) {
        const vid = u.pathname.split("/").filter(Boolean).pop();
        if (vid) {
          return (
            <iframe
              src={`https://player.vimeo.com/video/${vid}`}
              title={lessonTitle}
              allow="fullscreen; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
              suppressHydrationWarning
            />
          );
        }
      }
    } catch {
      // ignore
    }
    return (
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-full items-center justify-center bg-[var(--border)] p-4 text-[var(--primary)] hover:underline"
      >
        Watch video (opens in new tab)
      </a>
    );
  }, [videoUrl, lessonTitle]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-none border-0 border-b border-[var(--border)] bg-black shadow-none sm:rounded-xl sm:border sm:shadow-[0_0_30px_rgba(0,240,255,0.08)]">
        <div className="aspect-video w-full">
          {videoUrl ? embed() : (
            <div className="flex h-full items-center justify-center bg-[var(--surface)] text-[var(--muted)]">
              No video for this lesson
            </div>
          )}
        </div>
        {showUpgradeOverlay && (
          <div className="absolute inset-0">
            <UpgradeOverlay />
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-snug text-[var(--foreground)] sm:text-lg">{lessonTitle}</h3>
        {!showUpgradeOverlay && videoUrl && (
          <button
            type="button"
            onClick={onMarkComplete}
            disabled={isSaving}
            className={`min-h-[44px] rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
              isCompleted
                ? "bg-[var(--primary)]/20 text-[var(--primary)]"
                : "bg-[var(--primary)] text-[var(--primary-contrast)] hover:opacity-90 active:opacity-90"
            } disabled:opacity-50`}
          >
            {isSaving ? "Saving…" : isCompleted ? "✓ Completed" : "Mark as completed"}
          </button>
        )}
      </div>
    </div>
  );
}

