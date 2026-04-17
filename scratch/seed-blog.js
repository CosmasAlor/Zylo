require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}

const client = new Client({ connectionString });
const adapter = new PrismaPg(client);
const prisma = new PrismaClient({ adapter });

async function seedBlogPosts() {
  try {
    // Clear existing posts
    await prisma.blogPost.deleteMany({});
    console.log('Cleared existing blog posts');

    // Create sample blog posts
    const posts = [
      {
        slug: 'top-5-dental-hygiene-tips',
        title: 'Top 5 Dental Hygiene Tips for a Brighter Smile',
        excerpt: 'Learn the essential daily habits that keep your teeth healthy and bright.',
        content: {
          blocks: [
            {
              type: 'paragraph',
              text: 'Good dental hygiene is the foundation of a healthy smile. Follow these five essential tips to maintain your teeth and gums.'
            },
            {
              type: 'heading',
              text: '1. Brush Twice Daily'
            },
            {
              type: 'paragraph',
              text: 'Brush your teeth for at least two minutes, twice a day. Use a soft-bristled toothbrush and fluoride toothpaste.'
            },
            {
              type: 'heading',
              text: '2. Floss Every Day'
            },
            {
              type: 'paragraph',
              text: 'Flossing removes food particles and plaque between your teeth where your brush cannot reach.'
            },
            {
              type: 'heading',
              text: '3. Use Mouthwash'
            },
            {
              type: 'paragraph',
              text: 'A fluoride mouthwash can help strengthen tooth enamel and prevent cavities.'
            },
            {
              type: 'heading',
              text: '4. Limit Sugar Intake'
            },
            {
              type: 'paragraph',
              text: 'Sugar feeds harmful bacteria in your mouth. Reduce sugary drinks and snacks to protect your teeth.'
            },
            {
              type: 'heading',
              text: '5. Visit Your Dentist Regularly'
            },
            {
              type: 'paragraph',
              text: 'Professional cleanings and checkups twice a year help catch problems early.'
            }
          ]
        },
        coverImage: '/uploads/dental-hygiene.jpg',
        published: true
      },
      {
        slug: 'benefits-of-teeth-whitening',
        title: 'The Benefits of Professional Teeth Whitening',
        excerpt: 'Discover how professional whitening can transform your smile safely and effectively.',
        content: {
          blocks: [
            {
              type: 'paragraph',
              text: 'Professional teeth whitening is one of the most popular cosmetic dental procedures. Here are the key benefits:'
            },
            {
              type: 'heading',
              text: 'Faster Results'
            },
            {
              type: 'paragraph',
              text: 'Professional whitening works much faster than over-the-counter products, often showing results in a single appointment.'
            },
            {
              type: 'heading',
              text: 'Safer Process'
            },
            {
              type: 'paragraph',
              text: 'Dentists use professional-grade whitening agents that are safe for your enamel when applied correctly.'
            },
            {
              type: 'heading',
              text: 'Longer-Lasting'
            },
            {
              type: 'paragraph',
              text: 'Professional treatments last longer than at-home solutions, with results lasting several months to years.'
            }
          ]
        },
        coverImage: '/uploads/teeth-whitening.jpg',
        published: true
      },
      {
        slug: 'understanding-dental-implants',
        title: 'Everything You Need to Know About Dental Implants',
        excerpt: 'A comprehensive guide to dental implants and how they can restore your smile.',
        content: {
          blocks: [
            {
              type: 'paragraph',
              text: 'Dental implants are a revolutionary solution for missing teeth. They provide a permanent, natural-looking replacement.'
            },
            {
              type: 'heading',
              text: 'What Are Dental Implants?'
            },
            {
              type: 'paragraph',
              text: 'Dental implants are artificial tooth roots made of titanium that are surgically placed into the jawbone.'
            },
            {
              type: 'heading',
              text: 'The Procedure'
            },
            {
              type: 'paragraph',
              text: 'The procedure typically involves multiple appointments over several months. First, the implant is placed, then it integrates with the bone, and finally the crown is attached.'
            },
            {
              type: 'heading',
              text: 'Benefits'
            },
            {
              type: 'paragraph',
              text: 'Implants look and feel like natural teeth, preserve bone structure, and can last a lifetime with proper care.'
            }
          ]
        },
        coverImage: '/uploads/dental-implants.jpg',
        published: true
      }
    ];

    for (const post of posts) {
      const created = await prisma.blogPost.create({ data: post });
      console.log(`Created post: ${created.title}`);
    }

    console.log('Blog posts seeded successfully!');
  } catch (error) {
    console.error('Error seeding blog posts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedBlogPosts();
