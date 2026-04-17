"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Attempt dynamic import of our logger logic without causing a secondary crash
    import("@/modules/logs/services/logger")
      .then(({ logger }) => logger.captureClientError(error, { digest: error.digest }, "Global Critical Root Boundary"))
      .catch(console.error);
  }, [error]);

  const handleHardRefresh = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="mx-auto max-w-lg text-center p-8 border rounded-xl bg-card shadow-sm">
          <h1 className="text-3xl font-extrabold text-destructive mb-4">Critical System Error</h1>
          <p className="text-muted-foreground mb-6">
            The application encountered an irrecoverable state. Our support team has been automatically pinged. If you need immediate assistance, please contact us at: 
            <br/><br/>
            <strong>+211 925 603 404</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleHardRefresh} className="rounded-xl shadow-lg">
              Hard Reload Systems
            </Button>
            <Button variant="outline" onClick={() => reset()} className="rounded-xl">
              Soft Retry
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
