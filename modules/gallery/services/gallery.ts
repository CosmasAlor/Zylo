import prisma from "@/lib/prisma";

export async function getGalleryItems() {
  return await prisma.galleryItem.findMany({
    orderBy: { order: "asc" },
  });
}

export async function createGalleryItem(data: { beforeUrl: string, afterUrl: string, caption?: string }) {
  const count = await prisma.galleryItem.count();
  return await prisma.galleryItem.create({
    data: {
      ...data,
      order: count,
    },
  });
}

export async function updateGalleryItem(id: string, data: Partial<{ beforeUrl: string, afterUrl: string, caption: string, order: number }>) {
  return await prisma.galleryItem.update({
    where: { id },
    data,
  });
}

export async function deleteGalleryItem(id: string) {
  return await prisma.galleryItem.delete({
    where: { id },
  });
}
