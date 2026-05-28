"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MobileExploreDrawer } from "@/components/MobileExploreDrawer";
import { allSriLankaLocation, defaultLocation, sriLankanLocationOptions } from "@/lib/locationData";
import {
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";

export function SiteHeader() {
  const [district, setDistrict] = useState(defaultLocation);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const location = params.get("location");

    setDistrict(location && sriLankanLocationOptions.includes(location) ? location : defaultLocation);
  }, [pathname]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuery = query.trim();
    const params = new URLSearchParams();
    if (district !== allSriLankaLocation) {
      params.set("location", district);
    }

    if (trimmedQuery) {
      params.set("q", trimmedQuery);
    }

    router.push(`/search?${params.toString()}`);
  };

  const handleDistrictChange = (value: string) => {
    setDistrict(value);

    const params = new URLSearchParams(window.location.search);
    if (value === allSriLankaLocation) {
      params.delete("location");
    } else {
      params.set("location", value);
    }
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
    window.dispatchEvent(new CustomEvent("lanka360:location-change", { detail: { location: value } }));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1680px] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <MobileExploreDrawer />

        <Link href="/" className="flex min-w-max items-center gap-2" aria-label="Lanka360 home">
          <span className="grid size-10 place-items-center rounded-lg bg-brand text-stone-950 shadow-[0_8px_20px_rgba(29,203,121,0.35)]">
            <Sparkles size={22} strokeWidth={2.4} />
          </span>
          <span className="leading-none">
            <span className="block text-xl font-black tracking-tight text-stone-950">Lanka360.lk</span>
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.22em] text-stone-500 sm:block">
              Local. Trusted. Nearby.
            </span>
          </span>
        </Link>

        <form
          onSubmit={handleSearch}
          className="hidden w-full max-w-2xl items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-2 lg:flex"
        >
          <MapPin size={18} className="text-brand-dark" />
          <select
            className="w-48 bg-transparent text-sm font-semibold text-stone-700 outline-none"
            value={district}
            onChange={(event) => handleDistrictChange(event.target.value)}
            aria-label="Select Sri Lankan district"
          >
            {sriLankanLocationOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <span className="h-6 w-px bg-stone-200" />
          <Search size={18} className="text-stone-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400"
            placeholder="Search stores, services, products, jobs..."
          />
          <button
            type="submit"
            className="rounded-full bg-brand px-4 py-1.5 text-sm font-black text-stone-950 transition hover:bg-brand"
          >
            Search
          </button>
        </form>

      </div>

      <div className="border-t border-stone-100 px-4 py-3 lg:hidden">
        <form onSubmit={handleSearch} className="mx-auto grid max-w-[1680px] gap-2">
          <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-2">
            <MapPin size={18} className="text-brand-dark" />
            <select
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-stone-700 outline-none"
              value={district}
              onChange={(event) => handleDistrictChange(event.target.value)}
              aria-label="Select Sri Lankan district"
            >
              {sriLankanLocationOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-2">
            <Search size={18} className="text-stone-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400"
              placeholder="Search near you..."
            />
            <button
              type="submit"
              className="rounded-full bg-brand px-4 py-1.5 text-sm font-black text-stone-950"
            >
              Go
            </button>
          </div>
        </form>
      </div>
    </header>
  );
}
