import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run seed.");
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.appointment.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.contentBlock.deleteMany();

  await prisma.appointment.createMany({
    data: [
      {
        fullName: "Nafisa Rahman",
        phone: "+8801711000001",
        email: "nafisa@example.com",
        service: "General Dentistry",
        preferredDate: new Date("2026-04-20"),
        preferredTime: "10:00",
        notes: "Routine checkup and cleaning request.",
        status: "PENDING",
      },
      {
        fullName: "Mahmud Hasan",
        phone: "+8801711000002",
        email: "mahmud@example.com",
        service: "Dental Implants",
        preferredDate: new Date("2026-04-22"),
        preferredTime: "15:30",
        notes: "Consultation for implant options.",
        status: "CONFIRMED",
      },
      {
        fullName: "Sadia Akter",
        phone: "+8801711000003",
        email: "sadia@example.com",
        service: "Root Canal Therapy",
        preferredDate: new Date("2026-04-18"),
        preferredTime: "12:15",
        notes: "Follow-up from emergency pain visit.",
        status: "COMPLETED",
      },
    ],
  });

  await prisma.blogPost.createMany({
    data: [
      {
        title: "The Importance of Regular Dental Checkups",
        slug: "importance-of-regular-checkups",
        excerpt: "Discover why visiting your dentist every six months is crucial for maintaining a healthy and confident smile.",
        content: { body: "Regular dental checkups are the cornerstone of good oral health. Many people believe they only need to visit the dentist when they're in pain, but preventive care is far more effective and less costly in the long run.\n\nDuring a routine visit, your dentist does more than just clean your teeth. We perform a comprehensive exam of your mouth, including screening for oral cancer, checking for signs of gum disease, and identifying potential cavities before they become serious issues.\n\nProfessional cleanings reach areas that even the most diligent brushing and flossing can miss. Removing plaque and tartar prevents the buildup of bacteria that leads to tooth decay and inflammation. By visiting Zylo Dental twice a year, you're investing in a lifetime of healthy smiles." },
        published: true,
        coverImage: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Modern Advances in Dental Implant Technology",
        slug: "modern-dental-implants",
        excerpt: "Learn how the latest technology is making dental implants more accessible, durable, and natural-looking than ever before.",
        content: { body: "Losing a tooth can impact more than just your appearance; it affects your ability to eat, speak, and even the health of your jawbone. Fortunately, dental implants have revolutionized how we replace missing teeth.\n\nAt Zylo Dental, we utilize 3D imaging and guided surgery techniques to ensure precise implant placement. This technology allows for faster healing times and more predictable outcomes. Unlike bridges or dentures, implants fuse directly with the bone, providing a stable foundation that feels and functions exactly like a natural tooth.\n\nWhether you're missing a single tooth or require a full arch restoration, modern implants offer a permanent solution that can last a lifetime with proper care. Our team is dedicated to helping you find the best option for your unique situation." },
        published: true,
        coverImage: "https://images.unsplash.com/photo-1629851211420-bf9235d6dc6b?auto=format&fit=crop&q=80&w=1200",
      },
      {
        title: "Choosing the Right Toothbrush for Your Needs",
        slug: "choosing-the-right-toothbrush",
        excerpt: "Electric or manual? Hard or soft bristles? We break down everything you need to know to choose the perfect toothbrush.",
        content: { body: "Walk down the dental care aisle of any pharmacy, and you'll be met with dozens of toothbrush options. It can be overwhelming to decide which one is actually best for your teeth.\n\nAs a general rule, soft-bristled brushes are the safest choice for almost everyone. Hard bristles can actually wear down your tooth enamel and irritate your gums over time. The size of the brush head also matters; choose a size that allows you to comfortably reach the surfaces of your back molars.\n\nWhen it comes to electric vs. manual, both can be effective if used correctly for two full minutes. However, electric toothbrushes often make it easier to reach a high level of plaque removal, as the oscillating or sonic movements do much of the work for you. Regardless of which you choose, remember to replace your brush (or brush head) every three months." },
        published: true,
        coverImage: "https://images.unsplash.com/photo-1559599141-8656f2648580?auto=format&fit=crop&q=80&w=1200",
      },
    ],
  });

  await prisma.galleryItem.createMany({
    data: [
      {
        beforeUrl: "https://images.unsplash.com/photo-1598256989470-386993129110?auto=format&fit=crop&q=80&w=800",
        afterUrl: "https://images.unsplash.com/photo-1598256989800-fe5f95da9767?auto=format&fit=crop&q=80&w=800",
        caption: "Full Mouth Reconstruction",
        order: 0,
      },
      {
        beforeUrl: "https://images.unsplash.com/photo-1629851211420-bf9235d6dc6b?auto=format&fit=crop&q=80&w=800",
        afterUrl: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=800",
        caption: "Cosmetic Veneers",
        order: 1,
      },
    ],
  });

  // Create testimonials content
  await prisma.contentBlock.create({
    data: {
      key: "testimonials",
      value: {
        badge: "Patient Experience",
        title: "Patient Stories from Juba",
        description:
          "Real experiences from families who trust Zylo for their clinical excellence and gentle care.",
        items: [
          {
            name: "Amira Hassan",
            role: "Teacher",
            text: "Dr. Zahir and his team provided exceptional care during my root canal. I was terrified, but their compassion made all the difference. The facility is modern and spotlessly clean.",
            rating: 5,
          },
          {
            name: "Ibrahim Osman",
            role: "Business Owner",
            text: "I've been coming to Zylo for three years now. The professionalism and attention to detail is unmatched. My teeth have never looked better, and I feel confident in my smile again.",
            rating: 5,
          },
          {
            name: "Leila Mohamed",
            role: "Healthcare Professional",
            text: "As a medical professional myself, I appreciate the evidence-based approach Zylo takes to dental care. They explain everything clearly and never rush treatment.",
            rating: 5,
          },
          {
            name: "Karim Abdurahman",
            role: "Student",
            text: "Got my braces adjusted today and the experience was painless. The staff is friendly and the environment is comfortable. Highly recommend!",
            rating: 5,
          },
          {
            name: "Fatima Ali",
            role: "Homemaker",
            text: "My family has been patients here for over 5 years. The consistent quality and genuine care they show for their patients is remarkable. Thank you, Zylo!",
            rating: 5,
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
