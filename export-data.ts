import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function exportData() {
  console.log("📤 Starting data export...\n");

  const exportDir = path.join(process.cwd(), "exports");
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const exportFolder = path.join(exportDir, `export-${timestamp}`);
  fs.mkdirSync(exportFolder);

  try {
    // Export all tables
    console.log("📦 Exporting data from all tables...\n");

    const [appointments, logEntries, moduleConfigs, contentBlocks, blogPosts, mediaItems, galleryItems] =
      await Promise.all([
        prisma.appointment.findMany(),
        prisma.logEntry.findMany(),
        prisma.moduleConfig.findMany(),
        prisma.contentBlock.findMany(),
        prisma.blogPost.findMany(),
        prisma.mediaItem.findMany(),
        prisma.galleryItem.findMany(),
      ]);

    // Write JSON files
    const data = {
      appointments,
      logEntries,
      moduleConfigs,
      contentBlocks,
      blogPosts,
      mediaItems,
      galleryItems,
    };

    const exportFile = path.join(exportFolder, "data.json");
    fs.writeFileSync(exportFile, JSON.stringify(data, null, 2));

    console.log(`✓ Appointments: ${appointments.length}`);
    console.log(`✓ Log Entries: ${logEntries.length}`);
    console.log(`✓ Module Configs: ${moduleConfigs.length}`);
    console.log(`✓ Content Blocks: ${contentBlocks.length}`);
    console.log(`✓ Blog Posts: ${blogPosts.length}`);
    console.log(`✓ Media Items: ${mediaItems.length}`);
    console.log(`✓ Gallery Items: ${galleryItems.length}`);

    const totalRecords =
      appointments.length +
      logEntries.length +
      moduleConfigs.length +
      contentBlocks.length +
      blogPosts.length +
      mediaItems.length +
      galleryItems.length;

    // Write individual table exports
    console.log("\n📝 Writing individual table exports...\n");

    if (appointments.length > 0) {
      fs.writeFileSync(
        path.join(exportFolder, "appointments.json"),
        JSON.stringify(appointments, null, 2)
      );
      console.log(`✓ appointments.json`);
    }

    if (logEntries.length > 0) {
      fs.writeFileSync(
        path.join(exportFolder, "log-entries.json"),
        JSON.stringify(logEntries, null, 2)
      );
      console.log(`✓ log-entries.json`);
    }

    if (moduleConfigs.length > 0) {
      fs.writeFileSync(
        path.join(exportFolder, "module-configs.json"),
        JSON.stringify(moduleConfigs, null, 2)
      );
      console.log(`✓ module-configs.json`);
    }

    if (contentBlocks.length > 0) {
      fs.writeFileSync(
        path.join(exportFolder, "content-blocks.json"),
        JSON.stringify(contentBlocks, null, 2)
      );
      console.log(`✓ content-blocks.json`);
    }

    if (blogPosts.length > 0) {
      fs.writeFileSync(
        path.join(exportFolder, "blog-posts.json"),
        JSON.stringify(blogPosts, null, 2)
      );
      console.log(`✓ blog-posts.json`);
    }

    if (mediaItems.length > 0) {
      fs.writeFileSync(
        path.join(exportFolder, "media-items.json"),
        JSON.stringify(mediaItems, null, 2)
      );
      console.log(`✓ media-items.json`);
    }

    if (galleryItems.length > 0) {
      fs.writeFileSync(
        path.join(exportFolder, "gallery-items.json"),
        JSON.stringify(galleryItems, null, 2)
      );
      console.log(`✓ gallery-items.json`);
    }

    // Write summary
    const summary = {
      exportedAt: new Date().toISOString(),
      totalRecords,
      tables: {
        appointments: appointments.length,
        logEntries: logEntries.length,
        moduleConfigs: moduleConfigs.length,
        contentBlocks: contentBlocks.length,
        blogPosts: blogPosts.length,
        mediaItems: mediaItems.length,
        galleryItems: galleryItems.length,
      },
    };

    fs.writeFileSync(
      path.join(exportFolder, "summary.json"),
      JSON.stringify(summary, null, 2)
    );

    console.log("\n✅ Export completed successfully!");
    console.log(`\n📁 Export location: ${exportFolder}`);
    console.log(`\n📊 Summary:\n   Total records exported: ${totalRecords}`);
    console.log(`   Files created: data.json + 7 individual table files + summary.json`);
  } catch (error) {
    console.error("❌ Export failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

exportData().then(() => process.exit(0));
