"use client";

import type { Prisma } from "@prisma/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];

interface ContentBlock {
  key: string;
  value: Prisma.JsonValue;
}

const SECTION_TEMPLATES: Record<string, Record<string, JsonValue>> = {
  site: {
    siteName: "Zylo Dental Clinic",
    logoImage: "",
    logoSize: "40",
    contactEmail: "hello@zylodental.com",
    contactPhone: "+211925603404",
    address: "Thongping, First Floor, Airport Road & Bilpham Junction",
    metaTitle: "Zylo Dental Clinic - The New Benchmark in Juba",
    metaDescription: "Experience world-class dental care in a state-of-the-art facility located in central Thongping."
  },
  navbar: {
    items: [
      { label: "Our Services", href: "#services" },
      { label: "The Zylo Way", href: "#about" },
      { label: "Patient Voices", href: "#testimonials" },
      { label: "Find Us", href: "#cta" },
    ],
    cta: { 
      label: "Request Consultation", 
      phoneLabel: "Emergency Care", 
      phone: "+211925603404" 
    }
  },
  hero: {
    badge: "The New Benchmark of Clinical Excellence in Juba",
    titleNormal: "Elevating the Art of a",
    titleAccent: "Perfect Smile",
    subtitle: "Experience world-class dental care in a state-of-the-art facility located in central Thongping. We combine advanced digital diagnostics with a genuine commitment to painless, stress-free family dentistry. From routine maintenance to complex oral rehabilitations, we are Juba's most trusted medical center for premium oral health.",
    backgroundImage: "",
    ctaPrimary: "Reserve Your Visit",
    ctaSecondary: "Explore Treatments",
    stats: [
      { label: "Successful Procedures", value: "8,500+" },
      { label: "Clinical Safety", value: "Grade A" },
      { label: "Patient Satisfaction", value: "94%" },
      { label: "Modern Clinics", value: "Multi" }
    ]
  },
  services: {
    title: "Comprehensive Dental Solutions",
    subtitle: "Our specialized clinical teams utilize the latest European technology to deliver a dental experience that is as precise as it is comfortable.",
    items: [
      { 
        title: "Advanced Diagnostics", 
        description: "Utilizing high-definition digital X-rays and intra-oral scanning to detect dental pathology at its earliest stages, preventing painful emergencies.", 
        icon: "Stethoscope" 
      },
      { 
        title: "Cosmetic Artistry", 
        description: "Transform your confidence with professional laser teeth whitening and bespoke smile design. Safe, effective, and always dentist-supervised.", 
        icon: "Sparkles" 
      },
      { 
        title: "Implantology & Restorative", 
        description: "Permanent solutions for missing teeth using premium titanium implants and custom-crafted crowns that restore 100% of your bite force.", 
        icon: "ShieldCheck" 
      },
      { 
        title: "Surgical Excellence", 
        description: "Painless wisdom tooth extractions and specialized oral surgery performed under the highest international sterilization protocols.", 
        icon: "Syringe" 
      },
      { 
        title: "Pediatric Mastery", 
        description: "Creating positive dental associations for Juba's younger generations in a fun, anxiety-free environment designed specifically for children.", 
        icon: "Baby" 
      },
      { 
        title: "Orthodontics", 
        description: "Correcting misalignments and jaw issues with modern braces and clear aligner technology for both children and adults.", 
        icon: "Smile" 
      }
    ]
  },
  features: {
    title: "The Zylo Distinction (Juba)",
    subtitle: "Discover why discerning families and international professionals in South Sudan choose Zylo as their primary dental partner.",
    items: [
      { 
        title: "Absolute Sterilization", 
        description: "We employ hospital-grade Class B autoclaves and strict single-use instrument protocols, exceeding WHO standards for cross-contamination prevention.", 
        icon: "ShieldCheck" 
      },
      { 
        title: "Transparent Clinical Plans", 
        description: "Detailed digital treatment plans and upfront pricing. We believe in building lifelong trust through complete financial and medical transparency.", 
        icon: "Clock" 
      },
      { 
        title: "Painless Methodology", 
        description: "Our conservative approach to dentistry includes specialized techniques for anxious patients, ensuring every visit is completely stress-free.", 
        icon: "Smile" 
      },
      { 
        title: "Modern Thongping Facility", 
        description: "A premium, relaxing medical environment located near Salam petrol, designed to reduce clinical anxiety and provide genuine comfort.", 
        icon: "MapPin" 
      }
    ]
  },
  trustedBy: {
    badge: "Partnering with Juba's Most Respected Organizations",
    stats: [
      { label: "Patient Retention", value: "94%" },
      { label: "Safety Protocols", value: "Grade A" },
      { label: "Sterilization Std", value: "WHO" },
      { label: "Response Time", value: "<15 Min" }
    ]
  },
  value: {
    title: "World-Class Integrity in Thongping",
    description: "At Zylo Juba, we don't just fix teeth; we restore confidence and improve overall systemic health through preventive, elite oral care.",
    backgroundImage: "",
    benefits: [
      "Specialized painless procedures for patients with high dental anxiety",
      "Centrally located in Thongping near Maidan Rainbow and Salam Petrol",
      "Flexible and transparent payment plans designed for Juba families",
      "Full spectrum dental check-ups utilizing the highest tier of diagnostic tools",
      "Extended clinical hours including Saturday and dedicated Sunday access",
      "Multi-national clinical team with international training and expertise"
    ]
  },
  testimonials: {
    title: "The Patient Experience",
    items: [
      { 
        name: "Hon. James Maton", 
        text: "You wake up strong and Juba life humbles you — but Zylo keeps you smiling. The first clinic in South Sudan where I felt the technology matched the doctor's skill.", 
        rating: 5 
      },
      { 
        name: "Catherine W.", 
        text: "Clean, professional, and they actually listen. As an expat, I was struck by their hygiene standards. Truly an oasis of clinical excellence in Juba.", 
        rating: 5 
      },
      { 
        name: "Samuel O.", 
        text: "Emergency tooth extraction was smooth and surprisingly painless. The digital X-rays made me feel much more confident in the plan. Exceptional service.", 
        rating: 5 
      },
      { 
        name: "Liza Deng", 
        text: "The the best dental experience I've had in South Sudan. They took the time to explain everything using the screen. Highly recommended for families.", 
        rating: 5 
      }
    ]
  },
  cta: {
    title: "Step Into the Future of Dentistry — in Juba",
    subtitle: "Begin your journey toward a healthier, more confident smile today. ⏳ Ramadan notice: Limited appointments available to ensure the highest quality of individual care.",
    ctaLabel: "Initiate Consultation (WhatsApp)",
    ctaHref: "https://wa.me/211980083781",
    ctaSecondaryLabel: "Call Juba +211 925 603 404",
    phone: "+211925603404"
  },
  footer: {
    description: "Zylo Dental Clinic Juba is the region’s premier private facility, dedicated to providing safe, gentle, and affordable oral healthcare for the whole family through innovation and uncompromising sterilization.",
    links: [
      { label: "Home", href: "/" },
      { label: "Our Standards", href: "#about" },
      { label: "Clinical Services", href: "#services" },
      { label: "Corporate Services", href: "#cta" }
    ],
    contact: [
      { label: "Airport Road & Bilpham Junction", value: "Thongping, First Floor", icon: "MapPin" },
      { label: "+211 925 603 404", value: "Direct Call Desk", icon: "Phone" },
      { label: "+211 980 083 781", value: "Official WhatsApp", icon: "Mail" }
    ],
    hours: [
      { day: "Weekday Schedule", time: "8:00 AM – 8:00 PM" },
      { day: "Weekend Availability", time: "9:00 AM – 6:00 PM" },
      { day: "Critical Response", time: "On-Call 24/7" }
    ]
  },
  logos: {
    title: "Partnering with Juba's Most Respected Organizations",
    items: [
      "United Nations", "World Bank", "UNICEF", "Red Cross", "International SOS", "MTN South Sudan"
    ]
  }
};

