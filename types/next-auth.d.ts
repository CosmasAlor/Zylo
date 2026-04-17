import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role?: "ADMIN" | "STAFF";
    };
  }

  interface User {
    role?: "ADMIN" | "STAFF";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "ADMIN" | "STAFF";
  }
}
