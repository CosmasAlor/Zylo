import { NextResponse } from "next/server";
import db from "@/lib/prisma";

/**
 * Health check endpoint for monitoring application status
 * Returns comprehensive health information including database connectivity
 */
export async function GET() {
  const startTime = Date.now();
  let databaseStatus = "unknown";
  let databaseError: string | null = null;

  // Test database connectivity
  try {
    await db.$queryRaw`SELECT 1`;
    databaseStatus = "healthy";
  } catch (error) {
    databaseStatus = "unhealthy";
    databaseError = error instanceof Error ? error.message : "Unknown database error";
  }

  const responseTime = Date.now() - startTime;
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();

  // Determine overall health status
  const isHealthy = databaseStatus === "healthy";

  const healthData = {
    status: isHealthy ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(uptime),
    responseTime: `${responseTime}ms`,
    environment: process.env.NODE_ENV || "unknown",
    version: process.env.npm_package_version || "1.0.0",
    services: {
      database: {
        status: databaseStatus,
        error: databaseError,
      },
    },
    system: {
      memory: {
        used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
      },
      platform: process.platform,
      nodeVersion: process.version,
    },
    endpoints: {
      auth: "/api/auth/session",
      blog: "/api/blog",
      admin: "/admin",
    },
  };

  // Return appropriate HTTP status code
  const statusCode = isHealthy ? 200 : 503;
  
  return NextResponse.json(healthData, {
    status: statusCode,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}
