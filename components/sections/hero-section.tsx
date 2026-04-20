import Link from "next/link";
import Image from "next/image";
import { MotionReveal } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { getContent } from "@/lib/content";
import { LogoMarquee } from "@/components/sections/logo-marquee";

interface HeroData {
  badge?: string;
  titleNormal?: string;
  titleAccent?: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  illustrationImage?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
  stats?: { label: string; value: string }[];
}

export async function HeroSection() {
  const data = (await getContent("hero")) as HeroData | null || {
    badge: "The New Benchmark of Clinical Excellence in Juba",
    titleNormal: "Elevating the Art of a",
    titleAccent: "Perfect Smile",
    subtitle: "Experience world-class dental care in a state-of-the-art facility located in central Thongping.",
    ctaPrimary: "Reserve Your Visit",
    ctaSecondary: "Explore Treatments",
    stats: [
      { label: "Clinical Safety", value: "Grade A" },
      { label: "Successful Procedures", value: "8,500+" },
      { label: "Patient Satisfaction", value: "94%" }
    ]
  };

  return (
    <section className="relative overflow-hidden pt-24 pb-12 md:pt-36 md:pb-24">
      {/* Background image if provided */}
      {data.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={data.backgroundImage}
            alt="Hero background"
            fill
            className="object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-accent/15 blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />

      <div className="container-app relative grid items-center gap-16 lg:grid-cols-2 mb-20 md:mb-32">
        <MotionReveal className="space-y-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-accent-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
            {data.badge}
          </p>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            {data.titleNormal}{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {data.titleAccent}
            </span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {data.subtitle || data.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="rounded-xl shadow-lg shadow-primary/20">
              <Link href="/book">{data.ctaPrimary}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-xl">
              <a href="tel:+211925603404">{data.ctaSecondary}</a>
            </Button>
          </div>

          {/* Mini trust badges */}
          <div className="flex flex-wrap items-center gap-6 pt-4">
            {Array.isArray(data?.stats) && data.stats.map((stat: { label: string; value: string }, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">{stat.value}</span>
                <span className="text-xs text-muted-foreground leading-tight">{stat.label}</span>
                {i < (data.stats?.length || 0) - 1 && <div className="ml-4 h-8 w-px bg-border hidden sm:block" />}
              </div>
            ))}
          </div>
        </MotionReveal>

        <MotionReveal delay={0.15} className="relative">
          {/* Decorative card with dental illustration */}
          <div className="relative rounded-3xl border border-border/70 bg-gradient-to-br from-card via-card to-secondary/30 p-8 shadow-xl shadow-primary/5">
            {data.illustrationImage ? (
              <Image
                src={data.illustrationImage}
                alt="Dental illustration"
                width={400}
                height={360}
                className="mx-auto w-full max-w-sm"
                onError={(e) => {
                  const imgElement = e.target as HTMLImageElement;
                  imgElement.style.display = 'none';
                  // Show fallback SVG
                  const container = imgElement.parentElement;
                  const fallback = container?.querySelector('.fallback-svg') as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
            ) : null}
            <svg viewBox="0 0 400 360" fill="none" className={`mx-auto w-full max-w-sm ${data.illustrationImage ? 'fallback-svg hidden' : ''}`} aria-hidden="true">
              <circle cx="200" cy="180" r="140" fill="url(#heroGrad)" opacity="0.1" />
              <path
                d="M200 60 c-45 0-80 30-80 75 c0 25 15 45 30 70 c15 25 25 55 30 80 c2 15 8 25 12 25 h16 c4 0 10-10 12-25 c5-25 15-55 30-80 c15-25 30-45 30-70 c0-45-35-75-80-75z"
                fill="url(#toothGrad)"
                stroke="var(--primary)"
                strokeWidth="2.5"
                opacity="0.9"
              />
              <defs>
                <linearGradient id="heroGrad" x1="50" y1="30" x2="350" y2="330">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--accent)" />
                </linearGradient>
                <linearGradient id="toothGrad" x1="150" y1="60" x2="250" y2="340">
                  <stop offset="0%" stopColor="white" />
                  <stop offset="100%" stopColor="var(--secondary)" />
                </linearGradient>
              </defs>
            </svg>

            {/* Floating stat cards */}
            <div className="absolute -left-4 top-1/4 rounded-2xl border border-border/70 bg-background/90 px-4 py-3 shadow-lg backdrop-blur-sm">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Satisfaction</p>
              <p className="text-lg font-bold text-primary">94%</p>
            </div>
            <div className="absolute -right-4 bottom-1/4 rounded-2xl border border-border/70 bg-background/90 px-4 py-3 shadow-lg backdrop-blur-sm">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Grade</p>
              <p className="text-lg font-bold text-accent-foreground">Grade A</p>
            </div>
          </div>
        </MotionReveal>
      </div>

      {/* Removed LogoMarquee from here as requested to keep only one instance */}
    </section>
  );
}
