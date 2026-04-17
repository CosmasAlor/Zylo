import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { getGalleryItems, createGalleryItem, deleteGalleryItem, updateGalleryItem } from "@/modules/gallery/services/gallery";

export async function GET() {
  try {
    const items = await getGalleryItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error("Gallery GET failed:", error);
    // Return an empty array on database connectivity failures so the
    // client can render the page safely instead of crashing.
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const item = await createGalleryItem(data);
    return NextResponse.json(item);
  } catch (error) {
    console.error("Gallery POST failed:", error);
    return NextResponse.json(
      {
        error: "Failed to create",
        message: error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, ...data } = await req.json();
    const item = await updateGalleryItem(id, data);
    return NextResponse.json(item);
  } catch (error) {
    console.error("Gallery PATCH failed:", error);
    return NextResponse.json(
      {
        error: "Update failed",
        message: error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    await deleteGalleryItem(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gallery DELETE failed:", error);
    return NextResponse.json(
      {
        error: "Delete failed",
        message: error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 },
    );
  }
}
