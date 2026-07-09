import { NextRequest, NextResponse } from "next/server";
import { signSession } from "@/lib/jwt";
import { setSessionCookie } from "@/lib/auth";
import type { VerifyOtpRequest, VerifyOtpResponse } from "@/types/auth";

const MOCK_OTP = "123456";

export async function POST(req: NextRequest) {
  const body: VerifyOtpRequest = await req.json();
  const { mobile, otp } = body;

  if (!mobile || !otp) {
    return NextResponse.json<VerifyOtpResponse>(
      { success: false, message: "मोबाइल व OTP आवश्यक / Mobile and OTP required" },
      { status: 400 }
    );
  }

  // MOCK: hardcoded check. TODO (Phase 2 Step 1b): verify against OtpLog record.
  if (otp !== MOCK_OTP) {
    return NextResponse.json<VerifyOtpResponse>(
      { success: false, message: "गलत OTP / Incorrect OTP" },
      { status: 401 }
    );
  }

  const token = await signSession({ phone: mobile, role: "PILGRIM", verified: true });
  await setSessionCookie(token);

  return NextResponse.json<VerifyOtpResponse>({
    success: true,
    message: "सत्यापित / Verified",
  });
}