import auth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { env } from "@/lib/env";

const authConfig = auth({
  secret: env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes session timeout for security
    updateAge: 15 * 60, // Update session every 15 minutes
  },
  // Add CSRF protection
  useSecureCookies: process.env.NODE_ENV === "production",
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
});

export const { handlers, signIn, signOut, auth: authInstance } = authConfig;
export const authOptions = authConfig;
export { authInstance as auth };
