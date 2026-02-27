import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  if (!prisma) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const requests = await prisma.studentRequest.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(requests);
}

export async function POST(req: NextRequest) {
  if (!prisma) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (user.isPro) return NextResponse.json({ error: "Already Pro" }, { status: 400 });

  const pending = await prisma.studentRequest.findFirst({
    where: { userId: user.id, type: "PRO_ACCESS", status: "PENDING" },
  });
  if (pending) return NextResponse.json({ error: "Request already pending" }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const message = typeof body.message === "string" ? body.message : null;
  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : null;
  const phone = typeof body.phone === "string" ? body.phone.trim() : null;
  const paymentNumber = typeof body.paymentNumber === "string" ? body.paymentNumber.trim() : null;
  const proofImageUrl = typeof body.proofImageUrl === "string" ? body.proofImageUrl.trim() : null;

  if (!fullName || !phone || !paymentNumber || !proofImageUrl) {
    return NextResponse.json(
      { error: "Full name, phone, payment number, and proof image are required" },
      { status: 400 }
    );
  }

  const request = await prisma.studentRequest.create({
    data: {
      userId: user.id,
      type: "PRO_ACCESS",
      message: message || null,
      fullName: fullName || null,
      phone: phone || null,
      paymentNumber: paymentNumber || null,
      proofImageUrl: proofImageUrl || null,
    },
  });
  return NextResponse.json(request);
}
