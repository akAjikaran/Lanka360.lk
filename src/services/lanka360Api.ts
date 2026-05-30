import type { ListingSubmission, ListingSubmissionKind } from "@/lib/listingSubmissions";

type ApiErrorResponse = {
  error?: string;
};

type CreateListingInput = {
  kind: ListingSubmissionKind;
  name: FormDataEntryValue | null;
  type: string;
  whatsapp: string;
  phone: string;
  brandColor: FormDataEntryValue | null;
  description: FormDataEntryValue | null;
  address: FormDataEntryValue | null;
  district: FormDataEntryValue | null;
  googleMapsUrl?: FormDataEntryValue | null;
};

type UpdateListingInput = {
  ownerToken: string;
  verificationToken: string;
  kind: FormDataEntryValue | null;
  name: FormDataEntryValue | null;
  type: FormDataEntryValue | null;
  whatsapp: FormDataEntryValue | null;
  phone: FormDataEntryValue | null;
  brandColor: FormDataEntryValue | null;
  description: FormDataEntryValue | null;
  address: FormDataEntryValue | null;
  district: FormDataEntryValue | null;
  imageName?: string;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_LANKA360_API_BASE_URL?.replace(/\/$/, "") ?? "";

function serviceUrl(path: string) {
  return apiBaseUrl ? `${apiBaseUrl}${path}` : path;
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(serviceUrl(path), {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  const responseText = await response.text();
  const result = responseText ? (JSON.parse(responseText) as T & ApiErrorResponse) : ({} as T & ApiErrorResponse);

  if (!response.ok) {
    throw new Error(result.error ?? "Service request failed.");
  }

  return result;
}

export function createListingSubmission(input: CreateListingInput) {
  return requestJson<{ id: string; status: ListingSubmission["status"] }>("/api/listings", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getOwnerListings(ownerToken: string) {
  return requestJson<{ listings: ListingSubmission[] }>(`/api/listings?ownerToken=${encodeURIComponent(ownerToken)}`);
}

export function sendListingOtp(whatsapp: string) {
  return requestJson<{ expiresAt?: string; devCode?: string }>("/api/otp/send", {
    method: "POST",
    body: JSON.stringify({ whatsapp }),
  });
}

export function verifyListingOtp({ whatsapp, code }: { whatsapp: string; code: string }) {
  return requestJson<{ verificationToken: string }>("/api/otp/verify", {
    method: "POST",
    body: JSON.stringify({ whatsapp, code }),
  });
}

export function deleteListingSubmission({
  id,
  whatsapp,
  verificationToken,
}: {
  id: string;
  whatsapp: string;
  verificationToken: string;
}) {
  const params = new URLSearchParams({ whatsapp, verificationToken });

  return requestJson<{ ok: true }>(`/api/listings/${id}?${params.toString()}`, {
    method: "DELETE",
  });
}

export function updateListingSubmission(id: string, input: UpdateListingInput) {
  return requestJson<{ listing: ListingSubmission }>(`/api/listings/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
