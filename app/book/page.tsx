export const dynamic = "force-dynamic";

import type { Metadata } from "next";

import { BookingForm } from "@/modules/appointments/components/booking-form";
import { Navbar } from "@/components/sections/navbar";
import { FooterSection } from "@/components/sections/footer-section";
import { buildMetadata } from "@/lib/seo";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const siteData = (await getContent("site")) as { siteName?: string } | null;
  return buildMetadata({
    title: `Book an Appointment - ${siteData?.siteName || "Zylo Dental Clinic"}`,
    description: `Schedule your next dental check-up or service at ${siteData?.siteName || "Zylo Dental Clinic"}.`,
  });
}

export default async function BookAppointmentPage() {
  const [navbarData, siteData] = await Promise.all([
    getContent("navbar"),
    getContent("site")
  ]);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <Navbar
        data={navbarData && typeof navbarData === "object" && !Array.isArray(navbarData) ? navbarData : undefined}
        siteData={siteData && typeof siteData === "object" && !Array.isArray(siteData) ? siteData : undefined}
      />
      <main className="container-app py-20">
        <div className="mx-auto max-w-2xl">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-primary md:text-5xl">
              Book an Appointment
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Fill out the form below to schedule your visit. We&apos;ll get in touch to confirm your appointment.
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm md:p-8">
            <BookingForm />
          </div>
        </div>
      </main>
      <FooterSection
        siteData={siteData && typeof siteData === "object" && !Array.isArray(siteData) ? siteData : undefined}
      />
    </div>
  );
}
