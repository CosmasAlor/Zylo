import { NextResponse } from "next/server";

import { createAppointment } from "../services/appointments";
import {
  appointmentSchema,
  type AppointmentFormValues,
} from "../validations/appointment";

import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!rateLimit(ip, 5, 60000)) {
      return NextResponse.json({ success: false, message: "Too many requests. Please try again later." }, { status: 429 });
    }

    const payload = (await request.json()) as AppointmentFormValues;
    const parsed = appointmentSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const appointment = await createAppointment({
      ...parsed.data,
      email: parsed.data.email || null,
      notes: parsed.data.notes || null,
      preferredDate: new Date(parsed.data.preferredDate),
    });

    return NextResponse.json({
      success: true,
      message: "Appointment request submitted successfully",
      data: appointment,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit appointment request at this moment.",
      },
      { status: 500 },
    );
  }
}
