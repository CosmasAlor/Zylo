import { TestimonialCarousel } from "@/components/sections/testimonial-carousel";
import { SectionHeader } from "@/components/sections/section-header";
import { getContent } from "@/lib/content";

interface TestimonialsData {
  badge?: string;
  title?: string;
  description?: string;
  items?: Array<{
    name: string;
    role?: string;
    text?: string;
    quote?: string;
    rating: number;
  }>;
}

export async function TestimonialsSection() {
  const data = (await getContent("testimonials")) as TestimonialsData | null || {
    badge: "Patient Experience",
    title: "Patient Stories from Juba",
    description: "Real experiences from families who trust Zylo for their clinical excellence and gentle care.",
    items: []
  };

  return (
    <section id="testimonials" className="relative overflow-hidden border-y border-border/70 bg-card/30 py-24 md:py-32">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 -left-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

      <div className="container-app relative">
        <SectionHeader
          center
          badge={data.badge || "The Patient Experience"}
          title={data.title ?? "Patient Stories from Juba"}
          description={data.description ?? "Real experiences from families who trust Zylo for their clinical excellence and gentle care."}
          className="mb-16"
        />

        <div className="mx-auto w-full">
          <TestimonialCarousel items={data.items ?? []} />
        </div>
      </div>
    </section>
  );
}
