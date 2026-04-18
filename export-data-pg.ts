import { Client } from "pg";
import * as fs from "fs";
import * as path from "path";

// PostgreSQL connection
const client = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "Martha@01142",
  database: "zylo",
});

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
    await client.connect();
    console.log("✅ Connected to PostgreSQL database\n");

    console.log("📦 Exporting data from all tables...\n");

    const tables = [
      { name: "Appointment", plural: "appointments" },
      { name: "LogEntry", plural: "logEntries" },
      { name: "ModuleConfig", plural: "moduleConfigs" },
      { name: "ContentBlock", plural: "contentBlocks" },
      { name: "BlogPost", plural: "blogPosts" },
      { name: "MediaItem", plural: "mediaItems" },
      { name: "GalleryItem", plural: "galleryItems" },
    ];

    const allData: Record<string, unknown[]> = {};
    let totalRecords = 0;

    for (const table of tables) {
      const query = `SELECT * FROM "${table.name}"`;
      const result = await client.query(query);
      const data = result.rows;

      allData[table.plural] = data;
      totalRecords += data.length;

      console.log(`✓ ${table.plural}: ${data.length} records`);

      // Write individual table JSON files
      if (data.length > 0) {
        const filename = `${table.plural}.json`;
        fs.writeFileSync(
          path.join(exportFolder, filename),
          JSON.stringify(data, null, 2)
        );
      }
    }

    // Write combined data file
    fs.writeFileSync(
      path.join(exportFolder, "data.json"),
      JSON.stringify(allData, null, 2)
    );

    // Write summary
    const summary = {
      exportedAt: new Date().toISOString(),
      totalRecords,
      tables: {
        appointments: allData.appointments?.length || 0,
        logEntries: allData.logEntries?.length || 0,
        moduleConfigs: allData.moduleConfigs?.length || 0,
        contentBlocks: allData.contentBlocks?.length || 0,
        blogPosts: allData.blogPosts?.length || 0,
        mediaItems: allData.mediaItems?.length || 0,
        galleryItems: allData.galleryItems?.length || 0,
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

    // List files
    console.log("\n📋 Files created:");
    const files = fs.readdirSync(exportFolder);
    files.forEach((file) => {
      const filePath = path.join(exportFolder, file);
      const stats = fs.statSync(filePath);
      console.log(`   ✓ ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
    });
  } catch (error) {
    console.error("❌ Export failed:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

exportData().then(() => process.exit(0));
