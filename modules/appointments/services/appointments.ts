import type { Appointment, AppointmentStatus, Prisma } from "@prisma/client";

import { toDatabaseError } from "@/lib/db/errors";
import { db } from "@/lib/db/prisma";

export type CreateAppointmentInput = {
  fullName: string;
  phone: string;
  email?: string | null;
  service: string;
  preferredDate: Date;
  preferredTime: string;
  notes?: string | null;
};

export async function createAppointment(input: CreateAppointmentInput) {
  try {
    return await db.appointment.create({
      data: input,
    });
  } catch (error) {
    throw toDatabaseError(error, "Failed to create appointment");
  }
}

export async function listAppointments(params?: {
  status?: AppointmentStatus;
  q?: string;
  take?: number;
}) {
  const where: Prisma.AppointmentWhereInput = {
    ...(params?.status ? { status: params.status } : {}),
    ...(params?.q
      ? {
          OR: [
            { fullName: { contains: params.q, mode: "insensitive" } },
            { phone: { contains: params.q, mode: "insensitive" } },
            { email: { contains: params.q, mode: "insensitive" } },
            { service: { contains: params.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  try {
    return await db.appointment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: params?.take ?? 50,
    });
  } catch (error) {
    throw toDatabaseError(error, "Failed to list appointments");
  }
}

export async function getAppointmentById(id: string): Promise<Appointment | null> {
  try {
    return await db.appointment.findUnique({
      where: { id },
    });
  } catch (error) {
    throw toDatabaseError(error, "Failed to get appointment");
  }
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
) {
  try {
    return await db.appointment.update({
      where: { id },
      data: { status },
    });
  } catch (error) {
    throw toDatabaseError(error, "Failed to update appointment status");
  }
}

export async function deleteAppointment(id: string) {
  try {
    return await db.appointment.delete({
      where: { id },
    });
  } catch (error) {
    throw toDatabaseError(error, "Failed to delete appointment");
  }
}
