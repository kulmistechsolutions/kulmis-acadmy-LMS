import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const db = prisma;
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const requests = await db.studentRequest.findMany({
    where: { status: "PENDING" },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(requests);
}
