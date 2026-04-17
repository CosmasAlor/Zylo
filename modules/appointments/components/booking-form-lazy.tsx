"use client";

import dynamic from "next/dynamic";

const LazyBookingForm = dynamic(
  () => import("@/modules/appointments/components/booking-form").then((mod) => mod.BookingForm),
  {
    ssr: false,
    loading: () => <p className="text-sm text-muted-foreground">Loading form...</p>,
  },
);

export function BookingFormLazy() {
  return <LazyBookingForm />;
}
