import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type ListingSubmissionKind = "store" | "service" | "growth" | "business";

export type ListingSubmissionInput = {
  ownerToken: string;
  kind: ListingSubmissionKind;
  name: string;
  type: string;
  whatsapp: string;
  phone?: string;
  description?: string;
  address: string;
  district: string;
  imageName?: string;
};

export type ListingSubmission = ListingSubmissionInput & {
  id: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

const submissionsFilePath = path.join(process.cwd(), "data", "listing-submissions.json");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function normalizeWhatsapp(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("94")) {
    return digits;
  }

  if (digits.startsWith("0")) {
    return `94${digits.slice(1)}`;
  }

  return digits;
}

function toSupabaseRow(submission: ListingSubmission) {
  return {
    id: submission.id,
    owner_token: submission.ownerToken,
    kind: submission.kind,
    name: submission.name,
    type: submission.type,
    whatsapp: submission.whatsapp,
    whatsapp_normalized: normalizeWhatsapp(submission.whatsapp),
    phone: submission.phone ?? null,
    description: submission.description ?? null,
    address: submission.address,
    district: submission.district,
    image_name: submission.imageName ?? null,
    status: submission.status,
    created_at: submission.createdAt,
  };
}

function toLegacySupabaseRow(submission: ListingSubmission) {
  const { whatsapp_normalized: _whatsappNormalized, ...row } = toSupabaseRow(submission);
  return row;
}

function fromSupabaseRow(row: Record<string, unknown>): ListingSubmission {
  return {
    id: String(row.id),
    ownerToken: String(row.owner_token ?? ""),
    kind: row.kind as ListingSubmissionKind,
    name: String(row.name),
    type: String(row.type),
    whatsapp: String(row.whatsapp),
    phone: typeof row.phone === "string" ? row.phone : undefined,
    description: typeof row.description === "string" ? row.description : undefined,
    address: String(row.address),
    district: String(row.district),
    imageName: typeof row.image_name === "string" ? row.image_name : undefined,
    status: row.status as ListingSubmission["status"],
    createdAt: String(row.created_at),
  };
}

