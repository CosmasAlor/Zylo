import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { WebVitalsReporter } from "@/components/web-vitals-reporter";
import { buildMetadata } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import { getContent } from "@/lib/content";

type SiteMetadataContent = {
  metaTitle?: string;
  siteName?: string;
  metaDescription?: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const siteData = (await getContent("site")) as SiteMetadataContent | null;
  
  return buildMetadata({
    title: {
      default: siteData?.metaTitle || "Zylo Dental Clinic",
      template: `%s | ${siteData?.siteName || "Zylo Dental"}`,
    },
    description: siteData?.metaDescription || "Zylo Dental Clinic provides modern preventive, cosmetic, and restorative dental care.",
  });
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className="min-h-full bg-background text-foreground"
      >
        {children}
        <WebVitalsReporter />
        <Toaster />
      </body>
    </html>
  );
}
