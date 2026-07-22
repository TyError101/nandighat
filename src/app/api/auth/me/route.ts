import { NextResponse } from "next/server";
import { getSessionCookie } from "@/lib/auth";
import { verifySession } from "@/lib/jwt";

export async function GET() {
  const token = await getSessionCookie();
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const session = await verifySession(token);
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    role: session.role,
    phone: session.phone,
  });
}