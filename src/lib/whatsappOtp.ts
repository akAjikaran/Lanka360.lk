import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { normalizeWhatsapp } from "@/lib/listingSubmissions";

type OtpRecord = {
  id: string;
  whatsapp: string;
  whatsappNormalized: string;
  code: string;
  verificationToken?: string;
  expiresAt: string;
  verifiedAt?: string;
  createdAt: string;
};

const otpFilePath = path.join(process.cwd(), "data", "whatsapp-otps.json");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const isProduction = process.env.NODE_ENV === "production";

function assertProductionOtpStorageConfigured() {
  if (isProduction && (!supabaseUrl || !supabaseServiceRoleKey)) {
    throw new Error("Supabase OTP storage is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.");
  }
}

function createCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function toSupabaseRow(record: OtpRecord) {
  return {
    id: record.id,
    whatsapp: record.whatsapp,
    whatsapp_normalized: record.whatsappNormalized,
    code: record.code,
    verification_token: record.verificationToken ?? null,
    expires_at: record.expiresAt,
    verified_at: record.verifiedAt ?? null,
    created_at: record.createdAt,
  };
}

function fromSupabaseRow(row: Record<string, unknown>): OtpRecord {
  return {
    id: String(row.id),
    whatsapp: String(row.whatsapp),
    whatsappNormalized: String(row.whatsapp_normalized),
    code: String(row.code),
    verificationToken: typeof row.verification_token === "string" ? row.verification_token : undefined,
    expiresAt: String(row.expires_at),
    verifiedAt: typeof row.verified_at === "string" ? row.verified_at : undefined,
    createdAt: String(row.created_at),
  };
}

async function readOtpRecords() {
  if (isProduction && (!supabaseUrl || !supabaseServiceRoleKey)) {
    return [];
  }

  try {
    const file = await readFile(otpFilePath, "utf8");
    return JSON.parse(file) as OtpRecord[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function writeOtpRecords(records: OtpRecord[]) {
  await mkdir(path.dirname(otpFilePath), { recursive: true });
  await writeFile(otpFilePath, JSON.stringify(records, null, 2));
}

export async function sendWhatsappOtp(whatsapp: string) {
  const whatsappNormalized = normalizeWhatsapp(whatsapp);

  if (!whatsappNormalized) {
    throw new Error("Enter a valid WhatsApp number.");
  }

  const record: OtpRecord = {
    id: crypto.randomUUID(),
    whatsapp,
    whatsappNormalized,
    code: createCode(),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  };

  if (supabaseUrl && supabaseServiceRoleKey) {
    const response = await fetch(`${supabaseUrl}/rest/v1/whatsapp_otp_requests`, {
      method: "POST",
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(toSupabaseRow(record)),
    });

    if (!response.ok) {
      throw new Error((await response.text()) || "Could not create OTP.");
    }
  } else {
    assertProductionOtpStorageConfigured();
    const records = await readOtpRecords();
    await writeOtpRecords([record, ...records].slice(0, 100));
  }

  return {
    expiresAt: record.expiresAt,
    // Development fallback until a real WhatsApp provider is connected.
    devCode: process.env.NODE_ENV !== "production" ? record.code : undefined,
  };
}

export async function verifyWhatsappOtp({ whatsapp, code }: { whatsapp: string; code: string }) {
  const whatsappNormalized = normalizeWhatsapp(whatsapp);
  const now = new Date();

  if (!whatsappNormalized || !code.trim()) {
    return undefined;
  }

  if (supabaseUrl && supabaseServiceRoleKey) {
    const params = new URLSearchParams({
      select: "*",
      whatsapp_normalized: `eq.${whatsappNormalized}`,
      code: `eq.${code.trim()}`,
      order: "created_at.desc",
      limit: "1",
    });

    const response = await fetch(`${supabaseUrl}/rest/v1/whatsapp_otp_requests?${params.toString()}`, {
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return undefined;
    }

    const rows = (await response.json()) as Record<string, unknown>[];
    const record = rows[0] ? fromSupabaseRow(rows[0]) : undefined;

    if (!record || new Date(record.expiresAt) < now) {
      return undefined;
    }

    const verificationToken = crypto.randomUUID();
    const updateParams = new URLSearchParams({ id: `eq.${record.id}` });

    await fetch(`${supabaseUrl}/rest/v1/whatsapp_otp_requests?${updateParams.toString()}`, {
      method: "PATCH",
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        verification_token: verificationToken,
        verified_at: new Date().toISOString(),
      }),
    });

    return verificationToken;
  }

  assertProductionOtpStorageConfigured();

  const records = await readOtpRecords();
  const record = records.find(
    (entry) => entry.whatsappNormalized === whatsappNormalized && entry.code === code.trim() && new Date(entry.expiresAt) >= now
  );

  if (!record) {
    return undefined;
  }

  record.verificationToken = crypto.randomUUID();
  record.verifiedAt = new Date().toISOString();
  await writeOtpRecords(records);

  return record.verificationToken;
}

export async function isWhatsappVerificationValid({
  whatsapp,
  verificationToken,
}: {
  whatsapp: string;
  verificationToken: string;
}) {
  const whatsappNormalized = normalizeWhatsapp(whatsapp);

  if (!whatsappNormalized || !verificationToken) {
    return false;
  }

  if (supabaseUrl && supabaseServiceRoleKey) {
    const params = new URLSearchParams({
      select: "id",
      whatsapp_normalized: `eq.${whatsappNormalized}`,
      verification_token: `eq.${verificationToken}`,
      limit: "1",
    });

    const response = await fetch(`${supabaseUrl}/rest/v1/whatsapp_otp_requests?${params.toString()}`, {
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return false;
    }

    const rows = (await response.json()) as Record<string, unknown>[];
    return rows.length > 0;
  }

  assertProductionOtpStorageConfigured();

  const records = await readOtpRecords();
  return records.some(
    (record) => record.whatsappNormalized === whatsappNormalized && record.verificationToken === verificationToken
  );
}
