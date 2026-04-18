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

const defaultTestimonials: TestimonialsData = {
  badge: "Patient Experience",
  title: "Patient Stories from Juba",
  description:
    "Real experiences from families who trust Zylo for their clinical excellence and gentle care.",
  items: [
    {
      name: "Amira Hassan",
      role: "Teacher",
      text: "Dr. Zahir and his team provided exceptional care during my root canal. I was terrified, but their compassion made all the difference. The facility is modern and spotlessly clean.",
      rating: 5,
    },
    {
      name: "Ibrahim Osman",
      role: "Business Owner",
      text: "I've been coming to Zylo for three years now. The professionalism and attention to detail is unmatched. My teeth have never looked better, and I feel confident in my smile again.",
      rating: 5,
    },
    {
      name: "Leila Mohamed",
      role: "Healthcare Professional",
      text: "As a medical professional myself, I appreciate the evidence-based approach Zylo takes to dental care. They explain everything clearly and never rush treatment.",
      rating: 5,
    },
    {
      name: "Karim Abdurahman",
      role: "Student",
      text: "Got my braces adjusted today and the experience was painless. The staff is friendly and the environment is comfortable. Highly recommend!",
      rating: 5,
    },
    {
      name: "Fatima Ali",
      role: "Homemaker",
      text: "My family has been patients here for over 5 years. The consistent quality and genuine care they show for their patients is remarkable. Thank you, Zylo!",
      rating: 5,
    },
  ],
};

export async function TestimonialsSection() {
  const data = (await getContent("testimonials")) as TestimonialsData | null;
  const testimonialData = data || defaultTestimonials;

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden border-y border-border/70 bg-card/30 py-24 md:py-32"
    >
      {/* Decorative background elements */}
      <div className="absolute top-1/4 -left-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

      <div className="container-app relative">
        <SectionHeader
          center
          badge={testimonialData.badge || "The Patient Experience"}
          title={testimonialData.title ?? "Patient Stories from Juba"}
          description={
            testimonialData.description ??
            "Real experiences from families who trust Zylo for their clinical excellence and gentle care."
          }
          className="mb-16"
        />

        <div className="mx-auto w-full">
          <TestimonialCarousel items={testimonialData.items ?? []} />
        </div>
      </div>
    </section>
  );
}
