import Image from "next/image";
import { ExploreSidebar } from "@/components/ExploreSidebar";
import { HeroRotatingHeadline } from "@/components/HeroRotatingHeadline";
import { ListingModalButton } from "@/components/ListingModalButton";
import { sriLankanDistricts } from "@/lib/locationData";
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
  ShieldCheck,
  Store,
  Tags,
  Wrench,
} from "lucide-react";

const categoryTiles = [
  {
    label: "Sri Lankan Business",
    href: "/stores/cafe?explore=1",
    icon: Store,
  },
  {
    label: "Sri Lankan Services",
    href: "/services/home-repair?explore=1",
    icon: Wrench,
  },
  {
    label: "Sri Lankan Startups",
    href: "/growth/startups?explore=1",
    icon: Rocket,
  },
  {
    label: "Tools and Product Hub",
    href: "/growth/products?explore=1",
    icon: Tags,
  },
  {
    label: "Local Events",
    href: "/growth/events?explore=1",
    icon: CalendarDays,
  },
];

const districtImages = [
  "https://images.unsplash.com/photo-1581351721010-8cf859cb14a4?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1588598198321-9735fd52455b?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1586612863268-136b8659794c?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500&auto=format&fit=crop",
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="mx-auto grid max-w-[1680px] gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[300px_1fr] lg:px-8 lg:py-6">
        <ExploreSidebar />

        <div className="flex flex-col gap-4">
          <section className="order-3 overflow-hidden rounded-2xl border border-stone-200 bg-white lg:order-1">
            <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.2fr_0.8fr] lg:p-9">
              <div className="flex flex-col justify-center">
                <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-canvas-soft px-4 py-2 text-sm font-medium text-black">
                  <MapPin size={14} />
                  Sri Lanka creator and business network
                </div>
                <HeroRotatingHeadline />
                <p className="mt-4 max-w-2xl text-base font-normal leading-7 text-stone-600 sm:text-lg">
                  Lanka360.lk connects passionate creators, business people, makers, builders, and innovators with
                  local customers, partners, communities, products, services, startups, and events across Sri Lanka.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#categories"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-medium text-black transition hover:bg-brand-dark"
                  >
                    Explore the Network
                    <ArrowRight size={18} />
                  </a>
                  <ListingModalButton
                    kind="business"
                    defaultType="Cafe"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-canvas-soft px-5 py-3 text-sm font-medium text-black transition hover:bg-stone-200"
                  >
                    Join for Free
                    <Store size={18} />
                  </ListingModalButton>
                </div>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-canvas-soft lg:aspect-[5/4]">
                <Image
                  src="/images/hero-image.png"
                  alt="Sri Lankan creators, businesses, makers, builders, and innovators"
                  fill
                  priority
                  sizes="(min-width: 1024px) 520px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </section>

          <section id="categories" className="order-1 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:order-2 xl:grid-cols-5">
            {categoryTiles.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-xl border border-stone-200 bg-white p-3 text-center transition hover:border-brand sm:rounded-2xl sm:p-4"
              >
                <span className="mx-auto grid size-11 place-items-center rounded-full bg-canvas-soft text-black">
                  <item.icon size={22} />
                </span>
                <span className="mt-3 block text-xs font-medium leading-4 text-black sm:text-sm">{item.label}</span>
              </a>
            ))}
          </section>

          <section className="order-2 rounded-lg border border-stone-200 bg-white p-4 shadow-sm lg:order-3 sm:p-5">
            <div className="mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-brand-dark" />
              <h2 className="text-xl font-black text-stone-950">Sri Lankan Districts</h2>
            </div>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6 xl:grid-cols-8">
              {sriLankanDistricts.map((district, index) => (
                <a
                  key={district}
                  href={`/stores/cafe?location=${encodeURIComponent(district)}&explore=1`}
                  className="group text-center"
                >
                  <span className="relative mx-auto block size-18 overflow-hidden rounded-lg border-2 border-brand/20 bg-stone-100 shadow-sm transition group-hover:border-brand sm:size-24">
                    <Image
                      src={districtImages[index % districtImages.length]}
                      alt={district}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </span>
                  <span className="mt-2 block text-xs font-black leading-4 text-stone-800 sm:text-sm">{district}</span>
                </a>
              ))}
            </div>
          </section>

          <section className="order-4 grid gap-4 lg:grid-cols-3">
            {[
              {
                title: "Find Near You",
                copy: "Discover creators, stores, service teams, makers, startups, and local opportunities by district.",
                icon: MapPin,
              },
              {
                title: "Contact Directly",
                copy: "Call, WhatsApp, visit, collaborate, or buy directly from the people building across Sri Lanka.",
                icon: MessageCircle,
              },
              {
                title: "Build Visibility",
                copy: "Publish your work, business, service, product, event, or startup so the right people can find you.",
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

          <section id="list-business" className="order-5 rounded-lg border border-stone-200 bg-stone-950 p-5 text-white shadow-sm sm:p-7">
            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-brand px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-stone-950">
                  <BadgeCheck size={14} />
                  Free community profile
                </p>
                <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                  Put your work on the Lanka360 map.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-300 sm:text-base">
                  Create a searchable profile for your business, craft, service, product, event, project, or startup.
                  Customers, collaborators, and communities can reach you directly.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Creator profiles", icon: ShieldCheck },
                  { label: "Search-ready pages", icon: Globe2 },
                  { label: "Direct connections", icon: CircleDollarSign },
                  { label: "Innovation visibility", icon: Flame },
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
