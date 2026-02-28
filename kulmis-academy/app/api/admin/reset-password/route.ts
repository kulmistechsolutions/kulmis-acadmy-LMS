import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { sendPasswordResetEmail, sendTemporaryPasswordEmail } from "@/lib/email";
import { randomBytes } from "crypto";

const TOKEN_EXPIRY_HOURS = 1;
const TOKEN_BYTES = 32;

function generateTemporaryPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let s = "";
  const bytes = randomBytes(12);
  for (let i = 0; i < 12; i++) s += chars[bytes[i]! % chars.length];
  return s;
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!prisma) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const body = await req.json().catch(() => ({}));
  const userId = typeof body.userId === "string" ? body.userId.trim() : "";
  const action = typeof body.action === "string" ? body.action : "send_email"; // "send_email" | "force_temp"
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (!user.password) {
    return NextResponse.json({ error: "User has no password set" }, { status: 400 });
  }

  if (action === "force_temp") {
    const tempPassword = generateTemporaryPassword();
    const hashed = await hashPassword(tempPassword);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    const sent = await sendTemporaryPasswordEmail(user.email, tempPassword);
    if (!sent) {
      return NextResponse.json(
        { error: "Password was reset but email failed to send. Share the temporary password via another channel." },
        { status: 500 }
      );
    }
    return NextResponse.json({
      message: "Temporary password has been set and emailed to the user.",
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
      { error: "Failed to send reset email. Check SMTP configuration." },
      { status: 500 }
    );
  }
  return NextResponse.json({
    message: "Password reset link has been sent to the user's email.",
  });
}
