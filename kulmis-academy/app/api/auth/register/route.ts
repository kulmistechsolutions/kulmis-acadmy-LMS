import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";

const ADMIN_EMAILS = (process.env.NEXTAUTH_ADMIN_EMAILS ?? process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export async function POST(req: NextRequest) {
  if (!prisma) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() || null : null;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  const hashed = await hashPassword(password);
  const role = ADMIN_EMAILS.includes(email) ? "admin" : "student";

  const user = await prisma.user.create({
    data: { email, password: hashed, role, phone },
  });

  return NextResponse.json({
    id: user.id,
    email: user.email,
    message: "Account created. You can sign in now.",
  });
}
