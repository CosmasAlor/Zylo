import prisma from "@/lib/prisma";
import { saveFile, deleteFile } from "@/lib/storage";

export async function getAllMedia() {
  return await prisma.mediaItem.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function uploadMedia(fileData: string | Buffer, filename: string, fileType: string) {
  const url = await saveFile(fileData, filename);
  
  // Calculate approximate size if it's a Buffer
  const size = Buffer.isBuffer(fileData) ? fileData.length : Math.round((fileData.length * 3) / 4);

  return await prisma.mediaItem.create({
    data: {
      url,
      filename,
      fileType,
      size,
    },
  });
}

export async function removeMedia(id: string) {
  const item = await prisma.mediaItem.findUnique({ where: { id } });
  if (item) {
    await deleteFile(item.url);
    return await prisma.mediaItem.delete({ where: { id } });
  }
}
