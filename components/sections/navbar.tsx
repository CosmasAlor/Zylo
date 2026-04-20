"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type NavItem = {
  label: string;
  href: string;
};

type NavbarCta = {
  label: string;
  phoneLabel: string;
  phone: string;
};

type NavbarData = {
  items?: NavItem[];
  cta?: Partial<NavbarCta>;
};

type SiteData = {
  siteName?: string;
  logoImage?: string;
  logoSize?: string | number;
};

const defaultNavItems: NavItem[] = [
  { label: "Services", href: "/#services" },
  { label: "Why Us", href: "/#about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const defaultCta: NavbarCta = {
  label: "Book Appointment",
  phoneLabel: "Call Us",
  phone: "+1234567890",
};

export function Navbar({ data, siteData }: { data?: NavbarData | null; siteData?: SiteData | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = Array.isArray(data?.items) ? data.items : defaultNavItems;
  const cta: NavbarCta = {
    label: data?.cta?.label ?? defaultCta.label,
    phoneLabel: data?.cta?.phoneLabel ?? defaultCta.phoneLabel,
    phone: data?.cta?.phone ?? defaultCta.phone,
  };
  const siteName = siteData?.siteName ?? "Zylo Dental";
  const logoImage = typeof siteData?.logoImage === "string" ? siteData.logoImage : undefined;
  const logoSize = siteData?.logoSize ?? "32";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/70 bg-background/80 shadow-sm backdrop-blur-xl"
          : "bg-background/40 backdrop-blur-sm"
      }`}
    >
      <div className="container-app flex h-16 items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          {logoImage ? (
             // eslint-disable-next-line @next/next/no-img-element
             <img src={logoImage} alt={siteName} style={{ height: `${logoSize}px` }} className="w-auto max-w-[200px] object-contain" />
          ) : (
            <>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                {siteName.charAt(0)}
              </span>
              <span className="text-xl font-semibold tracking-tight text-foreground">
                {siteName}
              </span>
            </>
          )}
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          {navItems.map((item: { label: string; href: string }) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden gap-2 md:flex">
          <Button asChild size="sm" variant="outline" className="rounded-xl">
            <a href={`tel:${cta.phone}`}>{cta.phoneLabel}</a>
          </Button>
          <Button asChild size="sm" className="rounded-xl shadow-sm shadow-primary/20">
            <Link href="/book">{cta.label}</Link>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-primary md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-border/70 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="container-app flex flex-col gap-3 py-4">
            {navItems.map((item: { label: string; href: string }) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <Button asChild size="sm" variant="outline" className="flex-1 rounded-xl">
                <a href={`tel:${cta.phone}`}>{cta.phoneLabel}</a>
              </Button>
              <Button asChild size="sm" className="flex-1 rounded-xl">
                <Link href="/book">{cta.label}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
