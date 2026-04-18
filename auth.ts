import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { env } from "@/lib/env";

export const authOptions: NextAuthOptions = {
  secret: env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 3 * 60 * 60, // 3 hours default session
    updateAge: 24 * 60 * 60, // 24 hours
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;

        if (!email || !password) {
          return null;
        }

        if (email === env.ADMIN_EMAIL && password === env.ADMIN_PASSWORD) {
          return {
            id: "admin",
            name: "Zylo Admin",
            email: env.ADMIN_EMAIL,
            role: "ADMIN",
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "ADMIN" | "STAFF" | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
};
