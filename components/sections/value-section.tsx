import { CheckCircle } from "lucide-react";
import { MotionReveal } from "@/components/ui/motion";
import { SectionHeader } from "@/components/sections/section-header";
import { getContent } from "@/lib/content";
import { ClientImageFix } from "@/components/ui/client-image-fix";

interface ValueSectionData {
  badge?: string;
  title?: string;
  description?: string;
  backgroundImage?: string;
  benefits?: string[];
}

export async function ValueSection() {
  const data = (await getContent("value")) as ValueSectionData | null || {
    badge: "Why Zylo Dental",
    title: "Where clinical excellence meets genuine warmth.",
    description: "We built Zylo Dental around one idea: every patient deserves world-class care in a space that feels welcoming, modern, and human.",
    benefits: [
      "State-of-the-art digital imaging for accurate, painless diagnosis.",
      "Sedation options available for anxious patients — stress-free visits guaranteed.",
      "Flexible payment plans and insurance accepted — quality care that fits your budget.",
      "Warm, boutique-style clinic designed to feel like a spa, not a hospital.",
      "Multilingual team ready to serve a diverse community with care.",
    ]
  };

  return (
    <section id="about" className="border-y border-border/70 bg-card/50 py-24 md:py-32">
      <div className="container-app grid items-center gap-12 lg:grid-cols-2">
        <MotionReveal className="space-y-6">
          <SectionHeader
            badge={data.badge}
            title={data.title ?? "Where clinical excellence meets genuine warmth."}
            description={data.description ?? "We built Zylo Dental around one idea: every patient deserves world-class care in a space that feels welcoming, modern, and human."}
          />
          <ul className="space-y-3">
            {Array.isArray(data?.benefits) && data.benefits.map((item: string) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-border/70 bg-background p-4 text-sm text-muted-foreground"
              >
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </MotionReveal>

        <MotionReveal delay={0.1} className="relative">
          {/* Background image or decorative dental illustration card */}
          {data.backgroundImage ? (
            <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-secondary/60 via-card to-card p-8 shadow-xl shadow-primary/5 overflow-hidden">
              <ClientImageFix
                src={data.backgroundImage}
                alt="Value proposition"
                width={400}
                height={256}
                className="w-full h-64 object-cover rounded-2xl"
                fallbackSelector=".value-fallback-svg"
              />
              <svg viewBox="0 0 400 400" fill="none" className="value-fallback-svg mx-auto w-full max-w-sm hidden" aria-hidden="true">
                <rect x="175" y="80" width="50" height="240" rx="12" fill="var(--primary)" opacity="0.08" />
                <rect x="80" y="175" width="240" height="50" rx="12" fill="var(--primary)" opacity="0.08" />
                <path d="M130 220 Q200 300 270 220" stroke="var(--primary)" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.5" />
                <circle cx="160" cy="170" r="10" fill="var(--primary)" opacity="0.3" />
                <circle cx="240" cy="170" r="10" fill="var(--primary)" opacity="0.3" />
                <circle cx="310" cy="110" r="5" fill="var(--accent)" opacity="0.5">
                  <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="90" cy="130" r="4" fill="var(--accent)" opacity="0.4">
                  <animate attributeName="r" values="4;6;4" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="320" cy="290" r="3" fill="var(--accent)" opacity="0.35">
                  <animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
          ) : (
            <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-secondary/60 via-card to-card p-8 shadow-xl shadow-primary/5">
              <svg viewBox="0 0 400 400" fill="none" className="mx-auto w-full max-w-sm" aria-hidden="true">
                <rect x="175" y="80" width="50" height="240" rx="12" fill="var(--primary)" opacity="0.08" />
                <rect x="80" y="175" width="240" height="50" rx="12" fill="var(--primary)" opacity="0.08" />
                <path d="M130 220 Q200 300 270 220" stroke="var(--primary)" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.5" />
                <circle cx="160" cy="170" r="10" fill="var(--primary)" opacity="0.3" />
                <circle cx="240" cy="170" r="10" fill="var(--primary)" opacity="0.3" />
                <circle cx="310" cy="110" r="5" fill="var(--accent)" opacity="0.5">
                  <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="90" cy="130" r="4" fill="var(--accent)" opacity="0.4">
                  <animate attributeName="r" values="4;6;4" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="320" cy="290" r="3" fill="var(--accent)" opacity="0.35">
                  <animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
          )}
        </MotionReveal>
      </div>
    </section>
  );
}
