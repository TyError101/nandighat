import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("ng_session")?.value;
  const session = token ? await verifySession(token) : null;

  if (!session || session.role !== "ADMIN") {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, message: "अनधिकृत / Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};