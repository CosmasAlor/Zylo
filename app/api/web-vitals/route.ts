import { NextResponse } from "next/server";

type WebVitalMetric = {
  id: string;
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
};

export async function POST(request: Request) {
  const metric = (await request.json()) as WebVitalMetric;

  // In this phase we just acknowledge payloads. Replace with APM sink later.
  void metric;

  return NextResponse.json({ ok: true });
}
