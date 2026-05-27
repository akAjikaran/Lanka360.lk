"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ListingModalButton } from "@/components/ListingModalButton";
import { MobileExploreDrawer } from "@/components/MobileExploreDrawer";
import { sriLankanDistricts } from "@/lib/locationData";
import {
  MapPin,
  Menu,
  Search,
  Sparkles,
  X,
} from "lucide-react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [district, setDistrict] = useState("Jaffna");
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const location = params.get("location");

    if (location && sriLankanDistricts.includes(location)) {
      setDistrict(location);
    }
  }, [pathname]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuery = query.trim();
    const params = new URLSearchParams();
    params.set("location", district);

    if (trimmedQuery) {
      params.set("q", trimmedQuery);
    }

    setOpen(false);
    router.push(`/search?${params.toString()}`);
  };

  const handleDistrictChange = (value: string) => {
    setDistrict(value);

    const params = new URLSearchParams(window.location.search);
    params.set("location", value);
    router.push(`${pathname}?${params.toString()}`);
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
            {sriLankanDistricts.map((item) => (
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

        <ListingModalButton
          kind="business"
          defaultType="Cafe"
          className="ml-auto hidden rounded-full bg-stone-950 px-5 py-2.5 text-sm font800 text-brand transition hover:bg-stone-800 sm:inline-flex"
        >
          List Business
        </ListingModalButton>

        <button
          type="button"
          className="ml-auto grid size-10 place-items-center rounded-lg border border-stone-200 bg-white text-stone-950 xl:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
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
              {sriLankanDistricts.map((item) => (
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

      {open ? (
        <div className="border-t border-stone-100 bg-white px-4 pb-4 xl:hidden">
          <nav className="mx-auto grid max-w-[1680px] gap-2 pt-3">
            <ListingModalButton
              kind="business"
              defaultType="Cafe"
              className="rounded-lg bg-stone-950 px-4 py-3 text-center text-sm font-bold text-brand"
            >
              List Your Business
            </ListingModalButton>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
