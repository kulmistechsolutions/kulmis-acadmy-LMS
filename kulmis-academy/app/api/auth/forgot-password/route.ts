import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import { randomBytes } from "crypto";

const TOKEN_EXPIRY_HOURS = 1;
const TOKEN_BYTES = 32;

export async function POST(req: NextRequest) {
  if (!prisma) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({
      message: "If an account exists with this email, you will receive a reset link shortly.",
    });
  }
  if (!user.password) {
    return NextResponse.json({
      message: "If an account exists with this email, you will receive a reset link shortly.",
    });
  }

  const recent = await prisma.passwordResetToken.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  if (recent && recent.createdAt && Date.now() - recent.createdAt.getTime() < 2 * 60 * 1000) {
    return NextResponse.json({
      message: "If an account exists with this email, you will receive a reset link shortly.",
    });
  }

  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
  const token = randomBytes(TOKEN_BYTES).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);
  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetLink = `${baseUrl}/reset-password?token=${token}`;
  const sent = await sendPasswordResetEmail(user.email, resetLink);
  if (!sent) {
    return NextResponse.json(
      { error: "Failed to send email. Please try again later or contact support." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "If an account exists with this email, you will receive a reset link shortly.",
  });
}
