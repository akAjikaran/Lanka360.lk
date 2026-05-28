import Image from "next/image";
import { ExploreSidebar } from "@/components/ExploreSidebar";
import { ListingModalButton } from "@/components/ListingModalButton";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CircleDollarSign,
  Flame,
  Globe2,
  MapPin,
  Megaphone,
  MessageCircle,
  Rocket,
  Search,
  ShieldCheck,
  Store,
  Tags,
  Wrench,
} from "lucide-react";

const categoryTiles = [
  {
    label: "Local Store Discovery",
    href: "/stores/cafe",
    icon: Store,
  },
  {
    label: "Local Service Providers",
    href: "/services/home-repair",
    icon: Wrench,
  },
  {
    label: "Sri Lankan Startups",
    href: "/growth/startups",
    icon: Rocket,
  },
  {
    label: "Tools and Product Hub",
    href: "/growth/products",
    icon: Tags,
  },
  {
    label: "Local Events",
    href: "/growth/events",
    icon: CalendarDays,
  },
];

const featuredListings = [
  {
    name: "Ceylon Craft Market",
    meta: "Handmade gifts, Galle",
    image: "https://images.unsplash.com/photo-1516211697506-8360dbcfe9a4?q=80&w=900&auto=format&fit=crop",
    badge: "Open now",
  },
  {
    name: "Kandy Tech Repairs",
    meta: "Laptop and phone service",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=900&auto=format&fit=crop",
    badge: "Verified",
  },
  {
    name: "Nawala Food Street",
    meta: "Restaurants and cafes",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=900&auto=format&fit=crop",
    badge: "Popular",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="mx-auto grid max-w-[1680px] gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[300px_1fr] lg:px-8 lg:py-6">
        <ExploreSidebar />

        <div className="space-y-4">
          <section className="overflow-hidden rounded-lg border border-brand/30 bg-brand shadow-sm">
            <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.2fr_0.8fr] lg:p-9">
              <div className="flex flex-col justify-center">
                <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-brand-dark">
                  <MapPin size={14} />
                  Sri Lanka nearby search
                </div>
                <h1 className="max-w-2xl text-4xl font-black tracking-tight text-stone-950 sm:text-5xl lg:text-6xl">
                  Find anything local in one trusted place.
                </h1>
                <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-stone-800 sm:text-lg">
                  Lanka360.lk connects people with Sri Lankan stores, services, businesses, jobs, products, news,
                  events, and startups by location.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#categories"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-black text-brand transition hover:bg-stone-800"
                  >
                    Start Exploring
                    <ArrowRight size={18} />
                  </a>
                  <ListingModalButton
                    kind="business"
                    defaultType="Cafe"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-stone-950 ring-1 ring-black/5 transition hover:bg-brand/10"
                  >
                    List for Free
                    <Store size={18} />
                  </ListingModalButton>
                </div>
              </div>

              <div className="relative min-h-72 overflow-hidden rounded-lg bg-stone-950 p-4 text-white">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(29,203,121,0.28),transparent_44%),linear-gradient(315deg,rgba(16,185,129,0.18),transparent_40%)]" />
                <div className="relative grid h-full content-between gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    {featuredListings.slice(0, 2).map((listing) => (
                      <div key={listing.name} className="overflow-hidden rounded-lg bg-white/10 ring-1 ring-white/15">
                        <div className="relative h-24">
                          <Image src={listing.image} alt="" fill sizes="180px" className="object-cover" />
                        </div>
                        <div className="p-3">
                          <p className="text-xs font-black">{listing.name}</p>
                          <p className="mt-1 text-[11px] text-white/70">{listing.meta}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg bg-white p-4 text-stone-950 shadow-xl">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-black">Near Colombo</span>
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
                        1.2 km
                      </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-stone-100 px-3 py-2 text-sm text-stone-500">
                      <Search size={16} />
                      plumber, cafe, job, startup...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="categories" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {categoryTiles.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-lg border border-stone-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
              >
                <span className="mx-auto grid size-11 place-items-center rounded-lg bg-brand/15 text-brand-dark">
                  <item.icon size={22} />
                </span>
                <span className="mt-3 block text-sm font-black text-stone-900">{item.label}</span>
              </a>
            ))}
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            {[
              {
                title: "Find Near You",
                copy: "Search by town, category, distance, open status, ratings, and verified details.",
                icon: MapPin,
              },
              {
                title: "Contact Directly",
                copy: "Call, WhatsApp, visit, or apply without marketplace commissions or middlemen.",
                icon: MessageCircle,
              },
              {
                title: "Grow Locally",
                copy: "Businesses, startups, and service providers can publish pages built for discovery.",
                icon: Megaphone,
              },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
                <span className="grid size-12 place-items-center rounded-lg bg-brand/15 text-brand-dark">
                  <item.icon size={24} />
                </span>
                <h3 className="mt-4 text-lg font-black text-stone-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{item.copy}</p>
              </div>
            ))}
          </section>

          <section id="list-business" className="rounded-lg border border-stone-200 bg-stone-950 p-5 text-white shadow-sm sm:p-7">
            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-brand px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-stone-950">
                  <BadgeCheck size={14} />
                  Free basic listing
                </p>
                <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                  Put your business on the Lanka360 map.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-300 sm:text-base">
                  Build a searchable profile for your store, service, product catalog, hiring needs, offers, and
                  startup story. Customers reach you directly.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Verified profiles", icon: ShieldCheck },
                  { label: "Google-ready pages", icon: Globe2 },
                  { label: "Direct leads", icon: CircleDollarSign },
                  { label: "Startup visibility", icon: Flame },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-white/10 p-4 ring-1 ring-white/10">
                    <item.icon size={22} className="text-brand" />
                    <p className="mt-3 text-sm font-black">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
