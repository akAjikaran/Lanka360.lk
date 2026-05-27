import { NextResponse } from "next/server";
import { verifyWhatsappOtp } from "@/lib/whatsappOtp";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { whatsapp?: string; code?: string };
  const whatsapp = body.whatsapp?.trim() ?? "";
  const code = body.code?.trim() ?? "";

  const verificationToken = await verifyWhatsappOtp({ whatsapp, code });

  if (!verificationToken) {
    return NextResponse.json({ error: "Invalid or expired OTP." }, { status: 400 });
  }

  return NextResponse.json({ verificationToken });
}
