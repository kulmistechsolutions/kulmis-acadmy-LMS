import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateCertificatePDF } from "@/lib/certificate-pdf";

/** GET: Download certificate PDF by certificateId (owner only) */
export async function GET(req: NextRequest) {
  if (!prisma) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const certificateId = req.nextUrl.searchParams.get("certificateId");
  if (!certificateId) {
    return NextResponse.json({ error: "certificateId is required" }, { status: 400 });
  }

  const cert = await prisma.certificate.findFirst({
    where: { certificateId, userId: user.id },
  });
  if (!cert) {
    return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
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
      "Cache-Control": "private, no-cache",
    },
  });
}
