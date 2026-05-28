"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { allSriLankaLocation, defaultLocation, sriLankanLocationOptions } from "@/lib/locationData";

export function LocationFilter({
  location,
  basePath,
}: {
  location: string;
  basePath: string;
}) {
  const [selectedLocation, setSelectedLocation] = useState(location);
  const router = useRouter();

  const applyLocation = () => {
    router.push(
      selectedLocation === allSriLankaLocation ? basePath : `${basePath}?location=${encodeURIComponent(selectedLocation)}`
    );
  };

  const clearLocation = () => {
    setSelectedLocation(defaultLocation);
    router.push(basePath);
  };

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-brand-dark">
        <MapPin size={15} />
        Showing results near
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <label className="mb-2 block text-sm font800 text-stone-500">Select district</label>
          <select
            value={selectedLocation}
            onChange={(event) => setSelectedLocation(event.target.value)}
            className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-3 text-base font-black text-stone-950 outline-none focus:border-brand focus:ring-4 focus:ring-brand/20"
          >
            {sriLankanLocationOptions.map((district) => (
              <option key={district}>{district}</option>
            ))}
          </select>
          <p className="mt-2 text-sm font-medium text-stone-500">
            {selectedLocation === allSriLankaLocation
              ? "Results will show all Sri Lanka."
              : `Results will update for ${selectedLocation} District, Sri Lanka.`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={applyLocation}
            className="rounded-lg bg-brand px-4 py-3 text-sm font-black text-stone-950"
          >
            Change
          </button>
          <button
            type="button"
            onClick={clearLocation}
            className="rounded-lg bg-stone-200 px-4 py-3 text-sm font-black text-stone-700"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
