"use client";

type LogoMarqueeData = {
  title?: string;
  items?: string[];
};

export function LogoMarquee({ data }: { data?: LogoMarqueeData | null }) {
  const items = Array.isArray(data?.items) ? data.items : [
    "United Nations", "World Bank", "UNICEF", "Red Cross", "International SOS", "MTN South Sudan"
  ];
  const title = data?.title || "Partnering with Juba's Most Respected Organizations";

  return (
    <div className="w-full overflow-hidden py-10">
      <div className="container-app mb-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-semibold">
          {title}
        </p>
      </div>
      <div className="relative flex overflow-x-hidden">
        <div className="flex animate-marquee whitespace-nowrap py-4">
          {[...items, ...items].map((logo, i) => (
            <span
              key={i}
              className="mx-8 text-lg font-bold tracking-tighter text-muted-foreground/30 grayscale hover:grayscale-0 transition-all duration-300 pointer-events-none uppercase"
            >
              {logo}
            </span>
          ))}
        </div>

        <div className="absolute top-0 right-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />
        <div className="absolute top-0 left-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
