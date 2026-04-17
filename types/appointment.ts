export interface PatientInfo {
  fullName: string;
  phone: string;
  email?: string | null;
}

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export type PaymentStatus = "UNPAID" | "PARTIAL" | "PAID" | "REFUNDED";

export interface AppointmentSlot {
  preferredDate: Date;
  preferredTime: string;
}

export interface AppointmentData extends PatientInfo, AppointmentSlot {
  id: string;
  service: string;
  notes?: string | null;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
}
