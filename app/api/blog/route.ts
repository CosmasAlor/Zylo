import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";
import { getPosts, createPost, updatePost, deletePost } from "@/modules/blog/services/blog";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const publishedOnly = searchParams.get("published") === "true";
  const postId = searchParams.get("id");
  
  try {
    if (postId) {
      // Fetch single post by ID
      const post = await getPosts(false).then((posts) =>
        posts.find((p) => p.id === postId)
      );
      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
      return NextResponse.json(post);
    }
    
    const posts = await getPosts(publishedOnly);
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Blog fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    if (!data.title || !data.slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }
    const post = await createPost(data);
    return NextResponse.json(post);
  } catch (error) {
    console.error("Blog create error:", error);
    return NextResponse.json({ error: "Failed to create post", details: String(error) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, ...data } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }
    const post = await updatePost(id, data);
    return NextResponse.json(post);
  } catch (error) {
    console.error("Blog update error:", error);
    return NextResponse.json({ error: "Update failed", details: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    await deletePost(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
