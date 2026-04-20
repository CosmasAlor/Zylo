import type { Metadata } from "next";
import { Navbar } from "@/components/sections/navbar";
import { FooterSection } from "@/components/sections/footer-section";
import { ContactForm } from "@/modules/contact/components/contact-form";
import { getContent } from "@/lib/content";
import { MapPin, Phone, Mail, Clock, MessageSquare } from "lucide-react";
import { MotionReveal } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "Contact Us | Zylo Dental Clinic Juba",
  description: "Get in touch with Zylo Dental Clinic in Juba, South Sudan. Find our location, contact details, and send us a message.",
};

export default async function ContactPage() {
  const [navbarData, siteData, footerData] = await Promise.all([
    getContent("navbar"),
    getContent("site"),
    getContent("footer"),
  ]);

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <Navbar
        data={navbarData && typeof navbarData === "object" && !Array.isArray(navbarData) ? (navbarData as any) : undefined}
        siteData={siteData && typeof siteData === "object" && !Array.isArray(siteData) ? (siteData as any) : undefined}
      />

      <main className="flex-grow pt-32 pb-24 md:pt-44 md:pb-32 relative overflow-hidden">
        {/* Abstract background orbs */}
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 bottom-24 h-96 w-96 rounded-full bg-accent/10 blur-[120px]" />

        <div className="container-app relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <MotionReveal>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-4">
                Let's Connect
              </span>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Your Smile's Next Chapter <span className="text-primary italic">Starts Here.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mt-6">
                Whether you have a question about our treatments, pricing, or just want to say hello, we're here for you. Reach out through any of the channels below.
              </p>
            </MotionReveal>
          </div>

          <div className="grid gap-16 lg:grid-cols-12 items-start">
            {/* Contact Information */}
            <div className="lg:col-span-5 space-y-12">
              <MotionReveal delay={0.1} className="grid gap-8">
                <ContactInfoItem 
                  icon={MapPin} 
                  title="Visit Our Clinic"
                  content={<>Central Thongping, Near UNMISS HQ,<br />Juba, South Sudan</>}
                  link="https://share.google/dazDN1mUm5mykP1DK"
                  linkText="Open in Google Maps"
                />
                
                <ContactInfoItem 
                  icon={Phone} 
                  title="Call Us Directly"
                  content={<>+211 925 603 404<br />+211 980 083 781 (WhatsApp)</>}
                  link="tel:+211925603404"
                  linkText="Tap to call now"
                />

                <ContactInfoItem 
                  icon={Mail} 
                  title="Email Us"
                  content={<>contact@zylodental.com<br />appointments@zylodental.com</>}
                  link="mailto:contact@zylodental.com"
                  linkText="Send an email"
                />

                <ContactInfoItem 
                  icon={Clock} 
                  title="Clinic Hours"
                  content={<>Mon - Fri: 8:00 AM - 7:00 PM<br />Sat - Sun: 9:00 AM - 4:00 PM</>}
                />
              </MotionReveal>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <MotionReveal delay={0.2}>
                <ContactForm />
              </MotionReveal>
            </div>
          </div>
        </div>
      </main>

      <FooterSection
        data={footerData && typeof footerData === "object" && !Array.isArray(footerData) ? (footerData as any) : undefined}
        siteData={siteData && typeof siteData === "object" && !Array.isArray(siteData) ? (siteData as any) : undefined}
      />
    </div>
  );
}

function ContactInfoItem({ 
  icon: Icon, 
  title, 
  content, 
  link, 
  linkText 
}: { 
  icon: any, 
  title: string, 
  content: React.ReactNode, 
  link?: string, 
  linkText?: string 
}) {
  return (
    <div className="flex gap-6 group">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-primary shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold tracking-tight">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">
          {content}
        </p>
        {link && (
          <a href={link} target="_blank" rel="noopener noreferrer" className="inline-block text-sm font-semibold text-primary/80 hover:text-primary transition-colors underline-offset-4 hover:underline">
            {linkText}
          </a>
        )}
      </div>
    </div>
  );
}
