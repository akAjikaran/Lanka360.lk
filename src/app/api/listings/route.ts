import { NextResponse } from "next/server";
import {
  createListingSubmission,
  getListingSubmissionsByOwner,
  getListingSubmissionsByWhatsapp,
  type ListingSubmissionKind,
} from "@/lib/listingSubmissions";

export const runtime = "nodejs";

const listingKinds = new Set<ListingSubmissionKind>(["store", "service", "growth", "business"]);

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const ownerToken = clean(body.ownerToken) || crypto.randomUUID();
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

    if (!name || !type || !whatsapp || !address || !district) {
      return NextResponse.json({ error: "Please fill all required fields." }, { status: 400 });
    }

    const submission = await createListingSubmission({
      ownerToken,
      kind,
      name,
      type,
      whatsapp,
      phone: phone || undefined,
      description: description || undefined,
      address,
      district,
      imageName: imageName || undefined,
    });

    return NextResponse.json({
      id: submission.id,
      status: submission.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not submit listing.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ownerToken = searchParams.get("ownerToken")?.trim() ?? "";
  const whatsapp = searchParams.get("whatsapp")?.trim() ?? "";

  if (whatsapp) {
    const listings = await getListingSubmissionsByWhatsapp(whatsapp);
    return NextResponse.json({ listings });
  }

  if (ownerToken) {
    const listings = await getListingSubmissionsByOwner(ownerToken);
    return NextResponse.json({ listings });
  }

  return NextResponse.json({ error: "Missing owner token or WhatsApp number." }, { status: 400 });
}
