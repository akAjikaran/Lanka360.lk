import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DistrictSelector } from "@/components/DistrictSelector";
import { ExploreSidebar } from "@/components/ExploreSidebar";
import { ListingModalButton } from "@/components/ListingModalButton";
import { PrimaryCategoryCards } from "@/components/PrimaryCategoryCards";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CircleDot,
  Info,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  SlidersHorizontal,
  Star,
  Store,
  Wrench,
} from "lucide-react";
import {
  buildListings,
  directoryItems,
  getDirectoryItem,
  toSlug,
  type DirectoryListing,
  type DirectorySection,
} from "@/lib/directoryData";
import {
  getApprovedListingSubmissionDistrictCounts,
  getApprovedListingSubmissions,
  type ListingSubmissionKind,
} from "@/lib/listingSubmissions";
import { allSriLankaLocation, defaultLocation, sriLankanDistricts } from "@/lib/locationData";

const sectionLabel: Record<DirectorySection, string> = {
  stores: "Stores",
  services: "Services",
  growth: "Categories",
};

const sectionIcon = {
  stores: Store,
  services: Wrench,
  growth: BriefcaseBusiness,
};

const districtImages = [
  "https://images.unsplash.com/photo-1581351721010-8cf859cb14a4?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1588598198321-9735fd52455b?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1586612863268-136b8659794c?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500&auto=format&fit=crop",
];

function buildDistricts(counts: Record<string, number>) {
  const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);

  return [
    {
      name: allSriLankaLocation,
      count: totalCount,
      image: "https://images.unsplash.com/photo-1588598198321-9735fd52455b?q=80&w=500&auto=format&fit=crop",
    },
    ...sriLankanDistricts.map((name, index) => ({
      name,
      count: counts[name] ?? 0,
      image: districtImages[index % districtImages.length],
    })),
  ];
}

const listingKindBySection: Record<DirectorySection, ListingSubmissionKind> = {
  stores: "store",
  services: "service",
  growth: "growth",
};

function normalizePhoneForWhatsapp(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("94")) {
    return digits;
  }

  if (digits.startsWith("0")) {
    return `94${digits.slice(1)}`;
  }

  return digits;
}

