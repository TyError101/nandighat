import { prisma } from "@/lib/prisma";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function randomSuffix(length = 5): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export async function generateUniqueSlug(fullName: string): Promise<string> {
  const base = slugify(fullName) || "pilgrim";
  for (let attempt = 0; attempt < 10; attempt++) {
    const candidate = `${base}-${randomSuffix()}`;
    const existing = await prisma.pilgrim.findUnique({ where: { slug: candidate } });
    if (!existing) return candidate;
  }
  return `${base}-${Date.now()}`; // extremely unlikely fallback
}