import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const parikramas = await prisma.parikrama.findMany({
    include: { pilgrim: true },
    orderBy: { createdAt: "desc" },
  });

  const rows = parikramas.map((p) => ({
    id: p.id,
    year: p.year,
    status: p.status,
    createdAt: p.createdAt,
    fullName: p.pilgrim.fullName,
    fullNameHi: p.pilgrim.fullNameHi,
    mobile: p.pilgrim.mobile,
    city: p.pilgrim.city,
    slug: p.pilgrim.slug,
  }));

  return NextResponse.json({ success: true, rows });
}