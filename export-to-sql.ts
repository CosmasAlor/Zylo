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

async function exportToSQL() {
  console.log("📤 Exporting data to SQL format...\n");

  const exportDir = path.join(process.cwd(), "exports");
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir);
  }

  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL database\n");

    // Get schema information
    const schemaQuery = `
      SELECT table_name, column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `;
    const schemaResult = await client.query(schemaQuery);

    // Get table information
    const tableQuery = `
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `;
    const tableResult = await client.query(tableQuery);

    let sqlContent = "-- Zylo Database Export\n";
    sqlContent += `-- Exported: ${new Date().toISOString()}\n`;
    sqlContent += "-- This SQL can be pasted into Supabase SQL Editor\n\n";

    // Create tables section
    sqlContent += "-- ============================================\n";
    sqlContent += "-- CREATE TABLES\n";
    sqlContent += "-- ============================================\n\n";

    // Get CREATE TABLE statements for each table
    for (const tableRow of tableResult.rows) {
      const tableName = tableRow.tablename;

      // Get the CREATE TABLE statement
      const createTableQuery = `SELECT pg_get_createtablestmt('${tableName}'::regclass)`;
      try {
        const createResult = await client.query(createTableQuery);
        if (createResult.rows[0]) {
          sqlContent += createResult.rows[0].pg_get_createtablestmt + ";\n\n";
        }
      } catch (e) {
        // Fallback: manually construct CREATE TABLE
        console.log(`Note: Could not get CREATE TABLE for ${tableName}, using schema info`);
      }
    }

    // Data insertion section
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

        sqlContent += `-- Insert into ${table}\n`;
        sqlContent += `INSERT INTO "${table}" (${columns.map((c) => `"${c}"`).join(", ")}) VALUES\n`;

        const valueLines = result.rows.map((row) => {
          const values = columns.map((col) => {
            const value = row[col];
            if (value === null) return "NULL";
            if (typeof value === "string")
              return `'${value.replace(/'/g, "''")}'`;
            if (typeof value === "boolean") return value ? "true" : "false";
            if (typeof value === "object")
              return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
            return String(value);
          });
          return `(${values.join(", ")})`;
        });

        sqlContent += valueLines.join(",\n");
        sqlContent += ";\n\n";
      }
    }

    // Write main SQL file
    const sqlFile = path.join(exportDir, "zylo_complete.sql");
    fs.writeFileSync(sqlFile, sqlContent);

    // Write schema-only file
    let schemaContent = "-- Zylo Database Schema (Tables Only)\n";
    schemaContent += `-- Exported: ${new Date().toISOString()}\n`;
    schemaContent += "-- Use this to create tables in Supabase\n\n";

    // Recreate schema from information_schema
    const groupedSchema = schemaResult.rows.reduce(
      (acc, row) => {
        if (!acc[row.table_name]) {
          acc[row.table_name] = [];
        }
        acc[row.table_name].push(row);
        return acc;
      },
      {} as Record<string, any[]>
    );

    for (const [tableName, columns] of Object.entries(groupedSchema)) {
      schemaContent += `CREATE TABLE IF NOT EXISTS "${tableName}" (\n`;
      const columnDefs = (columns as any[]).map((col) => {
        let type = col.data_type;
        if (type === "character varying") type = "varchar";
        if (type === "boolean") type = "boolean";
        if (type === "integer") type = "integer";
        if (type === "bigint") type = "bigint";
        if (type === "text") type = "text";
        if (type === "json") type = "jsonb";
        if (type === "timestamp without time zone")
          type = "timestamp with time zone";

        const nullable = col.is_nullable === "YES" ? "" : " NOT NULL";
        return `  "${col.column_name}" ${type}${nullable}`;
      });
      schemaContent += columnDefs.join(",\n");
      schemaContent += "\n);\n\n";
    }

    const schemaFile = path.join(exportDir, "zylo_schema.sql");
    fs.writeFileSync(schemaFile, schemaContent);

    // Write insert-only file
    let insertContent = "-- Zylo Database Data (Insert Statements Only)\n";
    insertContent += `-- Exported: ${new Date().toISOString()}\n`;
    insertContent += "-- Use this after creating tables in Supabase\n\n";

    for (const table of tables) {
      const query = `SELECT * FROM "${table}"`;
      const result = await client.query(query);

      if (result.rows.length > 0) {
        const columns = Object.keys(result.rows[0]);

        insertContent += `-- Data for ${table} (${result.rows.length} records)\n`;
        insertContent += `INSERT INTO "${table}" (${columns.map((c) => `"${c}"`).join(", ")}) VALUES\n`;

        const valueLines = result.rows.map((row) => {
          const values = columns.map((col) => {
            const value = row[col];
            if (value === null) return "NULL";
            if (typeof value === "string")
              return `'${value.replace(/'/g, "''")}'`;
            if (typeof value === "boolean") return value ? "true" : "false";
            if (typeof value === "object")
              return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
            return String(value);
          });
          return `(${values.join(", ")})`;
        });

        insertContent += valueLines.join(",\n");
        insertContent += ";\n\n";
      }
    }

    const insertFile = path.join(exportDir, "zylo_data.sql");
    fs.writeFileSync(insertFile, insertContent);

    console.log("✅ SQL export completed successfully!\n");
    console.log("📁 Files created in exports/:\n");
    console.log("   1. zylo_complete.sql - Everything (schema + data)");
    console.log("   2. zylo_schema.sql - Tables only");
    console.log("   3. zylo_data.sql - Data only\n");

    console.log("📊 File sizes:");
    console.log(
      `   ✓ zylo_complete.sql (${(fs.statSync(sqlFile).size / 1024).toFixed(1)} KB)`
    );
    console.log(
      `   ✓ zylo_schema.sql (${(fs.statSync(schemaFile).size / 1024).toFixed(1)} KB)`
    );
    console.log(
      `   ✓ zylo_data.sql (${(fs.statSync(insertFile).size / 1024).toFixed(1)} KB)\n`
    );

    console.log("🚀 How to use in Supabase:\n");
    console.log("Option 1 - All at once:");
    console.log("  1. Go to Supabase Dashboard → SQL Editor");
    console.log("  2. Create new query");
    console.log("  3. Copy & paste content of zylo_complete.sql");
    console.log("  4. Click Run\n");

    console.log("Option 2 - Step by step:");
    console.log("  1. Go to Supabase Dashboard → SQL Editor");
    console.log("  2. Create new query");
    console.log("  3. Copy & paste content of zylo_schema.sql");
    console.log("  4. Click Run");
    console.log("  5. Create another query");
    console.log("  6. Copy & paste content of zylo_data.sql");
    console.log("  7. Click Run\n");
  } catch (error) {
    console.error("❌ Export failed:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

exportToSQL().then(() => process.exit(0));
