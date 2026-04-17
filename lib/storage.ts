import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

/**
 * Ensures the upload directory exists.
 */
async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

/**
 * Saves an image (as base64 or Buffer) to the local file system.
 * Returns the public URL path.
 */
export async function saveFile(fileData: string | Buffer, filename: string): Promise<string> {
  await ensureUploadDir();

  const ext = path.extname(filename) || ".png";
  const uniqueName = `${crypto.randomUUID()}${ext}`;
  const filePath = path.join(UPLOAD_DIR, uniqueName);

  let buffer: Buffer;
  if (typeof fileData === "string") {
    // Handle base64
    const base64Data = fileData.replace(/^data:image\/\w+;base64,/, "");
    buffer = Buffer.from(base64Data, "base64");
  } else {
    buffer = fileData;
  }

  await fs.writeFile(filePath, buffer);
  
  return `/uploads/${uniqueName}`;
}

/**
 * Deletes a file from the local file system.
 */
export async function deleteFile(fileUrl: string) {
  const fileName = path.basename(fileUrl);
  const filePath = path.join(UPLOAD_DIR, fileName);
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`Failed to delete file: ${filePath}`, error);
  }
}
