import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const JUBA_CONTENT = {
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
      { label: "+211 980 083 781", value: "Official WhatsApp", icon: "MessageCircle" }
    ],
    hours: [
      { day: "Weekday Schedule", time: "8:00 AM – 8:00 PM" },
      { day: "Weekend Availability", time: "9:00 AM – 6:00 PM" },
      { day: "Critical Response", time: "On-Call 24/7" }
    ]
  }
};

async function main() {
  console.log("Updating content to Juba context...");
  
  for (const [key, value] of Object.entries(JUBA_CONTENT)) {
    await prisma.contentBlock.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    console.log(`Updated: ${key}`);
  }
  
  console.log("Juba content update complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
