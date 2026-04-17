import type { Metadata } from "next";

import { env } from "@/lib/env";

export const siteConfig = {
  name: "Zylo Dental Clinic",
  description:
    "Zylo Dental Clinic provides modern preventive, cosmetic, and restorative dental care with easy online appointment booking.",
  url: env.NEXT_PUBLIC_APP_URL,
  ogImage: "/og-image.jpg",
};

export function absoluteUrl(path = "/") {
  const base = siteConfig.url.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

export function buildMetadata(overrides?: Metadata): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title: siteConfig.name,
      description: siteConfig.description,
      siteName: siteConfig.name,
      images: [
        {
          url: absoluteUrl(siteConfig.ogImage),
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: siteConfig.description,
      images: [absoluteUrl(siteConfig.ogImage)],
    },
    ...overrides,
  };
}
