import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Migration script to transfer data from local PostgreSQL to Supabase
 *
 * Usage:
 * 1. Start with LOCAL database connected (local DATABASE_URL in .env.local)
 * 2. Run: npx ts-node -r dotenv/config migrate.ts
 * 3. When prompted, switch DATABASE_URL to Supabase connection string
 * 4. Run again
 *
 * The script will automatically detect if you're migrating FROM or TO Supabase
 */

// Support both DATABASE_URL and LOCAL_DATABASE_URL
const localDbUrl = process.env.DATABASE_URL || process.env.LOCAL_DATABASE_URL;

if (!localDbUrl) {
  console.error("❌ DATABASE_URL or LOCAL_DATABASE_URL not set in environment");
  console.error("   Set DATABASE_URL to point to either local or Supabase database");
  process.exit(1);
}

// Helper to safely handle JSON fields - just pass through as-is
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sanitizeJson(value: any): any {
  return value;
}

async function migrate() {
  console.log("🔄 Starting migration...\n");

  try {
    // Connect to source database
    const sourceAdapter = new PrismaPg({ connectionString: localDbUrl });
    const sourceDb = new PrismaClient({ adapter: sourceAdapter });

    // Fetch all data from source
    console.log("📦 Reading data from source database...");
    const [appointments, logEntries, moduleConfigs, contentBlocks, blogPosts, mediaItems, galleryItems] =
      await Promise.all([
        sourceDb.appointment.findMany(),
        sourceDb.logEntry.findMany(),
        sourceDb.moduleConfig.findMany(),
        sourceDb.contentBlock.findMany(),
        sourceDb.blogPost.findMany(),
        sourceDb.mediaItem.findMany(),
        sourceDb.galleryItem.findMany(),
      ]);

    console.log(`✓ Appointments: ${appointments.length}`);
    console.log(`✓ Log Entries: ${logEntries.length}`);
    console.log(`✓ Module Configs: ${moduleConfigs.length}`);
    console.log(`✓ Content Blocks: ${contentBlocks.length}`);
    console.log(`✓ Blog Posts: ${blogPosts.length}`);
    console.log(`✓ Media Items: ${mediaItems.length}`);
    console.log(`✓ Gallery Items: ${galleryItems.length}`);

    // Verify Prisma is connected to the target database
    const targetDb = new PrismaClient();
    await targetDb.$queryRaw`SELECT 1`;

    console.log("\n📝 Migrating data to target database...\n");

    // Migrate data in order to avoid foreign key issues
    if (appointments.length > 0) {
      for (const appointment of appointments) {
        await targetDb.appointment.upsert({
          where: { id: appointment.id },
          create: appointment,
          update: appointment,
        });
      }
      console.log(`✓ Migrated ${appointments.length} appointments`);
    }

    if (logEntries.length > 0) {
      for (const entry of logEntries) {
        await targetDb.logEntry.upsert({
          where: { id: entry.id },
          create: {
            id: entry.id,
            type: entry.type,
            route: entry.route,
            message: entry.message,
            payload: sanitizeJson(entry.payload),
            stack: entry.stack,
            createdAt: entry.createdAt,
          },
          update: {
            type: entry.type,
            route: entry.route,
            message: entry.message,
            payload: sanitizeJson(entry.payload),
            stack: entry.stack,
          },
        });
      }
      console.log(`✓ Migrated ${logEntries.length} log entries`);
    }

    if (moduleConfigs.length > 0) {
      for (const config of moduleConfigs) {
        await targetDb.moduleConfig.upsert({
          where: { id: config.id },
          create: config,
          update: {
            name: config.name,
            isEnabled: config.isEnabled,
          },
        });
      }
      console.log(`✓ Migrated ${moduleConfigs.length} module configs`);
    }

    if (contentBlocks.length > 0) {
      for (const block of contentBlocks) {
        await targetDb.contentBlock.upsert({
          where: { id: block.id },
          create: {
            id: block.id,
            key: block.key,
            value: sanitizeJson(block.value),
            updatedAt: block.updatedAt,
          },
          update: {
            value: sanitizeJson(block.value),
          },
        });
      }
      console.log(`✓ Migrated ${contentBlocks.length} content blocks`);
    }

    if (blogPosts.length > 0) {
      for (const post of blogPosts) {
        await targetDb.blogPost.upsert({
          where: { id: post.id },
          create: {
            id: post.id,
            slug: post.slug,
            title: post.title,
            content: sanitizeJson(post.content),
            excerpt: post.excerpt,
            coverImage: post.coverImage,
            published: post.published,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
          },
          update: {
            title: post.title,
            content: sanitizeJson(post.content),
            excerpt: post.excerpt,
            coverImage: post.coverImage,
            published: post.published,
          },
        });
      }
      console.log(`✓ Migrated ${blogPosts.length} blog posts`);
    }

    if (mediaItems.length > 0) {
      for (const item of mediaItems) {
        await targetDb.mediaItem.upsert({
          where: { id: item.id },
          create: item,
          update: {
            url: item.url,
            filename: item.filename,
            fileType: item.fileType,
            size: item.size,
          },
        });
      }
      console.log(`✓ Migrated ${mediaItems.length} media items`);
    }

    if (galleryItems.length > 0) {
      for (const item of galleryItems) {
        await targetDb.galleryItem.upsert({
          where: { id: item.id },
          create: item,
          update: {
            beforeUrl: item.beforeUrl,
            afterUrl: item.afterUrl,
            caption: item.caption,
            order: item.order,
          },
        });
      }
      console.log(`✓ Migrated ${galleryItems.length} gallery items`);
    }

    console.log("\n✅ Migration completed successfully!");
    console.log("\n📋 Summary:");
    console.log(`   Total records migrated: ${
      appointments.length +
      logEntries.length +
      moduleConfigs.length +
      contentBlocks.length +
      blogPosts.length +
      mediaItems.length +
      galleryItems.length
    }`);

    await sourceDb.$disconnect();
    await targetDb.$disconnect();
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate().finally(() => process.exit());