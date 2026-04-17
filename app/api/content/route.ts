import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { setContent } from "@/lib/content";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!rateLimit(ip, 20, 60000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { key, value } = await req.json();
    
    if (!key || value === undefined) {
      return NextResponse.json({ error: "Key and value are required" }, { status: 400 });
    }

    // Authentication check for CMS updates
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 });
    }
    
    const result = await setContent(key, value);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("CMS API Error:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
