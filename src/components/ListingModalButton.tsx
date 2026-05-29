"use client";

import { FormEvent, MouseEvent, ReactNode, useState } from "react";
import {
  AlertTriangle,
  Bold,
  ChevronDown,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  LocateFixed,
  MapPin,
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

const defaultMapLocation = { latitude: 7.8731, longitude: 80.7718 };
const mapZoom = 8;
const tileSize = 256;

function projectLocation(latitude: number, longitude: number, zoom: number) {
  const scale = tileSize * 2 ** zoom;
  const sinLatitude = Math.sin((latitude * Math.PI) / 180);

  return {
    x: ((longitude + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI)) * scale,
  };
}

function unprojectLocation(x: number, y: number, zoom: number) {
  const scale = tileSize * 2 ** zoom;
  const longitude = (x / scale) * 360 - 180;
  const latitudeRadians = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / scale)));

  return {
    latitude: (latitudeRadians * 180) / Math.PI,
    longitude,
  };
}

function MapPicker({
  value,
  onChange,
}: {
  value: { latitude: number; longitude: number } | null;
  onChange: (location: { latitude: number; longitude: number }) => void;
}) {
  const center = value ?? defaultMapLocation;
  const centerPixel = projectLocation(center.latitude, center.longitude, mapZoom);
  const centerTileX = Math.floor(centerPixel.x / tileSize);
  const centerTileY = Math.floor(centerPixel.y / tileSize);
  const tileOffsets = [-2, -1, 0, 1, 2];

  const handleMapClick = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = centerPixel.x + event.clientX - (bounds.left + bounds.width / 2);
    const y = centerPixel.y + event.clientY - (bounds.top + bounds.height / 2);

    onChange(unprojectLocation(x, y, mapZoom));
  };

  return (
    <div
      className="relative mt-4 h-72 cursor-crosshair overflow-hidden rounded-lg border border-stone-200 bg-stone-200"
      onClick={handleMapClick}
      role="button"
      tabIndex={0}
      aria-label="Select listing location on map"
    >
      {tileOffsets.flatMap((offsetX) =>
        tileOffsets.map((offsetY) => {
          const tileX = centerTileX + offsetX;
          const tileY = centerTileY + offsetY;

          return (
            <img
              key={`${tileX}-${tileY}`}
              src={`https://tile.openstreetmap.org/${mapZoom}/${tileX}/${tileY}.png`}
              alt=""
              className="absolute size-64 select-none"
              draggable={false}
              style={{
                left: `calc(50% + ${tileX * tileSize - centerPixel.x}px)`,
                top: `calc(50% + ${tileY * tileSize - centerPixel.y}px)`,
              }}
            />
          );
        })
      )}
      {value ? (
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
          <MapPin size={38} className="fill-red-600 text-red-700 drop-shadow-lg" />
        </div>
      ) : null}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-white/90 px-3 py-2 text-xs font-semibold text-stone-600">
        Tap the map to select the store or service location. Map data © OpenStreetMap contributors.
      </div>
    </div>
  );
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
  const [successAlert, setSuccessAlert] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationMessage, setLocationMessage] = useState("");

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
          brandColor: formData.get("brandColor"),
          description: formData.get("description"),
          address: formData.get("address"),
          district: formData.get("district"),
          googleMapsUrl: formData.get("googleMapsUrl"),
          latitude: selectedLocation?.latitude,
          longitude: selectedLocation?.longitude,
        }),
      });

      const responseText = await response.text();
      const result = responseText ? (JSON.parse(responseText) as { error?: string }) : {};

      if (!response.ok) {
        throw new Error(result.error ?? "Could not submit listing.");
      }

      form.reset();
      setSameAsWhatsapp(false);
      setSelectedLocation(null);
      setLocationMessage("");
      setSubmitState("idle");
      setMessage("");
      setOpen(false);
      setSuccessAlert(true);
    } catch (error) {
      setSubmitState("error");
      setMessage(error instanceof Error ? error.message : "Could not submit listing.");
    }
  };

  const openModal = () => {
    setSubmitState("idle");
    setMessage("");
    setLocationMessage("");
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSubmitState("idle");
    setMessage("");
    setLocationMessage("");
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("Location is not supported by this browser.");
      return;
    }

    setLocationMessage("Detecting your current location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSelectedLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationMessage("Location selected from your current position.");
      },
      () => {
        setLocationMessage("Could not detect location. Select it on the map instead.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <>
      <button type="button" className={className} onClick={openModal}>
        {children}
      </button>

      {successAlert ? (
        <div className="fixed inset-x-4 top-24 z-[110] mx-auto max-w-md rounded-lg border border-emerald-200 bg-white p-4 text-sm font800 text-emerald-800 shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-emerald-900">Successfully created</h3>
              <p className="mt-1 text-sm font-semibold text-emerald-800">
                We received your request and will review it before making it visible.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSuccessAlert(false)}
              className="grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-900 transition hover:bg-emerald-100"
              aria-label="Close success message"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-[100] bg-stone-950/60 p-0 backdrop-blur-sm sm:p-4" role="dialog" aria-modal="true">
          <div className="flex min-h-[100dvh] items-start justify-center sm:items-center">
            <form
              onSubmit={handleSubmit}
              className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-[92vh] sm:max-w-5xl sm:rounded-lg"
            >
              <div className="shrink-0 flex items-center justify-between bg-brand px-4 py-4 text-stone-950 sm:px-7">
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

              <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-7 sm:py-8">
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

                  <Field label="Primary Brand Color">
                    <div className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white p-2">
                      <input
                        name="brandColor"
                        type="color"
                        defaultValue="#49A619"
                        className="h-11 w-16 shrink-0 cursor-pointer rounded border border-stone-200 bg-white"
                        aria-label="Primary brand color"
                      />
                      <span className="text-sm font-semibold text-stone-500">Used on your visiting card design.</span>
                    </div>
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

                <Field label="Google Maps Link (Optional)" className="mt-6">
                  <input
                    name="googleMapsUrl"
                    type="url"
                    className="form-input"
                    placeholder="Paste your Google Maps share link"
                  />
                </Field>

                <div className="mt-6 rounded-lg border border-stone-200 bg-stone-50 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-[0.14em] text-stone-500">Map Location</h3>
                      <p className="mt-1 text-sm font-semibold text-stone-600">
                        Use your current location or tap the map to place the pin.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={useCurrentLocation}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-stone-950 px-4 py-3 text-sm font-black text-brand shadow-sm"
                    >
                      <LocateFixed size={18} />
                      Use Current Location
                    </button>
                  </div>
                  <MapPicker value={selectedLocation} onChange={setSelectedLocation} />
                  <input type="hidden" name="latitude" value={selectedLocation?.latitude ?? ""} />
                  <input type="hidden" name="longitude" value={selectedLocation?.longitude ?? ""} />
                  <p className="mt-3 min-h-5 text-sm font800 text-brand-dark">
                    {locationMessage ||
                      (selectedLocation
                        ? `${selectedLocation.latitude.toFixed(6)}, ${selectedLocation.longitude.toFixed(6)}`
                        : "No map location selected yet.")}
                  </p>
                </div>

                <div className="mt-7 flex gap-3 rounded-lg border border-brand/40 bg-brand/10 px-4 py-3 text-sm leading-6 text-brand-dark">
                  <AlertTriangle className="mt-0.5 shrink-0" size={20} />
                  <p>
                    <strong>Listing review:</strong> We will check submitted details before publishing the listing.
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

              <div className="shrink-0 flex flex-col-reverse gap-3 border-t border-stone-200 bg-white px-4 py-4 shadow-[0_-10px_28px_rgba(15,23,42,0.08)] sm:flex-row sm:justify-end sm:px-7 sm:shadow-none">
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
