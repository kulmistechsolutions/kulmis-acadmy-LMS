import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | null };

function createPrisma(): PrismaClient | null {
  if (!process.env.DATABASE_URL) return null;
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}

/** Only set when DATABASE_URL is defined; null otherwise (dashboard/auth will redirect to sign-in). */
export const prisma = createPrisma();
