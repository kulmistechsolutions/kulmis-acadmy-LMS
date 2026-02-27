import type { SanityCourse } from "@/lib/sanity";

export function getHostFromCourse(course: SanityCourse): "Vimeo" | "YouTube" | "Custom" {
  const url = course.lessons?.[0]?.videoUrl ?? "";
  const lower = url.toLowerCase();
  if (lower.includes("vimeo.com")) return "Vimeo";
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) return "YouTube";
  return "Custom";
}

/** For filter matching we need lowercase. */
export function getHostSlug(course: SanityCourse): "vimeo" | "youtube" | "custom" {
  const host = getHostFromCourse(course);
  return host.toLowerCase() as "vimeo" | "youtube" | "custom";
}