export default function CMSForm({ initialBlocks }: { initialBlocks: ContentBlock[] }) {
  const [blocks, setBlocks] = useState<Record<string, Record<string, JsonValue>>>(() => {
    const map: Record<string, Record<string, JsonValue>> = {};
    initialBlocks.forEach(b => {
      // Safely ensure the database JSON is treated as an object for our initial state
      if (b.value && typeof b.value === 'object' && !Array.isArray(b.value)) {
        map[b.key] = b.value as Record<string, JsonValue>;
      } else {
        map[b.key] = {};
      }
    });
    // Fill in defaults for missing sections or merge missing fields into existing sections
    Object.keys(SECTION_TEMPLATES).forEach(key => {
      map[key] = {
        ...SECTION_TEMPLATES[key],
        ...(map[key] || {})
      };
    });
    return map;
  });
  const [loading, setLoading] = useState<string | null>(null);

  const handleSave = async (key: string) => {
    try {
      setLoading(key);
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: blocks[key] || {} }),
      });

      if (res.ok) {
        toast.success(`Updated ${key} successfully`);
        // Refresh the preview iframe if it exists
        const iframe = document.querySelector('iframe') as HTMLIFrameElement;
        if (iframe) {
          iframe.src = iframe.src;
        }
      } else {
        toast.error("Failed to update content");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setLoading(null);
    }
  };

  const updateField = (sectionKey: string, path: string, value: JsonValue) => {
    setBlocks(prev => {
      const newBlocks: Record<string, Record<string, JsonValue>> = JSON.parse(JSON.stringify(prev));
      const section = newBlocks[sectionKey] || {};
      
      const keys = path.split('.');
      let current: Record<string, JsonValue> = section;
      
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const nextKey = keys[i + 1];
        const isNextStepArray = !isNaN(Number(nextKey));
        
        if (!current[key]) {
          current[key] = isNextStepArray ? [] : {};
        }
        
        // Type narrowing to allow index access safely
        const next = current[key];
        if (next && typeof next === 'object' && !Array.isArray(next)) {
            current = next as Record<string, JsonValue>;
        } else if (Array.isArray(next)) {
            current = next as unknown as Record<string, JsonValue>;
        } else {
             // If it's a primitive but we need to go deeper, we must overwrite it
             current[key] = isNextStepArray ? [] : {};
             current = current[key] as Record<string, JsonValue>;
        }
      }
      
      const lastKey = keys[keys.length - 1];
      current[lastKey] = value;
      newBlocks[sectionKey] = section;
      return newBlocks;
    });
  };

  const sections = [
    { key: "site", label: "Global Settings" },
    { key: "logos", label: "Partners/Logos" },
    { key: "navbar", label: "Navbar" },
    { key: "hero", label: "Hero" },
    { key: "services", label: "Services" },
    { key: "features", label: "Features" },
    { key: "trustedBy", label: "Trust Info" },
    { key: "value", label: "Value Prop" },
    { key: "testimonials", label: "Testimonials" },
    { key: "cta", label: "CTA" },
    { key: "footer", label: "Footer" },
  ];

  return (
    <Tabs defaultValue="hero" className="w-full">
      <TabsList className="flex flex-wrap h-auto bg-muted/50 p-1 mb-6">
        {sections.map(s => (
          <TabsTrigger key={s.key} value={s.key}>{s.label}</TabsTrigger>
        ))}
      </TabsList>

      {sections.map(section => (
        <TabsContent key={section.key} value={section.key}>
          <EditorCard 
            title={`${section.label} Section`} 
            onSave={() => handleSave(section.key)} 
            loading={loading === section.key}
          >
            <div className="space-y-6">
              <DynamicFields 
                data={blocks[section.key] || {}} 
                onChange={(path, val) => updateField(section.key, path, val)} 
              />
            </div>
          </EditorCard>
        </TabsContent>
      ))}
    </Tabs>
  );
}

