import { getContent } from "@/lib/content";

import { LogoMarquee } from "./logo-marquee";

interface TrustedByData {
  badge?: string;
  stats?: { label: string; value: string }[];
}

type LogoMarqueeData = {
  title?: string;
  items?: string[];
};

export async function TrustedBySection({
  data: propData,
  logosData,
}: {
  data?: TrustedByData | null;
  logosData?: LogoMarqueeData | null;
} = {}) {
  const data = (propData || await getContent("trustedBy")) as TrustedByData || {
    badge: "Trusted by families across the community",
    stats: [
      { label: "Patient Retention", value: "94%" },
      { label: "Safety Protocols", value: "Grade A" },
      { label: "Sterilization", value: "WHO Std" },
      { label: "Response Time", value: "<15 Min" }
    ]
  };

  return (
    <section className="py-24 md:py-32">
      <div className="container-app mb-16">
        <p className="mb-6 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {data.badge}
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.isArray(data?.stats) && data.stats.map((item: { label: string; value: string }) => (
            <div
              key={item.label}
              className="group rounded-2xl border border-border/70 bg-card p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/30"
            >
              <p className="text-3xl font-bold tracking-tight text-primary transition-transform duration-300 group-hover:scale-110">
                {item.value}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
      
      <LogoMarquee data={logosData} />
    </section>
  );
}
