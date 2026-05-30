"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, Edit3, RefreshCw, Trash2 } from "lucide-react";
import { sidebarGroups } from "@/lib/directoryData";
import { sriLankanDistricts } from "@/lib/locationData";
import type { ListingSubmission, ListingSubmissionKind } from "@/lib/listingSubmissions";
import {
  deleteListingSubmission,
  getOwnerListings,
  sendListingOtp,
  updateListingSubmission,
  verifyListingOtp,
} from "@/services/lanka360Api";

const kindLabels: Record<ListingSubmissionKind, string> = {
  store: "Store",
  service: "Service",
  growth: "Category",
  business: "Business",
};

const statusStyles: Record<ListingSubmission["status"], string> = {
  pending: "bg-amber-50 text-amber-800 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  rejected: "bg-red-50 text-red-700 ring-red-200",
};

function getOwnerToken() {
  const existingToken = localStorage.getItem("lanka360_owner_token");

  if (existingToken) {
    return existingToken;
  }

  const token = crypto.randomUUID();
  localStorage.setItem("lanka360_owner_token", token);
  return token;
}

function getTypeOptions(kind: ListingSubmissionKind) {
  if (kind === "business") {
    return sidebarGroups.flatMap((group) => group.items.map((item) => item[0]));
  }

  const section = kind === "store" ? "stores" : kind === "service" ? "services" : "growth";
  return sidebarGroups
    .filter((group) => group.section === section)
    .flatMap((group) => group.items.map((item) => item[0]));
}