function DynamicFields({ data, onChange, path = "" }: { data: JsonValue, onChange: (path: string, val: JsonValue) => void, path?: string }) {
  if (data === null || data === undefined) return null;

  if (Array.isArray(data)) {
    return (
      <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
        {data.map((item, index) => (
          <div key={index} className="relative rounded-md border bg-card p-4 pt-10 shadow-sm">
            <div className="absolute top-2 left-4 flex gap-2">
               <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Item #{index + 1}</span>
            </div>
            <div className="absolute top-2 right-2 flex gap-1">
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => {
                const newList = [...data];
                if (index > 0) {
                  [newList[index], newList[index - 1]] = [newList[index - 1], newList[index]];
                  onChange(path, newList);
                }
              }}>
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => {
                const newList = [...data];
                if (index < data.length - 1) {
                  [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
                  onChange(path, newList);
                }
              }}>
                <ChevronDown className="h-3 w-3" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => {
                const newList = data.filter((_, i) => i !== index);
                onChange(path, newList);
              }}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <DynamicFields data={item} onChange={(subPath, val) => onChange(path ? `${path}.${index}${subPath ? '.' + subPath : ''}` : `${index}${subPath ? '.' + subPath : ''}`, val)} />
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => {
          // Clone first item or use empty object
          const newItem = data.length > 0 ? JSON.parse(JSON.stringify(data[0])) : {};
          onChange(path, [...data, newItem]);
        }}>
          <Plus className="h-4 w-4" /> Add Item
        </Button>
      </div>
    );
  }

  if (typeof data === 'object') {
    return (
      <div className="grid gap-6">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <Label className="capitalize text-xs font-semibold text-muted-foreground">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
            <DynamicFieldItem 
              value={value} 
              onChange={(val) => onChange(key, val)} 
              label={key}
            />
          </div>
        ))}
      </div>
    );
  }

  return null;
}

