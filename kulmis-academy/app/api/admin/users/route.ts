import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const db = prisma;
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      phone: true,
      role: true,
      isPro: true,
      createdAt: true,
      _count: { select: { requests: true } },
    },
  });

  const serialized = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));

  return NextResponse.json(serialized);
}
