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
      },
      {
        slug: 'preventing-tooth-decay',
        title: 'Preventing Tooth Decay: A Complete Guide',
        excerpt: 'Learn how to protect your teeth from decay with proven prevention strategies.',
        content: {
          blocks: [
            {
              type: 'paragraph',
              text: 'Tooth decay is one of the most common dental problems worldwide. The good news is that it\'s largely preventable with proper care and habits.'
            },
            {
              type: 'heading',
              text: 'Understanding Tooth Decay'
            },
            {
              type: 'paragraph',
              text: 'Tooth decay occurs when bacteria in your mouth produce acids that attack tooth enamel. Without proper care, this can lead to cavities and more serious dental issues.'
            },
            {
              type: 'heading',
              text: 'Daily Prevention Habits'
            },
            {
              type: 'paragraph',
              text: 'The foundation of decay prevention is consistent daily habits. Brush twice daily with fluoride toothpaste, floss once daily, and use mouthwash to reduce bacteria.'
            },
            {
              type: 'heading',
              text: 'Dietary Considerations'
            },
            {
              type: 'paragraph',
              text: 'Limit sugary and acidic foods and drinks. When you do consume them, rinse your mouth with water afterward to neutralize acids.'
            },
            {
              type: 'heading',
              text: 'Professional Care'
            },
            {
              type: 'paragraph',
              text: 'Regular dental checkups and cleanings are essential. Your dentist can catch early signs of decay and provide preventive treatments like sealants.'
            },
            {
              type: 'heading',
              text: 'Fluoride Protection'
            },
            {
              type: 'paragraph',
              text: 'Fluoride strengthens tooth enamel and makes it more resistant to acid attacks. Use fluoride toothpaste and consider professional fluoride treatments.'
            }
          ]
        },
        coverImage: '/uploads/tooth-decay.jpg',
        published: true
      },
      {
        slug: 'orthodontic-treatments-explained',
        title: 'Orthodontic Treatments: From Braces to Invisalign',
        excerpt: 'Explore modern orthodontic options to achieve a straighter, healthier smile.',
        content: {
          blocks: [
            {
              type: 'paragraph',
              text: 'Orthodontic treatment has come a long way from traditional metal braces. Today, patients have many options to straighten their teeth and improve their smile.'
            },
            {
              type: 'heading',
              text: 'Traditional Metal Braces'
            },
            {
              type: 'paragraph',
              text: 'Metal braces remain the most effective and affordable option for complex orthodontic cases. They use brackets and wires to gradually move teeth into proper alignment.'
            },
            {
              type: 'heading',
              text: 'Ceramic Braces'
            },
            {
              type: 'paragraph',
              text: 'Ceramic braces work the same way as metal braces but use tooth-colored or clear brackets that are less noticeable. They\'re a good middle ground between effectiveness and aesthetics.'
            },
            {
              type: 'heading',
              text: 'Invisalign Clear Aligners'
            },
            {
              type: 'paragraph',
              text: 'Invisalign uses a series of clear, removable aligners that are virtually invisible. They\'re popular for adults who want discreet treatment but may not be suitable for all cases.'
            },
            {
              type: 'heading',
              text: 'Lingual Braces'
            },
            {
              type: 'paragraph',
              text: 'Lingual braces are attached to the back of teeth, making them completely invisible from the front. They\'re custom-made for each patient and highly effective.'
            },
            {
              type: 'heading',
              text: 'Treatment Duration'
            },
            {
              type: 'paragraph',
              text: 'Most orthodontic treatments take 12-24 months, depending on the complexity of the case. Regular adjustments and proper wear of aligners are crucial for success.'
            },
            {
              type: 'heading',
              text: 'After Treatment Care'
            },
            {
              type: 'paragraph',
              text: 'After active treatment, patients typically wear retainers to maintain their new smile. This is a lifelong commitment to prevent teeth from shifting back.'
            }
          ]
        },
        coverImage: '/uploads/orthodontics.jpg',
        published: true
      },
      {
        slug: 'emergency-dental-care',
        title: 'Emergency Dental Care: What to Do When You Need Help Fast',
        excerpt: 'Know how to handle dental emergencies and when to seek immediate professional care.',
        content: {
          blocks: [
            {
              type: 'paragraph',
              text: 'Dental emergencies can happen at any time. Knowing how to respond can save your teeth and prevent complications. Here\'s what you need to know.'
            },
            {
              type: 'heading',
              text: 'Severe Tooth Pain'
            },
            {
              type: 'paragraph',
              text: 'Intense, persistent tooth pain could indicate infection or damage. Rinse with warm water, use dental floss to remove any trapped food, and contact your dentist immediately.'
            },
            {
              type: 'heading',
              text: 'Knocked-Out Tooth'
            },
            {
              type: 'paragraph',
              text: 'If a permanent tooth is knocked out, handle it by the crown only. Rinse gently with water if dirty, and try to reinsert it into the socket. If that\'s not possible, place it in milk and seek emergency dental care within 30 minutes.'
            },
            {
              type: 'heading',
              text: 'Broken or Chipped Tooth'
            },
            {
              type: 'paragraph',
              text: 'Save any broken pieces and rinse your mouth with warm water. Apply a cold compress to reduce swelling and contact your dentist right away.'
            },
            {
              type: 'heading',
              text: 'Lost Filling or Crown'
            },
            {
              type: 'paragraph',
              text: 'Temporary solutions include using dental cement from a pharmacy or sugar-free gum to hold a crown in place. See your dentist as soon as possible for a permanent fix.'
            },
            {
              type: 'heading',
              text: 'Abscess or Swelling'
            },
            {
              type: 'paragraph',
              text: 'Signs of infection include swelling, fever, or pus. This requires immediate antibiotic treatment and possibly drainage. Don\'t delay seeking care.'
            },
            {
              type: 'heading',
              text: 'Soft Tissue Injuries'
            },
            {
              type: 'paragraph',
              text: 'For cuts to the tongue, lips, or gums, apply pressure with a clean cloth. If bleeding doesn\'t stop or the injury is severe, seek emergency care.'
            },
            {
              type: 'heading',
              text: 'Prevention and Preparation'
            },
            {
              type: 'paragraph',
              text: 'Keep your dentist\'s emergency number handy and know the location of the nearest emergency dental clinic. Regular dental care reduces the risk of emergencies.'
            }
          ]
        },
        coverImage: '/uploads/dental-emergency.jpg',
        published: true
      },
      {
        slug: 'pediatric-dentistry-guide',
        title: 'Pediatric Dentistry: Caring for Your Child\'s Smile',
        excerpt: 'Everything parents need to know about children\'s dental health from infancy to adolescence.',
        content: {
          blocks: [
            {
              type: 'paragraph',
              text: 'Children\'s dental health is crucial for their overall development. Early dental care sets the foundation for a lifetime of healthy smiles.'
            },
            {
              type: 'heading',
              text: 'First Dental Visit'
            },
            {
              type: 'paragraph',
              text: 'The American Academy of Pediatric Dentistry recommends that children see a dentist by their first birthday or when their first tooth appears, whichever comes first.'
            },
            {
              type: 'heading',
              text: 'Teething and Oral Development'
            },
            {
              type: 'paragraph',
              text: 'Teething typically begins around 6 months. Clean emerging teeth with a soft cloth and introduce a toothbrush when teeth touch. Avoid putting babies to bed with bottles.'
            },
            {
              type: 'heading',
              text: 'Proper Brushing Techniques'
            },
            {
              type: 'paragraph',
              text: 'For children under 3, use a rice-sized amount of fluoride toothpaste. Children 3-6 should use a pea-sized amount. Always supervise brushing until age 8.'
            },
            {
              type: 'heading',
              text: 'Diet and Nutrition'
            },
            {
              type: 'paragraph',
              text: 'Limit sugary snacks and drinks. Encourage water and healthy foods that support dental health. Calcium-rich foods help build strong teeth.'
            },
            {
              type: 'heading',
              text: 'Preventive Treatments'
            },
            {
              type: 'paragraph',
              text: 'Dental sealants protect molars from decay. Fluoride treatments strengthen enamel. Regular cleanings remove plaque and catch problems early.'
            },
            {
              type: 'heading',
              text: 'Common Pediatric Dental Issues'
            },
            {
              type: 'paragraph',
              text: 'Thumb sucking, pacifier use, and tongue thrusting can affect dental development. Most children stop these habits naturally, but persistent habits may need intervention.'
            },
            {
              type: 'heading',
              text: 'Sports Safety'
            },
            {
              type: 'paragraph',
              text: 'Mouthguards protect teeth during sports. Custom-fitted mouthguards from your dentist offer the best protection and comfort.'
            },
            {
              type: 'heading',
              text: 'Building Positive Dental Habits'
            },
            {
              type: 'paragraph',
              text: 'Make dental care fun and routine. Use positive reinforcement, let children pick their toothbrush, and model good oral hygiene habits yourself.'
            }
          ]
        },
        coverImage: '/uploads/pediatric-dentistry.jpg',
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
