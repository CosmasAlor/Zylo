import type { Metadata } from "next";

export const dynamic = "force-dynamic";

import { CtaSection } from "@/components/sections/cta-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { FooterSection } from "@/components/sections/footer-section";
import { HeroSection } from "@/components/sections/hero-section";
import { Navbar } from "@/components/sections/navbar";
import { ServicesSection } from "@/components/sections/services-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { TrustedBySection } from "@/components/sections/trusted-by-section";
import { ValueSection } from "@/components/sections/value-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { BlogSection } from "@/components/sections/blog-section";
import { buildMetadata } from "@/lib/seo";
import { getContent } from "@/lib/content";

export const metadata: Metadata = buildMetadata({
  title: "Zylo Dental Clinic - Modern Dental Care",
  description:
    "Zylo Dental Clinic provides comprehensive preventive, cosmetic, and restorative dental services for a brighter smile.",
});

export default async function HomePage() {
  const [navbarData, siteData, footerData, logosData, trustedByData] = await Promise.all([
    getContent("navbar"),
    getContent("site"),
    getContent("footer"),
    getContent("logos"),
    getContent("trustedBy")
  ]);

  return (
    <div className="bg-background text-foreground">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Navbar
        data={navbarData && typeof navbarData === "object" && !Array.isArray(navbarData) ? navbarData : undefined}
        siteData={siteData && typeof siteData === "object" && !Array.isArray(siteData) ? siteData : undefined}
      />

      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        <TrustedBySection
          data={trustedByData && typeof trustedByData === "object" && !Array.isArray(trustedByData) ? trustedByData : undefined}
          logosData={logosData && typeof logosData === "object" && !Array.isArray(logosData) ? logosData : undefined}
        />
        <FeaturesSection />
        <GallerySection />
        <ValueSection />
        <ServicesSection />
        <BlogSection />
        <TestimonialsSection />
        <CtaSection />
      </main>

      <FooterSection
        data={footerData && typeof footerData === "object" && !Array.isArray(footerData) ? footerData : undefined}
        siteData={siteData && typeof siteData === "object" && !Array.isArray(siteData) ? siteData : undefined}
      />
    </div>
  );
}
