"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  appointmentSchema,
  type AppointmentFormValues,
} from "@/modules/appointments/validations/appointment";

const serviceOptions = [
  "Advanced Diagnostics",
  "Cosmetic Artistry",
  "Implantology & Restorative",
  "Surgical Excellence",
  "Pediatric Mastery",
  "Orthodontics",
  "General Dentistry",
];

export function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      service: "",
      preferredDate: "",
      preferredTime: "",
      notes: "",
    },
  });

  const [minDate, setMinDate] = useState<string>("");

  useEffect(() => {
    setMinDate(new Date().toISOString().split("T")[0]);
  }, []);

  const onSubmit = async (values: AppointmentFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = (await response.json()) as {
        success: boolean;
        message: string;
      };

      if (!response.ok || !result.success) {
        toast.error(result.message || "Could not submit appointment request");
        import("@/modules/logs/services/logger").then(({ logger }) => logger.logWarning("Booking failed", "/api/appointments", { result, values }));
        return;
      }

      toast.success("Appointment submitted successfully");
      form.reset();
      
      import("@/modules/logs/services/logger").then(({ logger }) => logger.logEvent("Booking submitted", "/api/appointments", { service: values.service }));
    } catch (error) {
      toast.error("Unexpected error. Please try again.");
      import("@/modules/logs/services/logger").then(({ logger }) => logger.captureClientError(error as Error, undefined, "Booking form submit"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
      aria-label="Appointment booking form"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium">
            Full Name
          </label>
          <input
            id="fullName"
            {...form.register("fullName")}
            aria-invalid={!!form.formState.errors.fullName}
            aria-describedby="fullName-error"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
          <p id="fullName-error" className="text-xs text-destructive" role="alert">
            {form.formState.errors.fullName?.message}
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone
          </label>
          <input
            id="phone"
            {...form.register("phone")}
            aria-invalid={!!form.formState.errors.phone}
            aria-describedby="phone-error"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
          <p id="phone-error" className="text-xs text-destructive" role="alert">
            {form.formState.errors.phone?.message}
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email (optional)
          </label>
          <input
            id="email"
            type="email"
            {...form.register("email")}
            aria-invalid={!!form.formState.errors.email}
            aria-describedby="email-error"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
          <p id="email-error" className="text-xs text-destructive" role="alert">
            {form.formState.errors.email?.message}
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="service" className="text-sm font-medium">
            Service
          </label>
          <select
            id="service"
            {...form.register("service")}
            aria-invalid={!!form.formState.errors.service}
            aria-describedby="service-error"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select a service</option>
            {serviceOptions.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
          <p id="service-error" className="text-xs text-destructive" role="alert">
            {form.formState.errors.service?.message}
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="preferredDate" className="text-sm font-medium">
            Preferred Date
          </label>
          <input
            id="preferredDate"
            type="date"
            min={minDate}
            {...form.register("preferredDate")}
            aria-invalid={!!form.formState.errors.preferredDate}
            aria-describedby="preferredDate-error"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
          <p id="preferredDate-error" className="text-xs text-destructive" role="alert">
            {form.formState.errors.preferredDate?.message}
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="preferredTime" className="text-sm font-medium">
            Preferred Time
          </label>
          <input
            id="preferredTime"
            type="time"
            {...form.register("preferredTime")}
            aria-invalid={!!form.formState.errors.preferredTime}
            aria-describedby="preferredTime-error"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
          <p id="preferredTime-error" className="text-xs text-destructive" role="alert">
            {form.formState.errors.preferredTime?.message}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          rows={4}
          {...form.register("notes")}
          aria-invalid={!!form.formState.errors.notes}
          aria-describedby="notes-error"
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
        />
        <p id="notes-error" className="text-xs text-destructive" role="alert">
          {form.formState.errors.notes?.message}
        </p>
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="h-12 w-full rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary/90 md:w-auto md:px-12"
      >
        {isSubmitting ? "Processing Request..." : "Confirm My Appointment"}
      </Button>
    </form>
  );
}
