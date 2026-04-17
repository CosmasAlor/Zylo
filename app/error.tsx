"use client";

import { useEffect } from "react";
import { logger } from "@/modules/logs/services/logger";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.captureClientError(error, { digest: error.digest }, "Global Router Boundary");
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center space-y-4">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
        Something went wrong!
      </h2>
      <p className="text-muted-foreground opacity-80 max-w-md">
        An unexpected error occurred. We&apos;ve been notified. Please try again later.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity font-medium shadow-sm hover:shadow"
      >
        Try again
      </button>
    </div>
  );
}
