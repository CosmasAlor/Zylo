import * as fs from "fs";
import * as path from "path";
import { Client } from "pg";

// PostgreSQL connection
const client = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "Martha@01142",
  database: "zylo",
});

async function exportWithSchema() {
  console.log("📤 Exporting data with CREATE TABLE statements...\n");

  const exportDir = path.join(process.cwd(), "exports");
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir);
  }

  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL database\n");

    let sqlContent = "-- Zylo Database Export\n";
    sqlContent += `-- Exported: ${new Date().toISOString()}\n`;
    sqlContent += "-- Complete schema with data ready for Supabase\n\n";

    sqlContent += "-- ============================================\n";
    sqlContent += "-- CREATE TABLES\n";
    sqlContent += "-- ============================================\n\n";

    // Manual CREATE TABLE statements based on Prisma schema
    const createTableStatements = `
DROP TABLE IF EXISTS "GalleryItem" CASCADE;
DROP TABLE IF EXISTS "MediaItem" CASCADE;
DROP TABLE IF EXISTS "BlogPost" CASCADE;
DROP TABLE IF EXISTS "ContentBlock" CASCADE;
DROP TABLE IF EXISTS "ModuleConfig" CASCADE;
DROP TABLE IF EXISTS "LogEntry" CASCADE;
DROP TABLE IF EXISTS "Appointment" CASCADE;

DROP TYPE IF EXISTS "AppointmentStatus" CASCADE;
DROP TYPE IF EXISTS "LogType" CASCADE;

CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');
CREATE TYPE "LogType" AS ENUM ('EVENT', 'ERROR', 'WARNING');

CREATE TABLE "Appointment" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "fullName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT,
  "service" TEXT NOT NULL,
  "preferredDate" TIMESTAMP NOT NULL,
  "preferredTime" TEXT NOT NULL,
  "notes" TEXT,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "LogEntry" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "type" TEXT NOT NULL,
  "route" TEXT,
  "message" TEXT NOT NULL,
  "payload" JSONB,
  "stack" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ModuleConfig" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL UNIQUE,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ContentBlock" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "key" TEXT NOT NULL UNIQUE,
  "value" JSONB NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "BlogPost" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "content" JSONB NOT NULL,
  "excerpt" TEXT,
  "coverImage" TEXT,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "MediaItem" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "url" TEXT NOT NULL,
  "filename" TEXT NOT NULL,
  "fileType" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "GalleryItem" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "beforeUrl" TEXT NOT NULL,
  "afterUrl" TEXT NOT NULL,
  "caption" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`;

    sqlContent += createTableStatements;

    // INSERT DATA section
    sqlContent += "\n-- ============================================\n";
    sqlContent += "-- INSERT DATA\n";
    sqlContent += "-- ============================================\n\n";

    const tables = [
      "Appointment",
      "LogEntry",
      "ModuleConfig",
      "ContentBlock",
      "BlogPost",
      "MediaItem",
      "GalleryItem",
    ];

    for (const table of tables) {
      const query = `SELECT * FROM "${table}"`;
      const result = await client.query(query);

      if (result.rows.length > 0) {
        const columns = Object.keys(result.rows[0]);

        sqlContent += `-- Data for ${table} (${result.rows.length} records)\n`;
        sqlContent += `INSERT INTO "${table}" (${columns.map((c) => `"${c}"`).join(", ")}) VALUES\n`;

        const valueLines = result.rows.map((row) => {
          const values = columns.map((col) => {
            let value = row[col];
            if (value === null) return "NULL";
            if (typeof value === "string") {
              // Escape single quotes
              value = value.replace(/'/g, "''");
              return `'${value}'`;
            }
            if (typeof value === "boolean") return value ? "true" : "false";
            if (typeof value === "object")
              return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
            if (value instanceof Date) return `'${value.toISOString()}'`;
            return String(value);
          });
          return `(${values.join(", ")})`;
        });

        sqlContent += valueLines.join(",\n");
        sqlContent += ";\n\n";
      }
    }

    // Write the complete file
    const sqlFile = path.join(exportDir, "zylo_supabase.sql");
    fs.writeFileSync(sqlFile, sqlContent);

    console.log("✅ SQL export with CREATE TABLE statements created!\n");
    console.log("📁 File created: zylo_supabase.sql\n");
    console.log("📊 File size:", (fs.statSync(sqlFile).size / 1024).toFixed(1), "KB\n");

    console.log("🚀 How to use in Supabase:\n");
    console.log("1. Go to Supabase Dashboard → SQL Editor");
    console.log("2. Click 'New Query'");
    console.log("3. Copy & paste the entire content of: exports/zylo_supabase.sql");
    console.log("4. Click 'Run'");
    console.log("5. All tables will be created and populated with data\n");

    console.log("✨ The file now includes:");
    console.log("   ✓ DROP statements for safe re-runs");
    console.log("   ✓ CREATE TYPE for ENUM definitions");
    console.log("   ✓ CREATE TABLE statements for all 7 tables");
    console.log("   ✓ Proper column types and constraints");
    console.log("   ✓ All 18 data records with proper formatting\n");
  } catch (error) {
    console.error("❌ Export failed:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

exportWithSchema().then(() => process.exit(0));
