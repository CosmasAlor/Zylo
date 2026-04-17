import type { Prisma } from "@prisma/client";
import { revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";

import prisma from "@/lib/prisma";

const getCachedContent = unstable_cache(
  async (key: string) => {
    try {
      const block = await prisma.contentBlock.findUnique({ where: { key } });
      return block?.value ?? null;
    } catch (error) {
      console.error(`Failed to load content block "${key}"`, error);
      return null;
    }
  },
  ["cms-content"],
  { tags: ["cms-content"] },
);

export const getContent = cache(async (key: string) => {
  return getCachedContent(key);
});

export async function setContent(key: string, value: Prisma.InputJsonValue) {
  const result = await prisma.contentBlock.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });

  revalidateTag("cms-content", "max");
  return result;
}
