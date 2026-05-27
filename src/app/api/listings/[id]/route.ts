import { NextResponse } from "next/server";
import {
  deleteListingSubmissionByWhatsapp,
  updateListingSubmissionByWhatsapp,
  type ListingSubmissionKind,
} from "@/lib/listingSubmissions";
import { isWhatsappVerificationValid } from "@/lib/whatsappOtp";

export const runtime = "nodejs";

const listingKinds = new Set<ListingSubmissionKind>(["store", "service", "growth", "business"]);

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json()) as Record<string, unknown>;
  const verificationToken = clean(body.verificationToken);
  const kind = clean(body.kind) as ListingSubmissionKind;
  const name = clean(body.name);
  const type = clean(body.type);
  const whatsapp = clean(body.whatsapp);
  const phone = clean(body.phone);
  const description = clean(body.description);
  const address = clean(body.address);
  const district = clean(body.district);
  const imageName = clean(body.imageName);

  if (!listingKinds.has(kind)) {
    return NextResponse.json({ error: "Invalid listing kind." }, { status: 400 });
  }

  if (!verificationToken || !name || !type || !whatsapp || !address || !district) {
    return NextResponse.json({ error: "Please fill all required fields." }, { status: 400 });
  }

  const verified = await isWhatsappVerificationValid({ whatsapp, verificationToken });

  if (!verified) {
    return NextResponse.json({ error: "WhatsApp OTP verification is required." }, { status: 403 });
  }

  const listing = await updateListingSubmissionByWhatsapp({
    id,
    whatsapp,
    input: {
      kind,
      name,
      type,
      whatsapp,
      phone: phone || undefined,
      description: description || undefined,
      address,
      district,
      imageName: imageName || undefined,
    },
  });

  if (!listing) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  return NextResponse.json({ listing });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const whatsapp = searchParams.get("whatsapp")?.trim() ?? "";
  const verificationToken = searchParams.get("verificationToken")?.trim() ?? "";

  const verified = await isWhatsappVerificationValid({ whatsapp, verificationToken });

  if (!verified) {
    return NextResponse.json({ error: "WhatsApp OTP verification is required." }, { status: 403 });
  }

  const deleted = await deleteListingSubmissionByWhatsapp({ id, whatsapp });

  if (!deleted) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