function DynamicFieldItem({ value, onChange, label }: { value: JsonValue, onChange: (val: JsonValue) => void, label: string }) {
  const isIconField = label.toLowerCase().includes('icon');
  const isImageField = label.toLowerCase().includes('image') || label.toLowerCase().includes('url') || label.toLowerCase().includes('logo');

  if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
    return <DynamicFields data={value} onChange={onChange} />;
  }

  if (typeof value === 'string' && value.length > 50 && !value.startsWith('data:image')) {
    return <Textarea value={value} onChange={e => onChange(e.target.value)} className="min-h-[80px]" />;
  }

  const compressImage = (base64Str: string, maxWidth: number, maxHeight: number): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/webp', 0.8));
      };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        const base64 = event.target.result as string;
        // Compress: Limit logos to 400px height, others to 1200px
        const isLogo = label.toLowerCase().includes('logo');
        const compressed = await compressImage(base64, isLogo ? 800 : 1200, isLogo ? 400 : 800);
        onChange(compressed);
      }
    };
    reader.readAsDataURL(file);
  };

  const isSizeField = label.toLowerCase().includes('size');

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center">
        <Input 
          type={isSizeField ? "number" : "text"}
          value={typeof value === 'string' || typeof value === 'number' ? value : ""} 
          onChange={e => onChange(isSizeField ? Number(e.target.value) : e.target.value)} 
          placeholder={isImageField ? "Enter image URL or upload file..." : ""}
          className="flex-1"
        />
        {isImageField && (
           <div className="relative">
             <Input 
               type="file" 
               accept="image/*" 
               onChange={handleImageUpload} 
               className="absolute inset-0 opacity-0 cursor-pointer w-full"
             />
             <Button type="button" variant="secondary" className="pointer-events-none">
               Upload
             </Button>
           </div>
        )}
      </div>

      {isSizeField && (
        <p className="text-[10px] text-muted-foreground mt-1 font-medium">
          Adjust the height in pixels. The width will scale proportionally.
        </p>
      )}

      {isIconField && (
        <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
          <span>Try: HeartPulse, Smile, Sun, Stethoscope, Baby, Syringe, CalendarClock, Clock, ShieldCheck, Sparkles</span>
        </div>
      )}

      {isImageField && value && typeof value === 'string' && (
        <div className="mt-2 rounded-lg border bg-muted/10 p-2 overflow-hidden max-w-[200px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="h-20 w-auto max-w-full object-contain rounded" />
        </div>
      )}
    </div>
  );
}

function EditorCard({ title, children, onSave, loading }: { title: string, children: React.ReactNode, onSave: () => void, loading: boolean }) {
  return (
    <div className="rounded-2xl border bg-card/50 backdrop-blur-sm p-8 shadow-xl border-white/10">
      <div className="flex items-center justify-between mb-10 border-b border-border/50 pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1 font-medium">Configure this section&apos;s content and appearance.</p>
        </div>
        <Button onClick={onSave} disabled={loading} className="px-10 h-11 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      {children}
    </div>
  );
}
