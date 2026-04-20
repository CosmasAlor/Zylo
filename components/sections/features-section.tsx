import { CalendarClock, Clock, ShieldCheck, Sparkles, MapPin, Smile } from "lucide-react";
import { MotionReveal } from "@/components/ui/motion";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/sections/section-header";
import { getContent } from "@/lib/content";

const iconMap: Record<string, React.ElementType> = {
  CalendarClock,
  Clock,
  ShieldCheck,
  Sparkles,
  MapPin,
  Smile,
};

interface FeatureItem {
  title: string;
  description: string;
  icon: string;
}

interface FeaturesData {
  badge?: string;
  title?: string;
  description?: string;
  items?: FeatureItem[];
}

export async function FeaturesSection() {
  const data = (await getContent("features")) as FeaturesData | null || {
    badge: "Why Patients Choose Us",
    title: "A dental experience designed around your comfort.",
    description: "From the moment you walk in to the follow-up call after your visit — every detail is intentional.",
    items: [
      {
        title: "Easy Online Booking",
        description: "Schedule your appointment in seconds — pick your service, choose a time, and get instant confirmation.",
        icon: "CalendarClock",
      },
      {
        title: "Minimal Wait Times",
        description: "We respect your schedule. Our streamlined workflow means you're seen on time, every time.",
        icon: "Clock",
      },
      {
        title: "Advanced Sterilization",
        description: "Hospital-grade sterilization protocols and single-use instruments for your complete peace of mind.",
        icon: "ShieldCheck",
      },
      {
        title: "Latest Technology",
        description: "Digital X-rays, intraoral scanners, and laser dentistry — modern tools for precise, painless care.",
        icon: "Sparkles",
      },
    ]
  };

  return (
    <section id="features" className="py-24 md:py-32">
      <div className="container-app space-y-12">
        <SectionHeader
          center
          badge={data.badge}
          title={data.title ?? "A dental experience designed around your comfort."}
          description={data.description ?? "From the moment you walk in to the follow-up call after your visit, every detail is intentional."}
        />

        <div className="grid gap-4 md:grid-cols-2">
          {Array.isArray(data?.items) && data.items.map((feature: FeatureItem, index: number) => {
            const Icon = iconMap[feature.icon] || Sparkles;
            return (
              <MotionReveal key={feature.title} delay={index * 0.05}>
                <Card className="group h-full rounded-2xl border border-border/70 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="mt-3">
                    {feature.description}
                  </CardDescription>
                </Card>
              </MotionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
