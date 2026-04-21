import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL is not defined in environment variables.");
    return;
  }

  const pool = new Pool({ 
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Checking database connection with adapter...");
    await prisma.$connect();
    console.log("✅ Database connection successful!");
    
    const count = await prisma.contentBlock.count();
    console.log(`✅ ContentBlock table accessible. Found ${count} entries.`);
    
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
