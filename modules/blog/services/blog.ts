import type { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";

export async function getPosts(publishedOnly = false) {
  try {
    return await prisma.blogPost.findMany({
      where: publishedOnly ? { published: true } : {},
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to load blog posts", error);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  try {
    return await prisma.blogPost.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.error(`Failed to load blog post "${slug}"`, error);
    return null;
  }
}

export async function createPost(data: {
  title: string;
  slug: string;
  content: Prisma.InputJsonValue;
  excerpt?: string;
  coverImage?: string;
  published?: boolean;
}) {
  return prisma.blogPost.create({
    data,
  });
}

export async function updatePost(
  id: string,
  data: Partial<{
    title: string;
    slug: string;
    content: Prisma.InputJsonValue;
    excerpt: string;
    coverImage: string;
    published: boolean;
  }>,
) {
  return prisma.blogPost.update({
    where: { id },
    data,
  });
}

export async function deletePost(id: string) {
  return prisma.blogPost.delete({
    where: { id },
  });
}
