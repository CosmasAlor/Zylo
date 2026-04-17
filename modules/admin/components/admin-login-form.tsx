"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

type AdminLoginFormProps = {
  initialError?: boolean;
};

export function AdminLoginForm({ initialError = false }: AdminLoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState(initialError);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setError(false);
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") ?? "");
        const password = String(formData.get("password") ?? "");

        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
          callbackUrl: "/admin",
        });

        if (result?.error) {
          setError(true);
          setIsSubmitting(false);
          return;
        }

        router.push("/admin");
        router.refresh();
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      {error ? (
        <p className="text-sm text-destructive">Invalid credentials. Please try again.</p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
