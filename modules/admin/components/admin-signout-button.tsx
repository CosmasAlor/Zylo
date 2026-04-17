"use client";

import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function AdminSignOutButton() {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => {
        void signOut({ callbackUrl: "/admin/login" });
      }}
    >
      Sign out
    </Button>
  );
}
