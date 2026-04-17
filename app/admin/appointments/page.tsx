import type { AppointmentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { AdminSignOutButton } from "@/modules/admin/components/admin-signout-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import {
  deleteAppointment,
  listAppointments,
  updateAppointmentStatus,
} from "@/modules/appointments/services/appointments";

type AdminPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: AppointmentStatus | "ALL";
  }>;
};

const statusOptions: Array<AppointmentStatus> = [
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
];

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const status = params.status && params.status !== "ALL" ? params.status : undefined;
  const query = params.q?.trim() || undefined;

  const appointments = await listAppointments({
    q: query,
    status,
    take: 200,
  });

  const totalAppointments = appointments.length;
  const confirmedCount = appointments.filter((item) => item.status === "CONFIRMED").length;
  const pendingCount = appointments.filter((item) => item.status === "PENDING").length;
  const completedCount = appointments.filter((item) => item.status === "COMPLETED").length;

  return (
    <main className="container-app py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Manage bookings, update statuses, and monitor appointment activity.
          </p>
        </div>
        <AdminSignOutButton />
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        <Card spacing="md">
          <CardDescription>Total Appointments</CardDescription>
          <CardTitle className="mt-1 text-3xl">{totalAppointments}</CardTitle>
        </Card>
        <Card spacing="md">
          <CardDescription>Pending</CardDescription>
          <CardTitle className="mt-1 text-3xl">{pendingCount}</CardTitle>
        </Card>
        <Card spacing="md">
          <CardDescription>Confirmed</CardDescription>
          <CardTitle className="mt-1 text-3xl">{confirmedCount}</CardTitle>
        </Card>
        <Card spacing="md">
          <CardDescription>Completed</CardDescription>
          <CardTitle className="mt-1 text-3xl">{completedCount}</CardTitle>
        </Card>
      </section>

      <section className="mt-8">
        <Card spacing="lg">
          <CardContent className="space-y-5 p-0">
            <form method="GET" className="grid gap-3 md:grid-cols-[1fr_220px_auto]">
              <input
                name="q"
                defaultValue={params.q ?? ""}
                placeholder="Search by name, phone, email, service"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              />
              <select
                name="status"
                defaultValue={params.status ?? "ALL"}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="ALL">All statuses</option>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <Button type="submit">Apply</Button>
            </form>

            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[900px] border-collapse text-sm">
                <thead className="bg-secondary/60 text-left">
                  <tr>
                    <th className="px-3 py-2 font-medium">Patient</th>
                    <th className="px-3 py-2 font-medium">Contact</th>
                    <th className="px-3 py-2 font-medium">Service</th>
                    <th className="px-3 py-2 font-medium">Preferred</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                    <th className="px-3 py-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 ? (
                    <tr>
                      <td className="px-3 py-8 text-center text-muted-foreground" colSpan={6}>
                        No appointments found.
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appointment) => (
                      <tr key={appointment.id} className="border-t border-border">
                        <td className="px-3 py-3">
                          <p className="font-medium">{appointment.fullName}</p>
                          {appointment.notes ? (
                            <p className="mt-1 text-xs text-muted-foreground">{appointment.notes}</p>
                          ) : null}
                        </td>
                        <td className="px-3 py-3">
                          <p>{appointment.phone}</p>
                          <p className="text-xs text-muted-foreground">
                            {appointment.email || "-"}
                          </p>
                        </td>
                        <td className="px-3 py-3">{appointment.service}</td>
                        <td className="px-3 py-3">
                          <p>{new Date(appointment.preferredDate).toLocaleDateString()}</p>
                          <p className="text-xs text-muted-foreground">
                            {appointment.preferredTime}
                          </p>
                        </td>
                        <td className="px-3 py-3">
                          <form
                            action={async (formData) => {
                              "use server";
                              const nextStatus = formData.get("status") as AppointmentStatus;
                              const id = formData.get("id") as string;
                              await updateAppointmentStatus(id, nextStatus);
                              revalidatePath("/admin");
                            }}
                            className="flex gap-2"
                          >
                            <input type="hidden" name="id" value={appointment.id} />
                            <select
                              name="status"
                              defaultValue={appointment.status}
                              className="rounded-lg border border-input bg-background px-2 py-1 text-xs"
                            >
                              {statusOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                            <Button type="submit" size="sm" variant="outline">
                              Save
                            </Button>
                          </form>
                        </td>
                        <td className="px-3 py-3">
                          <form
                            action={async (formData) => {
                              "use server";
                              const id = formData.get("id") as string;
                              await deleteAppointment(id);
                              revalidatePath("/admin");
                            }}
                          >
                            <input type="hidden" name="id" value={appointment.id} />
                            <Button type="submit" size="sm" variant="ghost">
                              Delete
                            </Button>
                          </form>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
