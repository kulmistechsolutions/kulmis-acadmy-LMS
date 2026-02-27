import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  if (!prisma) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { courseId } = await params;
  const progress = await prisma.userProgress.findMany({
    where: { userId: user.id, courseId },
    orderBy: { lessonIndex: "asc" },
  });
  return NextResponse.json(progress);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  if (!prisma) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { courseId } = await params;
  const body = await req.json().catch(() => ({}));
  const lessonIndex = typeof body.lessonIndex === "number" ? body.lessonIndex : 0;
  const completed = typeof body.completed === "boolean" ? body.completed : undefined;
  const lastPositionSeconds = typeof body.lastPositionSeconds === "number" ? body.lastPositionSeconds : undefined;

  const data: { completed?: boolean; lastPositionSeconds?: number } = {};
  if (completed !== undefined) data.completed = completed;
  if (lastPositionSeconds !== undefined) data.lastPositionSeconds = lastPositionSeconds;

  const progress = await prisma.userProgress.upsert({
    where: {
      userId_courseId_lessonIndex: { userId: user.id, courseId, lessonIndex },
    },
    create: {
      userId: user.id,
      courseId,
      lessonIndex,
      completed: data.completed ?? false,
      lastPositionSeconds: data.lastPositionSeconds ?? 0,
    },
    update: data,
  });
  return NextResponse.json(progress);
}
