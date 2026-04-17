import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { LogType, Prisma } from "@prisma/client";
import { db } from "@/lib/db/prisma";

import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!rateLimit(ip, 10, 60000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const { type, message, route, payload, stack } = body;

    if (!type || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const logEntry = await db.logEntry.create({
      data: {
        type: type as LogType,
        message,
        route,
        payload: payload ? payload : undefined,
        stack,
      },
    });

    return NextResponse.json(logEntry, { status: 201 });
  } catch (error) {
    console.error("Log creation failed", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const q = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    const where: Prisma.LogEntryWhereInput = {};
    if (type) {
      where.type = type as LogType;
    }
    if (q) {
      where.OR = [
        { message: { contains: q, mode: 'insensitive' } },
        { route: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [logs, total] = await Promise.all([
      db.logEntry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      db.logEntry.count({ where }),
    ]);

    return NextResponse.json({ logs, total, page, limit });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.logEntry.deleteMany({});
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
