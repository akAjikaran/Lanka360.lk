"use client";

import { FormEvent, ReactNode, useState } from "react";
import {
  AlertTriangle,
  Bold,
  ChevronDown,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  LocateFixed,
  Store,
  Underline,
  X,
} from "lucide-react";
import { sidebarGroups, type DirectorySection } from "@/lib/directoryData";
import { sriLankanDistricts } from "@/lib/locationData";

type ListingKind = "store" | "service" | "growth" | "business";

const sectionByKind: Record<Exclude<ListingKind, "business">, DirectorySection> = {
  store: "stores",
  service: "services",
  growth: "growth",
};

function getTypeOptions(kind: ListingKind) {
  const groups =
    kind === "business" ? sidebarGroups : sidebarGroups.filter((group) => group.section === sectionByKind[kind]);

  return groups.flatMap((group) => group.items.map((item) => item[0]));
}

function getKindForType(type: string): ListingKind {
  const group = sidebarGroups.find((entry) => entry.items.some((item) => item[0] === type));

  if (group?.section === "stores") {
    return "store";
  }

  if (group?.section === "services") {
    return "service";
  }

  if (group?.section === "growth") {
    return "growth";
  }

  return "business";
}

export function ListingModalButton({
  kind = "business",
  defaultType = "Cafe",
  className,
  children,
}: {
  kind?: ListingKind;
  defaultType?: string;
  className: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [sameAsWhatsapp, setSameAsWhatsapp] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const noun = kind === "service" ? "Service" : kind === "store" ? "Store" : "Business";
  const lowerNoun = noun.toLowerCase();
  const typeOptions = getTypeOptions(kind);
  const selectedType = typeOptions.includes(defaultType) ? defaultType : typeOptions[0];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const selectedFormType = String(formData.get("type") ?? "").trim();
    const whatsapp = String(formData.get("whatsapp") ?? "").trim();
    const phone = sameAsWhatsapp ? whatsapp : String(formData.get("phone") ?? "").trim();
    const image = formData.get("image");
    const imageName = image instanceof File && image.size > 0 ? image.name : "";
    const resolvedKind = kind === "business" ? getKindForType(selectedFormType) : kind;

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kind: resolvedKind,
          name: formData.get("name"),
          type: selectedFormType,
          whatsapp,
          phone,
          description: formData.get("description"),
          address: formData.get("address"),
          district: formData.get("district"),
          imageName,
        }),
      });

      const responseText = await response.text();
      const result = responseText ? (JSON.parse(responseText) as { error?: string }) : {};

      if (!response.ok) {
        throw new Error(result.error ?? "Could not submit listing.");
      }

      form.reset();
      setSameAsWhatsapp(false);
      setSubmitState("success");
      setMessage("We received your request. We will review it and make it visible after approval.");
    } catch (error) {
      setSubmitState("error");
      setMessage(error instanceof Error ? error.message : "Could not submit listing.");
    }
  };

  const openModal = () => {
    setSubmitState("idle");
    setMessage("");
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSubmitState("idle");
    setMessage("");
  };

  return (
    <>
      <button type="button" className={className} onClick={openModal}>
        {children}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[100] bg-stone-950/60 p-0 backdrop-blur-sm sm:p-4" role="dialog" aria-modal="true">
          <div className="flex min-h-full items-start justify-center sm:items-center">
            <form
              onSubmit={handleSubmit}
              className="min-h-screen w-full overflow-hidden bg-white shadow-2xl sm:min-h-0 sm:max-h-[92vh] sm:max-w-5xl sm:rounded-lg"
            >
              <div className="flex items-center justify-between bg-brand px-4 py-4 text-stone-950 sm:px-7">
                <h2 className="flex items-center gap-3 text-xl font-black tracking-tight sm:text-3xl">
                  <Store size={28} />
                  List Your {noun} on Lanka360
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="grid size-10 place-items-center rounded-lg bg-white/40 text-stone-950 transition hover:bg-white/70"
                  aria-label="Close listing form"
                >
                  <X size={28} />
                </button>
              </div>

              <div className="max-h-[calc(100vh-168px)] overflow-y-auto px-4 py-6 sm:max-h-[calc(92vh-168px)] sm:px-7 sm:py-8">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label={`${noun} Name *`}>
                    <input name="name" className="form-input" required />
                  </Field>

                  <Field label={`${noun} Type`}>
                    <div className="relative">
                      <select name="type" className="form-input appearance-none pr-10" defaultValue={selectedType}>
                        {typeOptions.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-500" size={22} />
                    </div>
                  </Field>

                  <Field label="WhatsApp Number *">
                    <input name="whatsapp" className="form-input" required placeholder="e.g. +94 77 123 4567 or 0771234567" />
                  </Field>

                  <Field label="Phone Number (Optional)">
                    <input
                      name="phone"
                      className="form-input"
                      disabled={sameAsWhatsapp}
                      placeholder="e.g. 021 222 0000 or +94 21 222 0000"
                    />
                    <label className="mt-3 flex items-center gap-3 text-sm font-semibold text-stone-600">
                      <input
                        type="checkbox"
                        checked={sameAsWhatsapp}
                        onChange={(event) => setSameAsWhatsapp(event.target.checked)}
                        className="size-5 accent-brand"
                      />
                      Same as WhatsApp
                    </label>
                  </Field>
                </div>

                <Field label="Description" className="mt-6">
                  <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
                    <div className="flex flex-wrap border-b border-stone-200">
                      {[Bold, Italic, Underline, List, ListOrdered, LinkIcon].map((Icon, index) => (
                        <button
                          key={index}
                          type="button"
                          className="grid size-12 place-items-center border-r border-stone-200 text-stone-700 transition hover:bg-brand/10"
                        >
                          <Icon size={22} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      name="description"
                      className="min-h-52 w-full resize-y p-4 text-base outline-none placeholder:text-stone-400"
                      placeholder={`Tell customers about your ${lowerNoun}, products, pricing, timings, and service area.`}
                    />
                    <div className="border-t border-stone-200 px-3 py-1 text-sm font-medium text-stone-400">P</div>
                  </div>
                </Field>

                <div className="mt-6 grid gap-5 md:grid-cols-[1fr_260px]">
                  <Field label="Address *">
                    <input name="address" className="form-input" required placeholder={`Enter your ${lowerNoun} address`} />
                  </Field>

                  <Field label="District *">
                    <div className="relative">
                      <select name="district" className="form-input appearance-none pr-10" defaultValue="Jaffna">
                        {sriLankanDistricts.map((district) => (
                          <option key={district}>{district}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-500" size={22} />
                    </div>
                  </Field>
                </div>

                <div className="my-5 text-center text-sm font800 text-stone-500">- or -</div>

                <button
                  type="button"
                  className="mx-auto flex w-full max-w-xs items-center justify-center gap-2 rounded-lg bg-stone-950 px-5 py-3 text-base font-black text-brand shadow-sm sm:text-lg"
                >
                  <LocateFixed size={20} />
                  Detect My Location
                </button>

                <Field label="Upload Image" className="mt-7">
                  <input
                    name="image"
                    type="file"
                    accept="image/*"
                    className="block w-full rounded-lg border border-stone-200 text-sm text-stone-600 file:mr-4 file:border-0 file:bg-stone-100 file:px-5 file:py-4 file:font800 file:text-stone-700"
                  />
                </Field>

                <div className="mt-4 flex gap-3 rounded-lg border border-brand/40 bg-brand/10 px-4 py-3 text-sm leading-6 text-brand-dark">
                  <AlertTriangle className="mt-0.5 shrink-0" size={20} />
                  <p>
                    <strong>Do not upload copyright-protected images.</strong> Use only your own original photos or
                    properly licensed images. Copyrighted images will be rejected.
                  </p>
                </div>

                {message ? (
                  <div
                    className={`mt-4 rounded-lg px-4 py-3 text-sm font800 ${
                      submitState === "success"
                        ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    {message}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-stone-200 bg-white px-4 py-4 sm:flex-row sm:justify-end sm:px-7">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg bg-stone-200 px-6 py-3 text-base font-black text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitState === "submitting"}
                  className="rounded-lg bg-emerald-600 px-6 py-3 text-base font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitState === "submitting" ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Field({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-black uppercase tracking-[0.14em] text-stone-500">{label}</span>
      {children}
    </label>
  );
}
