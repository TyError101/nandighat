import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["PENDING", "VERIFIED", "REJECTED"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { status } = body;

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { success: false, message: "अमान्य स्थिति / Invalid status" },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.parikrama.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ success: true, status: updated.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "अपडेट विफल / Update failed" },
      { status: 500 }
    );
  }
}