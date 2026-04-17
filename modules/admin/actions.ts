"use server";

import { db } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function toggleModuleStatus(name: string, isEnabled: boolean) {
  try {
    await db.moduleConfig.upsert({
      where: { name },
      update: { isEnabled },
      create: { name, isEnabled },
    });
    
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle module status", error);
    return { success: false, error: "Failed to update status" };
  }
}
