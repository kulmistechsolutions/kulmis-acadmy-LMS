import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

/** GET: Check if user can claim certificate (100% complete) and if one already exists */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  if (!prisma) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { courseId } = await params;
  const totalLessons = await prisma.userProgress.count({
    where: { userId: user.id, courseId },
  });
  const completedCount = await prisma.userProgress.count({
    where: { userId: user.id, courseId, completed: true },
  });
  const canClaim = totalLessons > 0 && completedCount === totalLessons;

  const existing = await prisma.certificate.findFirst({
    where: { userId: user.id, courseId },
  });

  return NextResponse.json({
    canClaim,
    completedCount,
    totalLessons,
    percent: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0,
    alreadyIssued: !!existing,
    certificateId: existing?.certificateId ?? null,
  });
}
