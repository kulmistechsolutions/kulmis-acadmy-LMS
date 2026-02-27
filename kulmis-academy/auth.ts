import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/password";

const authSecret = process.env.AUTH_SECRET;
if (!authSecret && process.env.NODE_ENV !== "test") {
  console.error(
    "[Auth] AUTH_SECRET is not set. Add AUTH_SECRET to .env.local (e.g. run: npx auth secret)"
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: authSecret || undefined,
  trustHost: true,
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const { prisma } = await import("@/lib/db");
          if (!prisma) return null;
          const email = String(credentials.email).trim().toLowerCase();
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user || !user.password) return null;
          const ok = await verifyPassword(String(credentials.password), user.password);
          if (!ok) return null;
          return {
            id: user.id,
            email: user.email,
            name: user.email,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
});
