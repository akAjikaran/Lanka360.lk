import { NextResponse } from "next/server";
import { sendWhatsappOtp } from "@/lib/whatsappOtp";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { whatsapp?: string };
  const whatsapp = body.whatsapp?.trim() ?? "";

  if (!whatsapp) {
    return NextResponse.json({ error: "Enter your WhatsApp number." }, { status: 400 });
  }

  const result = await sendWhatsappOtp(whatsapp);

  return NextResponse.json({
    expiresAt: result.expiresAt,
    devCode: result.devCode,
  });
}
