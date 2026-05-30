import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, ChevronRight, Rocket, Store, Tags, Wrench } from "lucide-react";
import {
  AcademicCapIcon,
  BeakerIcon,
  BoltIcon,
  BriefcaseIcon,
  BuildingStorefrontIcon,
  CakeIcon,
  CalendarDaysIcon,
  CircleStackIcon,
  ComputerDesktopIcon,
  CubeIcon,
  DevicePhoneMobileIcon,
  FireIcon,
  GiftIcon,
  HeartIcon,
  HomeIcon,
  NewspaperIcon,
  RocketLaunchIcon,
  ScissorsIcon,
  ShoppingBagIcon,
  SparklesIcon,
  TagIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";
import { ExploreSidebar } from "@/components/ExploreSidebar";
import { ListingVisitingCard } from "@/components/ListingVisitingCard";
import { buildListings, getDirectoryItem, sidebarGroups } from "@/lib/directoryData";
import { allSriLankaLocation, defaultLocation } from "@/lib/locationData";

export const dynamic = "force-dynamic";

const groupSlugs: Record<string, string> = {
  "Sri Lankan Business": "stores",
  "Sri Lankan Services": "services",
  "Sri Lankan Startups": "startups",
  "Tools and Product Hub": "products",
  "Local Events": "events",
};

const groupCopy: Record<
  string,
  {
    title: string;
    description: string;
    icon: typeof Store;
  }
> = {
  stores: {
    title: "Sri Lankan Business",
    description: "Choose a store category, then browse the first available local listings below.",
    icon: Store,
  },
  services: {
    title: "Sri Lankan Services",
    description: "Pick a service type and start with trusted providers from the first category.",
    icon: Wrench,
  },
  startups: {
    title: "Sri Lankan Startups",
    description: "Explore startup stories, funding support, founder communities, and new business ideas.",
    icon: Rocket,
  },
  products: {
    title: "Tools and Product Hub",
    description: "Browse products, SaaS tools, AI tools, digital products, and local innovations.",
    icon: Tags,
  },
  events: {
    title: "Local Events",
    description: "Find events, workshops, exhibitions, career fairs, and community activities.",
    icon: CalendarDays,
  },
};

type HeroIcon = ComponentType<SVGProps<SVGSVGElement>>;

const categoryIconMap: Record<string, HeroIcon> = {
  "academic-cap": AcademicCapIcon,
  beaker: BeakerIcon,
  bolt: BoltIcon,
  briefcase: BriefcaseIcon,
  "building-storefront": BuildingStorefrontIcon,
  cake: CakeIcon,
  calendar: CalendarDaysIcon,
  computer: ComputerDesktopIcon,
  cube: CubeIcon,
  diamond: SparklesIcon,
  fire: FireIcon,
  gift: GiftIcon,
  heart: HeartIcon,
  home: HomeIcon,
  newspaper: NewspaperIcon,
  phone: DevicePhoneMobileIcon,
  rocket: RocketLaunchIcon,
  scissors: ScissorsIcon,
  "shopping-bag": ShoppingBagIcon,
  sparkles: SparklesIcon,
  tag: TagIcon,
  truck: TruckIcon,
  cup: CircleStackIcon,
  wrench: WrenchScrewdriverIcon,
};

function getGroup(groupSlug: string) {
  return sidebarGroups.find((group) => groupSlugs[group.title] === groupSlug);
}

function withLocation(href: string, location?: string) {
  return location && location !== allSriLankaLocation ? `${href}?location=${encodeURIComponent(location)}` : href;
}

function withCategoryLocation(groupSlug: string, categorySlug: string, location?: string) {
  const params = new URLSearchParams({ category: categorySlug });

  if (location && location !== allSriLankaLocation) {
    params.set("location", location);
  }

  return `/categories/${groupSlug}?${params.toString()}`;
}

export function generateStaticParams() {
  return Object.values(groupSlugs).map((group) => ({ group }));
}

export default async function MainCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ group: string }>;
  searchParams: Promise<{ category?: string; location?: string }>;
}) {
  const [{ group: groupSlug }, { category, location = defaultLocation }] = await Promise.all([params, searchParams]);
  const group = getGroup(groupSlug);

  if (!group) {
    notFound();
  }

  const meta = groupCopy[groupSlug];
  const Icon = meta.icon;
  const selectedCategorySlug = group.items.some((item) => item[1] === category) ? category ?? group.items[0][1] : group.items[0][1];
  const selectedCategory = getDirectoryItem(group.section, selectedCategorySlug);

  if (!selectedCategory) {
    notFound();
  }

  const selectedDistrict = location === allSriLankaLocation ? undefined : location;
  const listings = buildListings(selectedCategory).slice(0, 8);
  const getListingHref = (listingSlug: string) =>
    group.section === "growth" ? `/${group.section}/${selectedCategory.slug}` : `/${group.section}/${selectedCategory.slug}/${listingSlug}`;
  const localizeText = (value: string) => (selectedDistrict ? value.replaceAll("Jaffna", selectedDistrict) : value);

  return (
    <div className="min-h-screen">
      <section className="mx-auto grid max-w-[1680px] gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[300px_1fr] lg:px-8 lg:py-6">
        <ExploreSidebar activeSection={group.section} activeSlug={selectedCategory.slug} />

        <main className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-canvas-soft px-4 py-2 text-sm font-black text-stone-800 lg:hidden"
          >
            <ArrowLeft size={16} />
            Back
          </Link>

          <nav className="mb-4 flex items-center gap-2 rounded-lg bg-brand/10 px-3 py-3 text-sm font800 text-stone-500">
            <Link href="/" className="text-brand-dark">
              Home
            </Link>
            <ChevronRight size={15} />
            <span className="text-stone-950">{meta.title}</span>
          </nav>

          <header className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-brand/15 text-brand-dark">
              <Icon size={24} />
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-black tracking-tight text-stone-950 sm:text-4xl">{meta.title}</h1>
              <p className="mt-2 text-sm font-semibold leading-6 text-stone-500 sm:text-base">
                {meta.description}{" "}
                {selectedDistrict ? `Showing results around ${selectedDistrict} District.` : "Showing results across Sri Lanka."}
              </p>
            </div>
          </header>

          <section className="mt-5">
            <h2 className="text-lg font-black text-stone-950">Subcategories</h2>
            <div className="mt-3 grid grid-cols-3 gap-2 lg:hidden">
              {group.items.map((item) => {
                const [label, slug, , , , , icon, color] = item;
                const active = slug === selectedCategory.slug;
                const CategoryIcon = categoryIconMap[icon] ?? CircleStackIcon;

                return (
                  <Link
                    key={slug}
                    href={withCategoryLocation(groupSlug, slug, selectedDistrict)}
                    className={`flex min-h-28 flex-col items-center justify-center gap-2 rounded-xl border p-2 text-center transition sm:min-h-32 sm:p-3 ${
                      active
                        ? "border-brand bg-brand/15 text-stone-950"
                        : "border-stone-200 bg-white text-stone-900 hover:border-brand"
                    }`}
                  >
                    <span className={`grid size-10 shrink-0 place-items-center rounded-lg sm:size-11 ${color}`}>
                      <CategoryIcon className="size-5 sm:size-6" />
                    </span>
                    <span className="line-clamp-2 text-[11px] font-black leading-4 text-stone-950 sm:text-sm sm:leading-5">
                      {label}
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-3 hidden gap-3 lg:grid lg:grid-cols-3 xl:grid-cols-4">
              {group.items.map((item) => {
                const [label, slug, , description, total, openNow] = item;
                const active = slug === selectedCategory.slug;

                return (
                  <Link
                    key={slug}
                    href={withLocation(`/${group.section}/${slug}`, selectedDistrict)}
                    className={`rounded-xl border p-3 transition ${
                      active
                        ? "border-brand bg-brand/15 text-stone-950"
                        : "border-stone-200 bg-white text-stone-900 hover:border-brand"
                    }`}
                  >
                    <h3 className="line-clamp-2 min-h-10 text-sm font-black leading-5">{label}</h3>
                    <p className="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-stone-500">{description}</p>
                    <p className="mt-3 text-xs font800 text-brand-dark">
                      {total} listings, {openNow} open
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="mt-7">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-stone-950">{selectedCategory.label}</h2>
                <p className="mt-1 text-sm font-semibold text-stone-500">First listings from this main category.</p>
              </div>
              <Link
                href={withLocation(`/${group.section}/${selectedCategory.slug}`, selectedDistrict)}
                className="inline-flex shrink-0 items-center gap-1 text-sm font-black text-brand-dark"
              >
                View all
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
              {listings.map((listing) => (
                <ListingVisitingCard
                  key={listing.name}
                  href={withLocation(getListingHref(listing.slug), selectedDistrict)}
                  name={localizeText(listing.name)}
                  address={localizeText(listing.address)}
                  phone={listing.phone}
                  whatsapp={listing.whatsapp}
                  district={selectedDistrict ?? allSriLankaLocation}
                  brandColor={listing.brandColor}
                />
              ))}
            </div>
          </section>
        </main>
      </section>
    </div>
  );
}