async function createSupabaseSubmission(submission: ListingSubmission) {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return false;
  }

  let response = await fetch(`${supabaseUrl}/rest/v1/listing_submissions`, {
    method: "POST",
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(toSupabaseRow(submission)),
  });

  if (!response.ok) {
    const errorText = await response.text();

    if (errorText.includes("whatsapp_normalized")) {
      response = await fetch(`${supabaseUrl}/rest/v1/listing_submissions`, {
        method: "POST",
        headers: {
          apikey: supabaseServiceRoleKey,
          Authorization: `Bearer ${supabaseServiceRoleKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(toLegacySupabaseRow(submission)),
      });
    } else {
      throw new Error(errorText || "Could not save listing submission to Supabase.");
    }
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Could not save listing submission to Supabase.");
  }

  return true;
}

async function readSubmissions() {
  try {
    const file = await readFile(submissionsFilePath, "utf8");
    return JSON.parse(file) as ListingSubmission[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

export async function createListingSubmission(input: ListingSubmissionInput) {
  const submission: ListingSubmission = {
    ...input,
    id: crypto.randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const savedToSupabase = await createSupabaseSubmission(submission);

  if (savedToSupabase) {
    return submission;
  }

  const submissions = await readSubmissions();

  await mkdir(path.dirname(submissionsFilePath), { recursive: true });
  await writeFile(submissionsFilePath, JSON.stringify([submission, ...submissions], null, 2));

  return submission;
}

export async function getListingSubmissionsByWhatsapp(whatsapp: string) {
  const normalizedWhatsapp = normalizeWhatsapp(whatsapp);

  if (!normalizedWhatsapp) {
    return [];
  }

  if (supabaseUrl && supabaseServiceRoleKey) {
    const params = new URLSearchParams({
      select: "*",
      order: "created_at.desc",
      or: `(whatsapp.eq.${whatsapp},whatsapp_normalized.eq.${normalizedWhatsapp})`,
    });

    const response = await fetch(`${supabaseUrl}/rest/v1/listing_submissions?${params.toString()}`, {
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const rows = (await response.json()) as Record<string, unknown>[];
    return rows.map(fromSupabaseRow);
  }

  const submissions = await readSubmissions();
  return submissions.filter((submission) => normalizeWhatsapp(submission.whatsapp) === normalizedWhatsapp);
}

export async function getListingSubmissionsByOwner(ownerToken: string) {
  if (!ownerToken) {
    return [];
  }

  if (supabaseUrl && supabaseServiceRoleKey) {
    const params = new URLSearchParams({
      select: "*",
      owner_token: `eq.${ownerToken}`,
      order: "created_at.desc",
    });

    const response = await fetch(`${supabaseUrl}/rest/v1/listing_submissions?${params.toString()}`, {
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const rows = (await response.json()) as Record<string, unknown>[];
    return rows.map(fromSupabaseRow);
  }

  const submissions = await readSubmissions();
  return submissions.filter((submission) => submission.ownerToken === ownerToken);
}

export async function updateListingSubmissionByOwner({
  id,
  ownerToken,
  input,
}: {
  id: string;
  ownerToken: string;
  input: Omit<ListingSubmissionInput, "ownerToken">;
}) {
  if (!id || !ownerToken) {
    return undefined;
  }

  const updatedFields = {
    kind: input.kind,
    name: input.name,
    type: input.type,
    whatsapp: input.whatsapp,
    whatsapp_normalized: normalizeWhatsapp(input.whatsapp),
    phone: input.phone ?? null,
    description: input.description ?? null,
    address: input.address,
    district: input.district,
    image_name: input.imageName ?? null,
    status: "pending",
  };

  if (supabaseUrl && supabaseServiceRoleKey) {
    const params = new URLSearchParams({
      id: `eq.${id}`,
      owner_token: `eq.${ownerToken}`,
    });

    const response = await fetch(`${supabaseUrl}/rest/v1/listing_submissions?${params.toString()}`, {
      method: "PATCH",
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(updatedFields),
    });

    if (!response.ok) {
      return undefined;
    }

    const rows = (await response.json()) as Record<string, unknown>[];
    return rows[0] ? fromSupabaseRow(rows[0]) : undefined;
  }

  const submissions = await readSubmissions();
  const index = submissions.findIndex((submission) => submission.id === id && submission.ownerToken === ownerToken);

  if (index === -1) {
    return undefined;
  }

  const updated: ListingSubmission = {
    ...submissions[index],
    ...input,
    ownerToken,
    status: "pending",
  };

  submissions[index] = updated;
  await mkdir(path.dirname(submissionsFilePath), { recursive: true });
  await writeFile(submissionsFilePath, JSON.stringify(submissions, null, 2));

  return updated;
}

export async function updateListingSubmissionByWhatsapp({
  id,
  whatsapp,
  input,
}: {
  id: string;
  whatsapp: string;
  input: Omit<ListingSubmissionInput, "ownerToken">;
}) {
  const whatsappNormalized = normalizeWhatsapp(whatsapp);

  if (!id || !whatsappNormalized) {
    return undefined;
  }

  const updatedFields = {
    kind: input.kind,
    name: input.name,
    type: input.type,
    whatsapp: input.whatsapp,
    whatsapp_normalized: normalizeWhatsapp(input.whatsapp),
    phone: input.phone ?? null,
    description: input.description ?? null,
    address: input.address,
    district: input.district,
    image_name: input.imageName ?? null,
    status: "pending",
  };

  if (supabaseUrl && supabaseServiceRoleKey) {
    const params = new URLSearchParams({
      id: `eq.${id}`,
      whatsapp_normalized: `eq.${whatsappNormalized}`,
    });

    const response = await fetch(`${supabaseUrl}/rest/v1/listing_submissions?${params.toString()}`, {
      method: "PATCH",
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(updatedFields),
    });

    if (!response.ok) {
      return undefined;
    }

    const rows = (await response.json()) as Record<string, unknown>[];
    return rows[0] ? fromSupabaseRow(rows[0]) : undefined;
  }

  const submissions = await readSubmissions();
  const index = submissions.findIndex(
    (submission) => submission.id === id && normalizeWhatsapp(submission.whatsapp) === whatsappNormalized
  );

  if (index === -1) {
    return undefined;
  }

  const updated: ListingSubmission = {
    ...submissions[index],
    ...input,
    ownerToken: submissions[index].ownerToken,
    status: "pending",
  };

  submissions[index] = updated;
  await mkdir(path.dirname(submissionsFilePath), { recursive: true });
  await writeFile(submissionsFilePath, JSON.stringify(submissions, null, 2));

  return updated;
}

export async function deleteListingSubmissionByOwner({ id, ownerToken }: { id: string; ownerToken: string }) {
  if (!id || !ownerToken) {
    return false;
  }

  if (supabaseUrl && supabaseServiceRoleKey) {
    const params = new URLSearchParams({
      id: `eq.${id}`,
      owner_token: `eq.${ownerToken}`,
    });

    const response = await fetch(`${supabaseUrl}/rest/v1/listing_submissions?${params.toString()}`, {
      method: "DELETE",
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
      },
    });

    return response.ok;
  }

  const submissions = await readSubmissions();
  const nextSubmissions = submissions.filter(
    (submission) => !(submission.id === id && submission.ownerToken === ownerToken)
  );

  if (nextSubmissions.length === submissions.length) {
    return false;
  }

  await mkdir(path.dirname(submissionsFilePath), { recursive: true });
  await writeFile(submissionsFilePath, JSON.stringify(nextSubmissions, null, 2));

  return true;
}

export async function deleteListingSubmissionByWhatsapp({ id, whatsapp }: { id: string; whatsapp: string }) {
  const whatsappNormalized = normalizeWhatsapp(whatsapp);

  if (!id || !whatsappNormalized) {
    return false;
  }

  if (supabaseUrl && supabaseServiceRoleKey) {
    const params = new URLSearchParams({
      id: `eq.${id}`,
      whatsapp_normalized: `eq.${whatsappNormalized}`,
    });

    const response = await fetch(`${supabaseUrl}/rest/v1/listing_submissions?${params.toString()}`, {
      method: "DELETE",
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
      },
    });

    return response.ok;
  }

  const submissions = await readSubmissions();
  const nextSubmissions = submissions.filter(
    (submission) => !(submission.id === id && normalizeWhatsapp(submission.whatsapp) === whatsappNormalized)
  );

  if (nextSubmissions.length === submissions.length) {
    return false;
  }

  await mkdir(path.dirname(submissionsFilePath), { recursive: true });
  await writeFile(submissionsFilePath, JSON.stringify(nextSubmissions, null, 2));

  return true;
}

export async function getApprovedListingSubmissions({
  kind,
  type,
  district,
}: {
  kind: ListingSubmissionKind;
  type: string;
  district?: string;
}) {
  if (supabaseUrl && supabaseServiceRoleKey) {
    const params = new URLSearchParams({
      select: "*",
      status: "eq.approved",
      kind: `eq.${kind}`,
      type: `eq.${type}`,
      order: "created_at.desc",
    });

    if (district) {
      params.set("district", `eq.${district}`);
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/listing_submissions?${params.toString()}`, {
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const rows = (await response.json()) as Record<string, unknown>[];
    return rows.map(fromSupabaseRow);
  }

  const submissions = await readSubmissions();

  return submissions.filter(
    (submission) =>
      submission.status === "approved" &&
      submission.kind === kind &&
      submission.type === type &&
      (!district || submission.district === district)
  );
}

export async function getApprovedListingSubmissionDistrictCounts({
  kind,
  type,
}: {
  kind: ListingSubmissionKind;
  type: string;
}) {
  const counts: Record<string, number> = {};

  if (supabaseUrl && supabaseServiceRoleKey) {
    const params = new URLSearchParams({
      select: "district",
      status: "eq.approved",
      kind: `eq.${kind}`,
      type: `eq.${type}`,
    });

    const response = await fetch(`${supabaseUrl}/rest/v1/listing_submissions?${params.toString()}`, {
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return counts;
    }

    const rows = (await response.json()) as { district?: string }[];

    for (const row of rows) {
      if (row.district) {
        counts[row.district] = (counts[row.district] ?? 0) + 1;
      }
    }

    return counts;
  }

  const submissions = await readSubmissions();

  for (const submission of submissions) {
    if (submission.status === "approved" && submission.kind === kind && submission.type === type) {
      counts[submission.district] = (counts[submission.district] ?? 0) + 1;
    }
  }

  return counts;
}

export async function getApprovedListingSubmissionBySlug({
  kind,
  type,
  slug,
}: {
  kind: ListingSubmissionKind;
  type: string;
  slug: string;
}) {
  const submissions = await getApprovedListingSubmissions({ kind, type });

  return submissions.find((submission) => {
    const submissionSlug = submission.name
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return submissionSlug === slug;
  });
}

export async function getApprovedListingSubmissionsByDistrict(district: string) {
  if (supabaseUrl && supabaseServiceRoleKey) {
    const params = new URLSearchParams({
      select: "*",
      status: "eq.approved",
      district: `eq.${district}`,
      order: "created_at.desc",
    });

    const response = await fetch(`${supabaseUrl}/rest/v1/listing_submissions?${params.toString()}`, {
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const rows = (await response.json()) as Record<string, unknown>[];
    return rows.map(fromSupabaseRow);
  }

  const submissions = await readSubmissions();

  return submissions.filter((submission) => submission.status === "approved" && submission.district === district);
}
