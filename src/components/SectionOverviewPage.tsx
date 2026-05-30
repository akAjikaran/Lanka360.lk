import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, MapPin, Star, Store, Wrench } from "lucide-react";
import { ExploreSidebar } from "@/components/ExploreSidebar";
import {
  buildListings,
  getDirectoryItemsBySection,
  type DirectorySection,
} from "@/lib/directoryData";
import { allSriLankaLocation, defaultLocation } from "@/lib/locationData";

const sectionMeta: Record<
  Extract<DirectorySection, "stores" | "services">,
  {
    label: string;
    title: string;
    description: string;
    icon: typeof Store;
  }
> = {
  stores: {
    label: "Sri Lankan Business",
    title: "Explore Sri Lankan Business",
    description: "Browse Sri Lankan shops, cafes, restaurants, groceries, medical stores, hardware, and more by area.",
    icon: Store,
  },
  services: {
    label: "Sri Lankan Services",
    title: "Explore Sri Lankan Services",
    description: "Find trusted home repair, beauty, vehicle care, IT support, education, and healthcare services near you.",
    icon: Wrench,
  },
};

export function SectionOverviewPage({
  section,
  location = defaultLocation,
}: {
  section: Extract<DirectorySection, "stores" | "services">;
  location?: string;
}) {
  const meta = sectionMeta[section];
  const Icon = meta.icon;
  const items = getDirectoryItemsBySection(section);
  const listings = items.flatMap((item) =>
    buildListings(item)
      .slice(0, 2)
      .map((listing) => ({
        ...listing,
        categoryLabel: item.label,
        categorySlug: item.slug,
        categoryImage: item.image,
      }))
  );
  const total = items.reduce((sum, item) => sum + item.total, 0);
  const openNow = items.reduce((sum, item) => sum + item.openNow, 0);
  const selectedDistrict = location === allSriLankaLocation ? undefined : location;
  const withLocation = (href: string) =>
    selectedDistrict ? `${href}?location=${encodeURIComponent(selectedDistrict)}` : href;
  const localizeText = (value: string) => (selectedDistrict ? value.replaceAll("Jaffna", selectedDistrict) : value);

  return (
    <div className="min-h-screen">
      <section className="mx-auto grid max-w-[1680px] gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[300px_1fr] lg:px-8 lg:py-6">
        <ExploreSidebar activeSection={section} />

        <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
          <nav className="mb-5 flex items-center gap-2 rounded-lg bg-brand/10 px-3 py-3 text-sm font800 text-stone-500">
            <Link href="/" className="text-brand-dark">
              Home
            </Link>
            <ChevronRight size={15} />
            <span className="text-stone-950">{meta.label}</span>
          </nav>

          <div className="grid gap-4 xl:grid-cols-[1fr_340px] xl:items-start">
            <div>
              <h1 className="flex min-w-0 items-center gap-3 text-2xl font-black tracking-tight text-stone-950 sm:text-4xl">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand/15 text-brand-dark sm:size-11">
                  <Icon size={24} />
                </span>
                <span className="min-w-0">{meta.title}</span>
              </h1>
              <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-stone-500 sm:text-base">
                {meta.description} {selectedDistrict ? `Showing results around ${selectedDistrict} District.` : "Showing results across Sri Lanka."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-lg border border-stone-200 bg-stone-50 p-3">
              <div className="rounded-lg bg-white p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-stone-400">Listings</p>
                <p className="mt-1 text-2xl font-black text-stone-950">{total}</p>
              </div>
              <div className="rounded-lg bg-white p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-stone-400">Open Now</p>
                <p className="mt-1 text-2xl font-black text-brand-dark">{openNow}</p>
              </div>
            </div>
          </div>

          <section className="mt-6">
            <h2 className="text-lg font-black text-stone-950">Choose a category</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <Link
                  key={item.slug}
                  href={withLocation(`/${item.section}/${item.slug}`)}
                  className="group overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:border-brand hover:shadow-md"
                >
                  <div className="relative h-28">
                    <Image src={item.image} alt="" fill sizes="320px" className="object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-black text-stone-950">{item.label}</h3>
                        <p className="mt-1 text-xs font-semibold text-stone-500">
                          {item.total} listings, {item.openNow} open now
                        </p>
                      </div>
                      <ArrowRight size={18} className="mt-1 shrink-0 text-brand-dark transition group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-7">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-black text-stone-950">Featured listings</h2>
                <p className="mt-1 text-sm font-semibold text-stone-500">A quick sample from every {meta.label.toLowerCase()} category.</p>
              </div>
              <span className="text-sm font-black text-brand-dark">{listings.length} shown</span>
            </div>

            <div className="mt-4 grid gap-4 2xl:grid-cols-2">
              {listings.map((listing) => (
                <Link
                  key={`${listing.categorySlug}-${listing.slug}`}
                  href={withLocation(`/${section}/${listing.categorySlug}/${listing.slug}`)}
                  className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:border-brand hover:shadow-md"
                >
                  <article className="grid grid-cols-[104px_1fr] sm:grid-cols-[180px_1fr]">
                    <div className="relative min-h-36">
                      <Image
                        src={listing.categoryImage}
                        alt=""
                        fill
                        sizes="220px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 p-4">
                      <span className="rounded-full bg-brand/15 px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-brand-dark">
                        {listing.categoryLabel}
                      </span>
                      <h3 className="mt-3 line-clamp-1 text-lg font-black text-stone-950">
                        {localizeText(listing.name)}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="flex items-center gap-1 text-brand">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star key={index} size={13} fill="currentColor" />
                          ))}
                        </span>
                        <span className="text-sm font800 text-stone-700">
                          {listing.rating} ({listing.reviews})
                        </span>
                      </div>
                      <p className="mt-3 flex min-w-0 items-center gap-2 text-sm font-semibold text-stone-600">
                        <MapPin size={16} className="shrink-0 text-stone-400" />
                        <span className="line-clamp-1">{localizeText(listing.address)}</span>
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
