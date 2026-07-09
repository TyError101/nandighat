import { NextRequest, NextResponse } from "next/server";
import type { SendOtpRequest, SendOtpResponse } from "@/types/auth";

const MOBILE_REGEX = /^[6-9]\d{9}$/;

export async function POST(req: NextRequest) {
  const body: SendOtpRequest = await req.json();
  const { mobile } = body;

  if (!mobile || !MOBILE_REGEX.test(mobile)) {
    return NextResponse.json<SendOtpResponse>(
      { success: false, message: "अमान्य मोबाइल नंबर / Invalid mobile number" },
      { status: 400 }
    );
  }

  // MOCK: no real MSG91 call yet, OTP is always 123456.
  // TODO (Phase 2 Step 1b): replace with real MSG91 API call + OtpLog insert.
  console.log(`[MOCK OTP] Would send OTP to ${mobile}: 123456`);

  return NextResponse.json<SendOtpResponse>({
    success: true,
    message: "OTP भेजा गया / OTP sent",
  });
}