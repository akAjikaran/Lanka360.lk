import Link from "next/link";
import { ExploreSidebar } from "@/components/ExploreSidebar";
import { ListingVisitingCard } from "@/components/ListingVisitingCard";
import { buildListings, directoryItems, findBestSearchMatch, toSlug, type DirectoryListing } from "@/lib/directoryData";
import { getApprovedListingSubmissionsByDistrict, type ListingSubmissionKind } from "@/lib/listingSubmissions";
import { allSriLankaLocation, defaultLocation } from "@/lib/locationData";
import { MapPin, Search } from "lucide-react";

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
        brandColor: submission.brandColor,
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
        <ExploreSidebar
          activeSection={activeSection === "stores" || activeSection === "services" || activeSection === "growth" ? activeSection : undefined}
          activeSlug={activeSlug}
        />

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

          <div className="mt-4 grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
            {results.map(({ item, listing }) => {
              const href =
                item.section === "growth" ? `/${item.section}/${item.slug}` : `/${item.section}/${item.slug}/${listing.slug}`;

              return (
                <ListingVisitingCard
                  key={`${item.slug}-${listing.slug}`}
                  href={withSearchParams(href)}
                  name={localizeText(listing.name)}
                  address={localizeText(listing.address)}
                  phone={listing.phone}
                  whatsapp={listing.whatsapp}
                  district={selectedDistrict ?? allSriLankaLocation}
                  brandColor={listing.brandColor}
                />
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
