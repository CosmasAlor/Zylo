import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { getContent } from "@/lib/content";

const iconMap: Record<string, React.ElementType> = {
  MapPin,
  Mail,
  Phone,
  MessageCircle,
};

type FooterLink = {
  label: string;
  href: string;
};

type FooterContact = {
  label: string;
  href: string;
  icon: string;
};

type FooterHour = {
  day: string;
  time: string;
};

type FooterData = {
  description: string;
  links: FooterLink[];
  contact: FooterContact[];
  hours: FooterHour[];
};

type SiteData = {
  siteName?: string;
  logoImage?: string;
  logoSize?: string | number;
};

const defaultFooterData: FooterData = {
  description: "Modern preventive, cosmetic, and restorative dental care designed around your comfort and wellbeing.",
  links: [
    { label: "Book Appointment", href: "/book" },
    { label: "Services", href: "/#services" },
    { label: "About Us", href: "/#about" },
    { label: "Contact Us", href: "/contact" },
  ],
  contact: [
    { label: "Google Maps", href: "https://share.google/dazDN1mUm5mykP1DK", icon: "MapPin" },
    { label: "Email", href: "mailto:contact@zylodental.com", icon: "Mail" },
    { label: "+1 (234) 567-890", href: "tel:+1234567890", icon: "Phone" },
  ],
  hours: [
    { day: "Mon-Fri", time: "8:00 AM - 7:00 PM" },
    { day: "Sat-Sun", time: "9:00 AM - 4:00 PM" },
  ],
};

export async function FooterSection({
  data: propData,
  siteData: propSiteData,
}: {
  data?: Partial<FooterData> | null;
  siteData?: SiteData | null;
} = {}) {
  const [dataPayload, siteDataResult] = await Promise.all([
    propData ? Promise.resolve(propData) : getContent("footer"),
    propSiteData ? Promise.resolve(propSiteData) : getContent("site"),
  ]);

  const payload =
    dataPayload && typeof dataPayload === "object" && !Array.isArray(dataPayload)
      ? (dataPayload as Partial<FooterData>)
      : {};

  const data: FooterData = {
    description: payload.description ?? defaultFooterData.description,
    links: Array.isArray(payload.links) ? payload.links : defaultFooterData.links,
    contact: Array.isArray(payload.contact) ? payload.contact : defaultFooterData.contact,
    hours: Array.isArray(payload.hours) ? payload.hours : defaultFooterData.hours,
  };

  const siteData =
    siteDataResult && typeof siteDataResult === "object" && !Array.isArray(siteDataResult)
      ? (siteDataResult as SiteData)
      : {};

  const siteName = siteData.siteName ?? "Zylo Dental";
  const logoImage = typeof siteData.logoImage === "string" ? siteData.logoImage : undefined;
  const logoSize = siteData.logoSize ?? "32";

  return (
    <footer className="border-t border-border/70 bg-card/30 py-12">
      <div className="container-app">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {logoImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoImage} alt={siteName} style={{ height: `${logoSize}px` }} className="w-auto max-w-[200px] object-contain" />
              ) : (
                <>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                    {siteName.charAt(0)}
                  </span>
                  <span className="text-lg font-semibold tracking-tight text-foreground">{siteName}</span>
                </>
              )}
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{data.description}</p>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-foreground">Quick Links</p>
            <nav className="flex flex-wrap gap-x-5 gap-y-2">
              {data.links.map((item) =>
                item.href.startsWith("/") ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
                  >
                    {item.label}
                  </a>
                ),
              )}
            </nav>

            <div className="flex items-center gap-3 pt-2">
              {data.contact.map((item) => {
                const Icon = iconMap[item.icon] || MapPin;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="rounded-xl border border-border/70 p-2 text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-foreground">Clinic Hours</p>
            <div className="space-y-2">
              {data.hours.map((hour) => (
                <div key={hour.day} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary/60" />
                  <span className="font-medium text-foreground">{hour.day}</span>
                  <span className="ml-auto">{hour.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border/70 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteName}. All rights reserved. Dev by Cosmas Alor
        </div>
      </div>
    </footer>
  );
}
