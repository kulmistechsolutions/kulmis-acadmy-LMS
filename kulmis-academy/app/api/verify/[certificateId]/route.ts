import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  if (!prisma) return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  const { certificateId } = await params;
  const cert = await prisma.certificate.findUnique({
    where: { certificateId },
  });
  if (!cert) return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
  return NextResponse.json({
    certificateId: cert.certificateId,
    fullName: cert.fullName,
    courseTitle: cert.courseTitle,
    completionDate: cert.completionDate.toISOString(),
    createdAt: cert.createdAt.toISOString(),
  });
}
