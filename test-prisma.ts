import "dotenv/config";
import prisma from "./lib/prisma";

async function test() {
  try {
    const posts = await prisma.blogPost.findMany();
    console.log("Success! Found posts:", posts.length);
  } catch (err) {
    console.error("Prisma Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
