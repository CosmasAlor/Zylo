"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // Keep the audit signal lightweight and only in production.
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    void fetch("/api/web-vitals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(metric),
    });
  });

  return null;
}
