import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getContent } from "@/lib/content";

interface CtaData {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  ctaSecondaryLabel?: string;
  phone?: string;
}

export async function CtaSection() {
  const data = (await getContent("cta")) as CtaData | null || {
    title: "Step Into the Future of Dentistry — in Juba",
    subtitle: "⏳ Ramadan notice: Limited appointments available to ensure the highest quality of individual care.",
    ctaLabel: "Initiate Consultation (WhatsApp)",
    ctaHref: "https://wa.me/211980083781",
    ctaSecondaryLabel: "Call Juba +211 925 603 404",
    phone: "+211925603404"
  };

  return (
    <section id="cta" className="py-20 md:py-24">
      <div className="container-app">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-accent/80 px-6 py-16 text-primary-foreground shadow-xl shadow-primary/20 md:px-12">
          {/* Decorative shapes */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
          <div className="pointer-events-none absolute -left-12 bottom-0 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

          <div className="relative mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
              {data.title}
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              {data.subtitle || data.description}
            </p>
            
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="rounded-xl bg-white text-primary font-bold shadow-lg hover:bg-white/90"
              >
                <a href={data.ctaHref || "#"}>
                  <MessageCircle className="mr-2 h-5 w-5" />
                  {data.ctaLabel}
                </a>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-xl border-white/40 bg-white/10 text-white font-bold backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:border-white/60"
              >
                <Link href="/book">
                  Schedule via Form
                </Link>
              </Button>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
