import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  if (!prisma) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { requestId } = await params;
  const body = await _req.json().catch(() => ({}));
  const action = body.action; // "approve" | "reject"
  const adminNote = typeof body.adminNote === "string" ? body.adminNote : null;

  if (action !== "approve" && action !== "reject") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const studentRequest = await prisma.studentRequest.findUnique({
    where: { id: requestId },
    include: { user: true },
  });
  if (!studentRequest) return NextResponse.json({ error: "Request not found" }, { status: 404 });
  if (studentRequest.status !== "PENDING") {
    return NextResponse.json({ error: "Request already reviewed" }, { status: 400 });
  }

  if (action === "approve") {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: studentRequest.userId },
        data: { isPro: true },
      }),
      prisma.studentRequest.update({
        where: { id: requestId },
        data: {
          status: "APPROVED",
          reviewedAt: new Date(),
          reviewedBy: admin.id,
          adminNote,
        },
      }),
    ]);
  } else {
    await prisma.studentRequest.update({
      where: { id: requestId },
      data: {
        status: "REJECTED",
        reviewedAt: new Date(),
        reviewedBy: admin.id,
        adminNote,
      },
    });
  }

  const updated = await prisma.studentRequest.findUnique({
    where: { id: requestId },
    include: { user: true },
  });
  return NextResponse.json(updated);
}
