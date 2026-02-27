import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getCourseBySlug } from "@/lib/sanity";
import { prisma } from "@/lib/db";

/**
 * GET /api/lesson/download?courseId=...&lessonIndex=...
 * Returns the lesson PDF for Pro users. Validates session and subscription; never exposes direct asset URLs.
 */
export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");
  const lessonIndexParam = searchParams.get("lessonIndex");

  if (!courseId || lessonIndexParam === null || lessonIndexParam === "") {
    return NextResponse.json(
      { error: "courseId and lessonIndex are required" },
      { status: 400 }
    );
  }

  const lessonIndex = parseInt(lessonIndexParam, 10);
  if (Number.isNaN(lessonIndex) || lessonIndex < 0) {
    return NextResponse.json({ error: "Invalid lessonIndex" }, { status: 400 });
  }

  if (!user.isPro) {
    return NextResponse.json(
      { error: "Pro membership required to download lesson PDFs" },
      { status: 403 }
    );
  }

  const course = await getCourseBySlug(courseId);
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const lessons = (course.lessons ?? []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const lesson = lessons[lessonIndex];
  if (!lesson?.pdfUrl) {
    return NextResponse.json(
      { error: "This lesson has no PDF available" },
      { status: 404 }
    );
  }

  try {
    const res = await fetch(lesson.pdfUrl, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch PDF" },
        { status: 502 }
      );
    }

    if (prisma) {
      prisma.lessonDownload
        .create({
          data: {
            userId: user.id,
            courseId,
            lessonIndex,
          },
        })
        .catch(() => {});
    }

    const contentType = res.headers.get("content-type") ?? "application/pdf";
    const contentLength = res.headers.get("content-length");
    const contentDisposition =
      res.headers.get("content-disposition") ??
      `attachment; filename="${(lesson.title ?? `lesson-${lessonIndex + 1}`).replace(/[^a-z0-9.-]/gi, "-")}.pdf"`;

    const headers = new Headers({
      "Content-Type": contentType,
      "Content-Disposition": contentDisposition,
    });
    if (contentLength) headers.set("Content-Length", contentLength);

    return new NextResponse(res.body, { status: 200, headers });
  } catch {
    return NextResponse.json(
      { error: "Failed to stream PDF" },
      { status: 502 }
    );
  }
}
