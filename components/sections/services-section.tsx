import { HeartPulse, Smile, Sun, Stethoscope, Baby, Syringe, Sparkles, ShieldCheck } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { MotionReveal } from "@/components/ui/motion";
import { SectionHeader } from "@/components/sections/section-header";
import { getContent } from "@/lib/content";

const iconMap: Record<string, React.ElementType> = {
  HeartPulse,
  Smile,
  Sun,
  Stethoscope,
  Baby,
  Syringe,
  Sparkles,
  ShieldCheck,
};

interface ServiceItem {
  title: string;
  description: string;
  icon: string;
}

interface ServicesData {
  badge?: string;
  title?: string;
  description?: string;
  items?: ServiceItem[];
}

export async function ServicesSection() {
  const data = (await getContent("services")) as ServicesData | null || {
    badge: "Our Services",
    title: "Complete dental care under one roof.",
    description: "From routine check-ups to advanced restorative procedures — we've got every smile covered.",
    items: [
      {
        title: "General Dentistry",
        description: "Comprehensive exams, cleanings, fillings, and preventive care to keep your smile healthy year-round.",
        icon: "Stethoscope",
      },
      {
        title: "Cosmetic Dentistry",
        description: "Teeth whitening, porcelain veneers, and smile makeovers crafted for natural, radiant results.",
        icon: "Smile",
      },
      {
        title: "Orthodontics",
        description: "Clear aligners and modern braces for a straighter smile — comfortable options for teens and adults.",
        icon: "Sun",
      },
      {
        title: "Dental Implants",
        description: "Permanent tooth replacement with titanium implants that look, feel, and function like natural teeth.",
        icon: "Syringe",
      },
      {
        title: "Pediatric Dentistry",
        description: "Gentle, fun dental care for children in a warm environment that puts little ones at ease.",
        icon: "Baby",
      },
      {
        title: "Emergency Care",
        description: "Same-day appointments for toothaches, broken teeth, and urgent dental issues when you need us most.",
        icon: "HeartPulse",
      },
    ]
  };

  return (
    <section id="services" className="py-24 md:py-32">
      <div className="container-app space-y-12">
        <SectionHeader
          center
          badge={data.badge}
          title={data.title ?? "Complete dental care under one roof."}
          description={data.description ?? "From routine check-ups to advanced restorative procedures, we've got every smile covered."}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(data?.items) && data.items.map((item: ServiceItem, index: number) => {
            const Icon = iconMap[item.icon] || Stethoscope;
            return (
              <MotionReveal key={item.title} delay={index * 0.05}>
                <Card className="group relative h-full overflow-hidden rounded-3xl border border-border/70 bg-background/50 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5">
                  <div className="absolute top-0 right-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full bg-primary/5 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />
                  
                  <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-all duration-500 group-hover:scale-110 group-hover:bg-accent group-hover:text-white">
                    <Icon className="h-7 w-7" />
                  </div>
                  
                  <CardTitle className="relative text-xl font-bold tracking-tight">
                    {item.title}
                  </CardTitle>
                  
                  <CardDescription className="relative mt-4 text-sm leading-relaxed">
                    {item.description}
                  </CardDescription>

                  <div className="mt-8 flex items-center text-xs font-semibold text-primary/0 transition-all duration-300 group-hover:text-primary">
                    Learn more →
                  </div>
                </Card>
              </MotionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