export async function CategoryDetailPage({
  section,
  slug,
  location = defaultLocation,
}: {
  section: DirectorySection;
  slug: string;
  location?: string;
}) {
  const item = getDirectoryItem(section, slug);

  if (!item) {
    notFound();
  }

  const Icon = sectionIcon[section];
  const selectedDistrict = location === allSriLankaLocation ? undefined : location;
  const approvedSubmissions = await getApprovedListingSubmissions({
    kind: listingKindBySection[section],
    type: item.label,
    district: selectedDistrict,
  });
  const districtCounts = await getApprovedListingSubmissionDistrictCounts({
    kind: listingKindBySection[section],
    type: item.label,
  });
  const districts = buildDistricts(districtCounts);
  const approvedListings: DirectoryListing[] = approvedSubmissions.map((submission, index) => ({
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
  }));
  const listings = [...approvedListings, ...buildListings(item)];
  const related = directoryItems.filter((entry) => entry.section === section && entry.slug !== slug).slice(0, 6);
  const getListingHref = (listingSlug: string) =>
    section === "growth" ? `/${section}/${slug}` : `/${section}/${slug}/${listingSlug}`;
  const withLocation = (href: string) =>
    selectedDistrict ? `${href}?location=${encodeURIComponent(selectedDistrict)}` : href;
  const localizeText = (value: string) => (selectedDistrict ? value.replaceAll("Jaffna", selectedDistrict) : value);

  return (
    <div className="min-h-screen">
      <section className="mx-auto grid max-w-[1680px] gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[300px_1fr] lg:px-8 lg:py-6">
        <ExploreSidebar activeSection={section} activeSlug={slug} />

        <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
          <PrimaryCategoryCards activeSection={section} activeSlug={slug} withLocation={withLocation} />

          <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
            <div>
              <Link
                href="/"
                className="mb-3 inline-flex items-center gap-2 text-sm font-black text-stone-500 transition hover:text-stone-950 sm:hidden"
              >
                <ArrowLeft size={16} />
                Back to explore
              </Link>
              <h1 className="flex min-w-0 items-center gap-3 text-2xl font-black tracking-tight text-stone-950 sm:text-4xl">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand/15 text-brand-dark sm:size-11">
                  <Icon size={24} />
                </span>
                <span className="min-w-0">Explore Local {item.label}</span>
              </h1>
              <p className="mt-2 hidden max-w-3xl text-sm font-semibold leading-6 text-stone-500 sm:block">
                {localizeText(item.description)}{" "}
                {selectedDistrict
                  ? `Showing results around ${selectedDistrict} District within 10 km.`
                  : "Showing results across Sri Lanka."}
              </p>
            </div>

            <div className="flex justify-start sm:justify-end">
              <ListingModalButton
                kind={section === "services" ? "service" : section === "stores" ? "store" : "growth"}
                defaultType={item.label}
                className="inline-flex min-h-12 w-50 h-14 items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-medium text-black transition hover:bg-brand-dark"
              >
                <Plus size={15} />
                List Your {section === "stores" ? "Store" : "Page"}
              </ListingModalButton>
            </div>
          </div>

          <DistrictSelector districts={districts} section={section} slug={slug} location={location} />

          <section className="mt-5 sm:mt-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font800 text-stone-600">
                Showing <span className="text-brand-dark">1-{item.total}</span> of{" "}
                <span className="text-brand-dark">{item.total}</span> {item.singular}s
                <span className="ml-2 text-emerald-700">{item.openNow} open now</span>
              </p>
              <button className="inline-flex size-11 items-center justify-center rounded-full bg-brand text-sm font-black text-stone-950 sm:size-auto sm:gap-2 sm:px-4 sm:py-2.5">
                <SlidersHorizontal size={16} />
                <span className="hidden sm:inline">Apply Filters</span>
              </button>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-lg border border-stone-200 bg-stone-50 p-3 text-xs leading-5 text-stone-500">
              <Info size={16} className="mt-0.5 shrink-0" />
              Sorted by <strong className="text-stone-700">distance from your location</strong>, then by verified listings,
              ratings, and reviews.
            </div>

            <div className="mt-4 grid gap-4 2xl:grid-cols-2">
              {listings.map((listing) => (
                <article
                  key={listing.name}
                  className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm transition hover:border-brand hover:shadow-md"
                >
                  <div className="grid grid-cols-[96px_1fr] sm:grid-cols-[minmax(190px,36%)_1fr]">
                    <Link href={withLocation(getListingHref(listing.slug))} className="block">
                      <div className="relative h-full min-h-40 overflow-hidden rounded-l-[1.75rem] sm:min-h-48 sm:rounded-none">
                        <Image
                          src={listing.image}
                          alt={listing.name}
                          fill
                          sizes="(min-width: 1024px) 380px, 100vw"
                          className="object-cover"
                        />
                        <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-0.5 text-[9px] font-black text-stone-950 shadow-sm sm:left-5 sm:top-5 sm:px-3 sm:py-1 sm:text-[10px]">
                          LK
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
                    </Link>

                    <div className="flex min-w-0 flex-col p-4 sm:p-6">
                      <Link href={withLocation(getListingHref(listing.slug))} className="block min-w-0">
                        <h3 className="line-clamp-2 text-base font-black text-stone-950 sm:line-clamp-1 sm:text-2xl">
                          {localizeText(listing.name)}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 sm:mt-3">
                          <span className="flex items-center gap-1 text-brand">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star key={index} size={14} fill="currentColor" />
                            ))}
                          </span>
                          <span className="text-sm font800 text-stone-700">
                            {listing.rating} ({listing.reviews})
                          </span>
                          <span className="text-stone-300">•</span>
                          <span className="text-sm font800 text-stone-600">{listing.distance} km away</span>
                        </div>
                        <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold leading-5 text-stone-600 sm:mt-4">
                          <MapPin size={17} className="shrink-0 text-stone-400" />
                          <span className="line-clamp-1">{localizeText(listing.address)}</span>
                        </p>
                      </Link>

                      <div className="mt-4 flex flex-wrap items-center justify-start gap-2 sm:mt-auto sm:justify-end sm:gap-3">
                        <a
                          href={`tel:${listing.phone}`}
                          className="inline-flex size-10 items-center justify-center rounded-full border border-stone-200 text-emerald-700 transition hover:border-emerald-600 sm:size-12"
                          aria-label="Call"
                        >
                          <Phone size={18} />
                        </a>
                        <a
                          href={`https://wa.me/${normalizePhoneForWhatsapp(listing.whatsapp ?? listing.phone)}`}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-black text-stone-950 shadow-sm transition hover:bg-brand-dark sm:px-5 sm:py-3"
                        >
                          <MessageCircle size={17} />
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-7 rounded-lg border border-stone-200 bg-brand/10 p-4">
              <h2 className="flex items-center gap-2 text-lg font-black text-stone-950">
                <CircleDot size={18} className="text-brand-dark" />
                More in {sectionLabel[section]}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {related.map((entry) => (
                  <Link
                    key={entry.slug}
                    href={`/${entry.section}/${entry.slug}`}
                    className="rounded-full bg-white px-4 py-2 text-sm font800 text-stone-700 ring-1 ring-stone-200 transition hover:bg-brand hover:text-stone-950"
                  >
                    {entry.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-black text-stone-800"
              >
                Explore more categories
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
