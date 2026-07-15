import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionCookie } from "@/lib/auth";
import { verifySession } from "@/lib/jwt";
import { generateUniqueSlug } from "@/lib/slug";

type FamilyMemberInput = {
  name: string;
  relation: string;
  mobile?: string;
};

type RegisterRequest = {
  fullName: string;
  fullNameHi: string;
  gender: string;
  dob: string;
  gotra?: string;
  mobile: string;
  pincode: string;
  city?: string;
  state?: string;
  year: number;
  familyMembers: FamilyMemberInput[];
};

export async function POST(req: NextRequest) {
  const token = await getSessionCookie();
  if (!token) {
    return NextResponse.json(
      { success: false, message: "सत्र समाप्त / Session expired, please verify OTP again" },
      { status: 401 }
    );
  }

  const session = await verifySession(token);
  if (!session) {
    return NextResponse.json(
      { success: false, message: "अमान्य सत्र / Invalid session" },
      { status: 401 }
    );
  }

  const body: RegisterRequest = await req.json();
  const { fullName, fullNameHi, gender, dob, gotra, mobile, pincode, city, state, year, familyMembers } = body;

  if (!fullName || !fullNameHi || !gender || !dob || !mobile || !pincode) {
    return NextResponse.json(
      { success: false, message: "आवश्यक फ़ील्ड गायब हैं / Missing required fields" },
      { status: 400 }
    );
  }

  if (mobile !== session.phone) {
    return NextResponse.json(
      { success: false, message: "मोबाइल मेल नहीं खाता / Mobile mismatch" },
      { status: 403 }
    );
  }

  try {
    const slug = await generateUniqueSlug(fullName);

    const result = await prisma.$transaction(async (tx) => {
      const pilgrim = await tx.pilgrim.create({
        data: {
          userId: session.userId,
          fullName,
          fullNameHi,
          gender,
          dob: new Date(dob),
          gotra: gotra || null,
          mobile,
          pincode,
          city: city || null,
          state: state || null,
          slug,
        },
      });

      const parikrama = await tx.parikrama.create({
        data: {
          pilgrimId: pilgrim.id,
          year,
          // proofPhotoUrl added in Phase 2 Step 3 (Cloudinary wiring)
        },
      });

      const validFamily = (familyMembers || []).filter((m) => m.name && m.relation);
      if (validFamily.length > 0) {
        await tx.familyMember.createMany({
          data: validFamily.map((m) => ({
            parikramaId: parikrama.id,
            name: m.name,
            relation: m.relation,
            mobile: m.mobile || null,
          })),
        });
      }

      return pilgrim;
    });

    return NextResponse.json({ success: true, slug: result.slug });
  } catch (err) {
    console.error("[register] error:", err);
    return NextResponse.json(
      { success: false, message: "पंजीकरण विफल / Registration failed" },
      { status: 500 }
    );
  }
}