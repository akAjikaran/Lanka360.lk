import Image from "next/image";
import Link from "next/link";
import { ExploreSidebar } from "@/components/ExploreSidebar";
import { buildListings, directoryItems, findBestSearchMatch, toSlug, type DirectoryListing } from "@/lib/directoryData";
import { getApprovedListingSubmissionsByDistrict, type ListingSubmissionKind } from "@/lib/listingSubmissions";
import { allSriLankaLocation, defaultLocation } from "@/lib/locationData";
import { MapPin, Search, Star } from "lucide-react";

export const dynamic = "force-dynamic";

const sectionByKind: Record<ListingSubmissionKind, "stores" | "services" | "growth" | undefined> = {
  store: "stores",
  service: "services",
  growth: "growth",
  business: undefined,
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; location?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const location = params.location?.trim() || defaultLocation;
  const selectedDistrict = location === allSriLankaLocation ? undefined : location;
  const normalizedQuery = query.toLowerCase();
  const activeMatch = findBestSearchMatch(query);
  const [, activeSection, activeSlug] = activeMatch?.href.split("/") ?? [];
  const approvedSubmissions = await getApprovedListingSubmissionsByDistrict(selectedDistrict);
  const localizeText = (value: string) => (selectedDistrict ? value.replaceAll("Jaffna", selectedDistrict) : value);
  const withSearchParams = (href: string) => {
    const queryParams = new URLSearchParams();

    if (selectedDistrict) {
      queryParams.set("location", selectedDistrict);
    }

    if (query) {
      queryParams.set("q", query);
    }

    const queryString = queryParams.toString();
    return queryString ? `${href}?${queryString}` : href;
  };

  const staticResults = directoryItems
    .flatMap((item) =>
      buildListings(item).map((listing) => ({
        item,
        listing,
      }))
    )
    .filter(({ item, listing }) => {
      if (!normalizedQuery) {
        return true;
      }

      const localizedName = localizeText(listing.name).toLowerCase();
      const localizedAddress = localizeText(listing.address).toLowerCase();

      return (
        item.label.toLowerCase().includes(normalizedQuery) ||
        item.singular.toLowerCase().includes(normalizedQuery) ||
        localizedName.includes(normalizedQuery) ||
        localizedAddress.includes(normalizedQuery)
      );
    })
    .slice(0, 24);

  const approvedResults = approvedSubmissions
    .flatMap((submission, index) => {
      const section = sectionByKind[submission.kind];
      const item = directoryItems.find((entry) => entry.section === section && entry.label === submission.type);

      if (!item) {
        return [];
      }

      const listing: DirectoryListing = {
        name: submission.name,
        slug: toSlug(submission.name),
        address: submission.address,
        distance: (0.1 + index * 0.1).toFixed(1),
        rating: "5.0",
        reviews: 0,
        open: true,
        image: item.image,
        phone: submission.phone || submission.whatsapp,
        whatsapp: submission.whatsapp,
        website: "#",
      };

      return [{ item, listing }];
    })
    .filter(({ item, listing }) => {
      if (!normalizedQuery) {
        return true;
      }

      return (
        item.label.toLowerCase().includes(normalizedQuery) ||
        item.singular.toLowerCase().includes(normalizedQuery) ||
        listing.name.toLowerCase().includes(normalizedQuery) ||
        listing.address.toLowerCase().includes(normalizedQuery)
      );
    });

  const results = [...approvedResults, ...staticResults].slice(0, 24);

  return (
    <div className="min-h-screen">
      <section className="mx-auto grid max-w-[1680px] gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[300px_1fr] lg:px-8 lg:py-6">
        <ExploreSidebar activeSection={activeSection === "stores" || activeSection === "services" || activeSection === "growth" ? activeSection : undefined} activeSlug={activeSlug} />

        <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="rounded-lg bg-brand/10 p-4">
            <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-brand-dark">
              <Search size={17} />
              Search Results
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-stone-950 sm:text-4xl">
              {query ? `Results for "${query}"` : "Browse all Lanka360 listings"}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-sm font800 text-stone-600">
              <MapPin size={16} className="text-brand-dark" />
              {selectedDistrict ? `Showing near ${selectedDistrict}, Sri Lanka` : "Showing across Sri Lanka"}
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="text-sm font800 text-stone-600">
              Found <span className="text-brand-dark">{results.length}</span> matching listings
            </p>
            <Link href="/" className="rounded-full border border-stone-200 px-4 py-2 text-sm font-black text-stone-700">
              Back Home
            </Link>
          </div>

          <div className="mt-4 grid gap-4 2xl:grid-cols-2">
            {results.map(({ item, listing }) => {
              const href =
                item.section === "growth" ? `/${item.section}/${item.slug}` : `/${item.section}/${item.slug}/${listing.slug}`;

              return (
                <article
                  key={`${item.slug}-${listing.slug}`}
                  className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm transition hover:border-brand hover:shadow-md"
                >
                  <Link
                    href={withSearchParams(href)}
                    className="grid grid-cols-[96px_1fr] sm:grid-cols-[minmax(190px,36%)_1fr]"
                  >
                    <div className="relative h-full min-h-40 overflow-hidden rounded-l-[1.75rem] sm:min-h-48 sm:rounded-none">
                      <Image
                        src={listing.image}
                        alt={listing.name}
                        fill
                        sizes="(min-width: 1024px) 380px, 100vw"
                        className="object-cover"
                      />
                      <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-0.5 text-[9px] font-black text-stone-950 shadow-sm sm:left-5 sm:top-5 sm:px-3 sm:py-1 sm:text-xs">
                        {item.label}
                      </span>
                      <span
                        className={`absolute right-2 top-2 size-3 rounded-full ring-2 ring-white sm:right-5 sm:top-5 ${
                          listing.open ? "bg-emerald-500" : "bg-stone-400"
                        }`}
                      />
                      <span className="hidden absolute bottom-5 left-5 rounded-full bg-brand px-4 py-1.5 text-xs font-black text-stone-950 shadow-sm sm:block">
                        {selectedDistrict ?? allSriLankaLocation}
                      </span>
                    </div>

                    <div className="flex min-w-0 flex-col p-4 sm:p-6">
                      <h2 className="line-clamp-2 text-base font-black text-stone-950 sm:line-clamp-1 sm:text-2xl">
                        {localizeText(listing.name)}
                      </h2>
                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 sm:mt-3">
                        <span className="flex items-center gap-1 text-brand">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star key={index} size={14} fill="currentColor" />
                          ))}
                        </span>
                        <span className="text-sm font800 text-stone-700">{listing.rating}</span>
                        <span className="text-stone-300">•</span>
                        <span className="text-sm font800 text-stone-600">{listing.distance} km away</span>
                      </div>
                      <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold leading-5 text-stone-600 sm:mt-4">
                        <MapPin size={17} className="shrink-0 text-stone-400" />
                        <span className="line-clamp-1">{localizeText(listing.address)}</span>
                      </p>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