export default function MyListingsPage() {
  const [ownerToken] = useState(() => (typeof window === "undefined" ? "" : getOwnerToken()));
  const [verifiedWhatsapp, setVerifiedWhatsapp] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [devCode, setDevCode] = useState("");
  const [pendingAction, setPendingAction] = useState<{ type: "edit" | "delete"; listing: ListingSubmission } | null>(null);
  const [listings, setListings] = useState<ListingSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const editingListing = useMemo(
    () => listings.find((listing) => listing.id === editingId),
    [editingId, listings]
  );

  const loadListings = useCallback(async (token = ownerToken) => {
    if (!token) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await getOwnerListings(token);
      setListings(result.listings ?? []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load listings.");
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [ownerToken]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadListings(ownerToken);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadListings, ownerToken]);

  const sendOtpForAction = async (type: "edit" | "delete", listing: ListingSubmission) => {
    setPendingAction({ type, listing });
    setOtpCode("");
    setDevCode("");
    setMessage("");

    try {
      const result = await sendListingOtp(listing.whatsapp);
      setDevCode(result.devCode ?? "");
      setMessage("Enter the OTP sent to your WhatsApp number.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not send OTP.");
      return;
    }
  };

  const verifyOtp = async () => {
    if (!pendingAction) {
      return;
    }

    let result: { verificationToken: string };

    try {
      result = await verifyListingOtp({
        whatsapp: pendingAction.listing.whatsapp,
        code: otpCode,
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Invalid OTP.");
      return;
    }

    setVerifiedWhatsapp(pendingAction.listing.whatsapp);
    setVerificationToken(result.verificationToken);
    setMessage("WhatsApp verified.");

    if (pendingAction.type === "edit") {
      setEditingId(pendingAction.listing.id);
    } else {
      await performDelete(pendingAction.listing, result.verificationToken);
    }

    setPendingAction(null);
    setOtpCode("");
    setDevCode("");
  };

  const requestEdit = (listing: ListingSubmission) => {
    if (verifiedWhatsapp === listing.whatsapp && verificationToken) {
      setEditingId(listing.id);
      return;
    }

    void sendOtpForAction("edit", listing);
  };

  const handleDelete = async (listing: ListingSubmission) => {
    if (verifiedWhatsapp === listing.whatsapp && verificationToken) {
      await performDelete(listing);
      return;
    }

    await sendOtpForAction("delete", listing);
  };

  const performDelete = async (listing: ListingSubmission, token = verificationToken) => {
    try {
      await deleteListingSubmission({
        id: listing.id,
        whatsapp: listing.whatsapp,
        verificationToken: token,
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete listing.");
      return;
    }

    setListings((current) => current.filter((item) => item.id !== listing.id));
    setMessage("Listing deleted.");
  };

  const handleEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingListing) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    let result: { listing: ListingSubmission };

    try {
      result = await updateListingSubmission(editingListing.id, {
        ownerToken,
        verificationToken,
        kind: formData.get("kind"),
        name: formData.get("name"),
        type: formData.get("type"),
        whatsapp: formData.get("whatsapp"),
        phone: formData.get("phone"),
        brandColor: formData.get("brandColor"),
        description: formData.get("description"),
        address: formData.get("address"),
        district: formData.get("district"),
        imageName: editingListing.imageName,
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update listing. Verify WhatsApp OTP first.");
      return;
    }

    setListings((current) => current.map((listing) => (listing.id === result.listing?.id ? result.listing : listing)));
    setEditingId(null);
    setMessage("Listing updated. Status changed to pending for review.");
  };

  const editTypeOptions = editingListing ? getTypeOptions(editingListing.kind) : [];

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-dark">Profile</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-950">My Listings</h1>
              <p className="mt-2 text-sm font-semibold leading-6 text-stone-500">
                Listings submitted from this browser are shown here. Pending listings are waiting for approval.
              </p>
            </div>
            <button
              type="button"
              onClick={() => loadListings()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-black text-stone-950"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {message ? (
            <div className="mt-5 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm font800 text-stone-700">
              {message}
            </div>
          ) : null}

          {pendingAction ? (
            <div className="mt-5 rounded-lg border border-brand/30 bg-brand/10 p-4">
              <h2 className="text-lg font-black text-stone-950">Verify WhatsApp to {pendingAction.type}</h2>
              <p className="mt-2 text-sm font-semibold text-stone-600">
                Enter the OTP for {pendingAction.listing.whatsapp}. This protects listings from being changed by someone else.
              </p>
              {devCode ? (
                <p className="mt-3 rounded-lg bg-white px-3 py-2 text-sm font-black text-stone-950">
                  Development OTP: {devCode}
                </p>
              ) : null}
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  value={otpCode}
                  onChange={(event) => setOtpCode(event.target.value)}
                  className="form-input sm:max-w-xs"
                  placeholder="6-digit OTP"
                />
                <button type="button" onClick={verifyOtp} className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-black text-white">
                  Verify
                </button>
                <button
                  type="button"
                  onClick={() => setPendingAction(null)}
                  className="rounded-lg bg-stone-200 px-5 py-3 text-sm font-black text-stone-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}

          <div className="mt-6 grid gap-4">
            {loading ? (
              <p className="rounded-lg border border-stone-200 p-5 text-sm font800 text-stone-500">Loading listings...</p>
            ) : null}

            {!loading && listings.length === 0 ? (
              <div className="rounded-lg border border-stone-200 p-5">
                <p className="font-black text-stone-950">No listings found on this browser.</p>
                <Link href="/" className="mt-3 inline-flex rounded-full bg-stone-950 px-4 py-2 text-sm font-black text-brand">
                  Add a listing
                </Link>
              </div>
            ) : null}

            {listings.map((listing) => (
              <article key={listing.id} className="rounded-[1.25rem] border border-stone-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${statusStyles[listing.status]}`}>
                        {listing.status}
                      </span>
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-black text-stone-700">
                        {kindLabels[listing.kind]} / {listing.type}
                      </span>
                    </div>
                    <h2 className="mt-3 text-xl font-black text-stone-950">{listing.name}</h2>
                    <p className="mt-2 text-sm font-semibold text-stone-500">{listing.address}</p>
                    <p className="mt-1 text-sm font800 text-brand-dark">{listing.district}</p>
                    {listing.status === "pending" ? (
                      <p className="mt-3 rounded-lg bg-brand/10 px-3 py-2 text-sm font800 text-brand-dark">
                        We will approve it soon. Your listing page will become public after approval.
                      </p>
                    ) : null}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => requestEdit(listing)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-sm font-black text-stone-700"
                    >
                      <Edit3 size={15} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(listing)}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-black text-red-700"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {editingListing ? (
          <div className="fixed inset-0 z-[100] overflow-y-auto bg-stone-950/60 p-4 backdrop-blur-sm">
            <form onSubmit={handleEdit} className="mx-auto my-8 max-w-3xl overflow-hidden rounded-lg bg-white shadow-2xl">
              <div className="bg-brand px-5 py-4">
                <h2 className="text-2xl font-black text-stone-950">Edit Listing</h2>
              </div>
              <div className="grid gap-5 p-5 md:grid-cols-2">
                <Field label="Kind">
                  <div className="relative">
                    <select name="kind" className="form-input appearance-none pr-10" defaultValue={editingListing.kind}>
                      {Object.entries(kindLabels).map(([kind, label]) => (
                        <option key={kind} value={kind}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-500" size={22} />
                  </div>
                </Field>
                <Field label="Type">
                  <div className="relative">
                    <select name="type" className="form-input appearance-none pr-10" defaultValue={editingListing.type}>
                      {editTypeOptions.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-500" size={22} />
                  </div>
                </Field>
                <Field label="Name">
                  <input name="name" className="form-input" required defaultValue={editingListing.name} />
                </Field>
                <Field label="WhatsApp">
                  <input name="whatsapp" className="form-input" required defaultValue={editingListing.whatsapp} />
                </Field>
                <Field label="Phone">
                  <input name="phone" className="form-input" defaultValue={editingListing.phone ?? ""} />
                </Field>
                <Field label="Primary Brand Color">
                  <input
                    name="brandColor"
                    type="color"
                    className="h-[58px] w-full cursor-pointer rounded-lg border border-stone-200 bg-white p-2"
                    defaultValue={editingListing.brandColor ?? "#49A619"}
                  />
                </Field>
                <Field label="District">
                  <div className="relative">
                    <select name="district" className="form-input appearance-none pr-10" defaultValue={editingListing.district}>
                      {sriLankanDistricts.map((district) => (
                        <option key={district}>{district}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-500" size={22} />
                  </div>
                </Field>
                <Field label="Address" className="md:col-span-2">
                  <input name="address" className="form-input" required defaultValue={editingListing.address} />
                </Field>
                <Field label="Description" className="md:col-span-2">
                  <textarea name="description" className="min-h-36 w-full rounded-lg border border-stone-200 p-4 outline-none" defaultValue={editingListing.description ?? ""} />
                </Field>
              </div>
              <div className="flex flex-col-reverse gap-3 border-t border-stone-200 px-5 py-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="rounded-lg bg-stone-200 px-5 py-3 text-sm font-black text-stone-700"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-black text-white">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </section>
    </main>
  );
}

function Field({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-black uppercase tracking-[0.14em] text-stone-500">{label}</span>
      {children}
    </label>
  );
}
