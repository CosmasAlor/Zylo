import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { getAllMedia, uploadMedia, removeMedia } from "@/modules/media/services/media";

export async function GET() {
  try {
    const media = await getAllMedia();
    return NextResponse.json(media);
  } catch {
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { fileData, filename, fileType } = await req.json();
    if (!fileData || !filename) {
      return NextResponse.json({ error: "Missing file data" }, { status: 400 });
    }

    const item = await uploadMedia(fileData, filename, fileType || "image/png");
    return NextResponse.json(item);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    await removeMedia(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
