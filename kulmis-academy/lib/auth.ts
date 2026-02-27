import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export type Role = "student" | "admin";

export async function getCurrentUser() {
  if (!prisma) return null;

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId || typeof userId !== "string") return null;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user;
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) return null;
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return null;
  return user;
}
