import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateCertificatePDF } from "@/lib/certificate-pdf";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  if (!prisma) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const courseId = typeof body.courseId === "string" ? body.courseId : "";
  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  const courseTitle = typeof body.courseTitle === "string" ? body.courseTitle : "Course";
  const studentId = typeof body.studentId === "string" ? body.studentId.trim() || null : null;

  if (!courseId || !fullName) {
    return NextResponse.json(
      { error: "courseId and fullName are required" },
      { status: 400 }
    );
  }

  const totalLessons = await prisma.userProgress.count({
    where: { userId: user.id, courseId },
  });
  const completedCount = await prisma.userProgress.count({
    where: { userId: user.id, courseId, completed: true },
  });

  if (totalLessons === 0 || completedCount !== totalLessons) {
    return NextResponse.json(
      { error: "Course must be 100% complete to generate a certificate" },
      { status: 403 }
    );
  }

  let cert = await prisma.certificate.findFirst({
    where: { userId: user.id, courseId },
  });

  const completionDate = cert?.completionDate ?? new Date();
  const certificateId = cert?.certificateId ?? randomUUID();

  if (!cert) {
    cert = await prisma.certificate.create({
      data: {
        certificateId,
        userId: user.id,
        courseId,
        courseTitle,
        fullName,
        studentId,
        completionDate,
      },
    });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_URL ||
    "http://localhost:3000";
  const verifyUrl = `${baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`}/verify/${cert.certificateId}`;

  const pdfBytes = await generateCertificatePDF({
    fullName: cert.fullName,
    courseTitle: cert.courseTitle,
    completionDate: cert.completionDate,
    certificateId: cert.certificateId,
    verifyUrl,
  });

  const pdfBuffer = new Uint8Array(pdfBytes);
  return new NextResponse(new Blob([pdfBuffer], { type: "application/pdf" }), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Kulmis-Academy-Certificate-${cert.certificateId}.pdf"`,
      "X-Certificate-Id": cert.certificateId,
      "Cache-Control": "private, no-cache",
    },
  });
}
