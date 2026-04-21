import Link from "next/link";
import { MotionReveal } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { getContent } from "@/lib/content";
import { LogoMarquee } from "@/components/sections/logo-marquee";
import { ClientImageFix } from "@/components/ui/client-image-fix";
import { ArrowRight, Sparkles, ShieldCheck, Heart } from "lucide-react";

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
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-40 md:pb-32 bg-background">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Mesh Gradients */}
        <div className="absolute -left-[10%] -top-[10%] h-[60%] w-[60%] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
        <div className="absolute -right-[10%] top-[20%] h-[50%] w-[50%] rounded-full bg-accent/8 blur-[100px]" />
        <div className="absolute left-[20%] bottom-0 h-[40%] w-[40%] rounded-full bg-primary/3 blur-[80px]" />

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--foreground) 1px, transparent 0)`,
            backgroundSize: "48px 48px"
          }}
        />

        {/* Grain Effect Overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="container-app relative z-10 grid items-center gap-16 lg:grid-cols-2 mb-20 md:mb-32">
        <MotionReveal className="space-y-10">
          <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary shadow-sm backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            {data.badge}
          </div>

          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground md:text-7xl lg:text-8xl">
            {data.titleNormal}{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x">
                {data.titleAccent}
              </span>
              <span className="absolute bottom-2 left-0 h-3 w-full bg-primary/10 -rotate-1 z-0" />
            </span>
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground/90 md:text-xl font-medium">
            {data.subtitle || data.description}
          </p>

          <div className="flex flex-wrap gap-5">
            <Button asChild size="lg" className="h-14 px-8 rounded-2xl shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 group">
              <Link href="/book" className="flex items-center gap-2">
                {data.ctaPrimary}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 rounded-2xl border-border/80 hover:bg-secondary/50 backdrop-blur-sm transition-all">
              <a href="tel:+211925603404">{data.ctaSecondary}</a>
            </Button>
          </div>

          {/* Mini trust badges with improved styling */}
          <div className="flex flex-wrap items-center gap-x-10 gap-y-6 pt-6">
            {Array.isArray(data?.stats) && data.stats.map((stat: { label: string; value: string }, i: number) => (
              <div key={i} className="group flex flex-col gap-1">
                <span className="text-3xl font-black text-foreground group-hover:text-primary transition-colors">{stat.value}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70">{stat.label}</span>
              </div>
            ))}
          </div>
        </MotionReveal>

        <MotionReveal delay={0.2} className="relative perspective-1000">
          {/* Decorative card with dental illustration */}
          <div className="relative rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-card/80 to-background p-4 shadow-2xl shadow-primary/10 backdrop-blur-md overflow-hidden transform-gpu hover:rotate-y-1 transition-transform duration-700">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5" />

            <div className="relative rounded-[2rem] bg-background/40 p-8 border border-white/5 overflow-hidden">
              {data.illustrationImage ? (
                <ClientImageFix
                  src={data.illustrationImage}
                  alt="Dental illustration"
                  width={500}
                  height={450}
                  className="mx-auto w-full max-w-sm drop-shadow-2xl"
                  fallbackSelector=".hero-illustration-svg"
                />
              ) : null}
              <svg viewBox="0 0 400 360" fill="none" className={`hero-illustration-svg mx-auto w-full max-w-sm ${data.illustrationImage ? 'hidden' : ''}`} aria-hidden="true">
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
            </div>

            {/* Floating premium indicator cards */}
            <div className="absolute -left-6 top-1/4 flex items-center gap-3 rounded-2xl border border-white/20 bg-background/80 px-5 py-4 shadow-xl backdrop-blur-xl animate-float">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Certified Safety</p>
                <p className="text-sm font-bold text-foreground">Grade A Clinic</p>
              </div>
            </div>

            <div className="absolute -right-6 bottom-1/4 flex items-center gap-3 rounded-2xl border border-white/20 bg-background/80 px-5 py-4 shadow-xl backdrop-blur-xl animate-float-delayed">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <Heart className="h-5 w-5 text-accent" />
              </div>
              <div className="flex flex-col">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Patient Score</p>
                <p className="text-sm font-bold text-foreground">94% Positive</p>
              </div>
            </div>
          </div>
        </MotionReveal>
      </div>

      <div className="container-app relative z-10">
        <LogoMarquee />
      </div>
    </section>
  );
}
