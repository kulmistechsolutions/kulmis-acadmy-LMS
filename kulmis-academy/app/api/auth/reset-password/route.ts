import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export async function GET(req: NextRequest) {
  if (!prisma) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  const token = req.nextUrl.searchParams.get("token");
  if (!token || token.length < 32) {
    return NextResponse.json({ valid: false, error: "Invalid or missing token" });
  }
  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: { select: { email: true } } },
  });
  if (!record || record.expiresAt < new Date()) {
    return NextResponse.json({ valid: false, error: "Token expired or invalid" });
  }
  return NextResponse.json({ valid: true, email: record.user.email });
}

export async function POST(req: NextRequest) {
  if (!prisma) return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  const token = typeof body.token === "string" ? body.token.trim() : "";
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";
  const confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword : "";
  if (!token || token.length < 32) {
    return NextResponse.json({ error: "Invalid or missing token" }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }
  if (newPassword !== confirmPassword) {
    return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
  }
  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!record || record.expiresAt < new Date()) {
    return NextResponse.json({ error: "Token expired or invalid" }, { status: 400 });
  }
  const hashed = await hashPassword(newPassword);
  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { password: hashed } }),
    prisma.passwordResetToken.delete({ where: { id: record.id } }),
  ]);
  return NextResponse.json({ message: "Password updated. You can sign in now." });
}
