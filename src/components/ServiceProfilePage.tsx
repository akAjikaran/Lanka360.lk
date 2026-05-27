import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExploreSidebar } from "@/components/ExploreSidebar";
import {
  Camera,
  ChevronRight,
  Clock3,
  Download,
  ExternalLink,
  Globe,
  MapPin,
  MessageCircle,
  Navigation,
  PenLine,
  Phone,
  QrCode,
  Share2,
  Star,
  Wrench,
} from "lucide-react";
import { getDirectoryItem, getServiceListing } from "@/lib/directoryData";
import { getApprovedListingSubmissionBySlug } from "@/lib/listingSubmissions";

function normalizeWhatsapp(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("94")) {
    return digits;
  }

  if (digits.startsWith("0")) {
    return `94${digits.slice(1)}`;
  }

  return digits;
}

export async function ServiceProfilePage({ categorySlug, serviceSlug }: { categorySlug: string; serviceSlug: string }) {
  const category = getDirectoryItem("services", categorySlug);
  const staticService = getServiceListing(categorySlug, serviceSlug);
  const approvedService =
    category && !staticService
      ? await getApprovedListingSubmissionBySlug({
          kind: "service",
          type: category.label,
          slug: serviceSlug,
        })
      : undefined;
  const service = staticService ?? (approvedService
    ? {
        name: approvedService.name,
        slug: serviceSlug,
        address: approvedService.address,
        distance: "",
        rating: "",
        reviews: 0,
        open: false,
        image: category?.image ?? "",
        phone: approvedService.phone ?? "",
        whatsapp: approvedService.whatsapp,
        website: "",
      }
    : undefined);
  const isSubmittedService = Boolean(approvedService && !staticService);

  if (!category || !service) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <section className="mx-auto grid max-w-[1680px] gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[300px_1fr] lg:px-8 lg:py-6">
        <ExploreSidebar activeSection="services" activeSlug={categorySlug} />

        <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
          <nav className="mb-4 flex flex-wrap items-center gap-2 rounded-lg bg-brand/10 px-3 py-3 text-sm font800 text-stone-500">
            <Link href="/" className="text-brand-dark">
              Home
            </Link>
            <ChevronRight size={15} />
            <span>Services</span>
            <ChevronRight size={15} />
            <Link href={`/services/${category.slug}`} className="text-brand-dark">
              {category.label}
            </Link>
            <ChevronRight size={15} />
            <span className="text-stone-950">{service.name}</span>
          </nav>

          <section className="overflow-hidden rounded-lg bg-brand/15">
            <div className="relative flex min-h-[420px] flex-col items-center justify-center px-5 py-10 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(29,203,121,0.8),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.9),rgba(29,203,121,0.3))]" />
              <div className="relative">
                <div className="relative mx-auto size-32 overflow-hidden rounded-full border-4 border-emerald-500 bg-white shadow-xl">
                  <Image src={service.image} alt={service.name} fill priority sizes="140px" className="object-cover" />
                </div>
                <span className="absolute bottom-2 right-1 size-5 rounded-full border-4 border-white bg-emerald-500" />
              </div>

              <div className="relative mt-5 max-w-3xl">
                <h1 className="text-3xl font-black tracking-tight text-stone-950 sm:text-5xl">{service.name}</h1>
                <div className={`mt-3 flex-wrap items-center justify-center gap-2 text-sm font800 ${isSubmittedService ? "hidden" : "flex"}`}>
                  <span className="flex items-center gap-1 text-brand">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} size={17} fill="currentColor" />
                    ))}
                  </span>
                  <span>{service.rating}</span>
                  <span className="text-brand-dark underline underline-offset-2">({service.reviews} review)</span>
                </div>
                <p className="mt-3 text-sm font800 text-stone-700">
                  {category.label}
                  {!isSubmittedService ? (
                    <span className="ml-2 rounded-full bg-emerald-100 px-2 py-1 text-xs font-black text-emerald-700">
                      {service.open ? "Open Now" : "Closed"}
                    </span>
                  ) : null}
                </p>
                <p className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-stone-600">
                  <MapPin size={16} />
                  {service.address}
                </p>
                <p className={`mt-2 items-center justify-center gap-2 text-sm font-semibold text-stone-600 ${service.phone ? "flex" : "hidden"}`}>
                  <Phone size={16} />
                  {service.phone}
                </p>
              </div>

              <div className="relative mt-6 grid w-full max-w-lg gap-3 sm:grid-cols-3">
                <a
                  href={`https://wa.me/${normalizeWhatsapp(service.whatsapp ?? service.phone)}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-sm"
                >
                  <MessageCircle size={17} />
                  WhatsApp
                </a>
                <a
                  href={`tel:${service.phone}`}
                  className={`${service.phone ? "inline-flex" : "hidden"} items-center justify-center gap-2 rounded-lg bg-stone-950 px-4 py-3 text-sm font-black text-brand shadow-sm`}
                >
                  <Phone size={17} />
                  Call Now
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(service.address)}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-black text-stone-950 shadow-sm"
                >
                  <Navigation size={17} />
                  View Map
                </a>
              </div>
            </div>
          </section>

          <section className="mt-5 rounded-lg border border-brand/30 bg-brand/10 p-4">
            <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-brand-dark">
              <span className="size-3 rounded-full bg-emerald-500" />
              Latest Updates
            </h2>
            <p className="mt-3 min-h-5 text-sm font-medium text-stone-500">
              {isSubmittedService ? "" : "No latest updates posted by this service yet."}
            </p>
          </section>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_360px]">
            <div className="space-y-5">
              <section className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-stone-500">
                  <Globe size={19} className="text-brand-dark" />
                  Website
                </h2>
                {service.website ? (
                  <a href={service.website} className="mt-2 inline-flex items-center gap-1 break-all text-sm font800 text-brand-dark">
                    {service.website}
                    <ExternalLink size={14} />
                  </a>
                ) : (
                  <div className="mt-2 min-h-5" />
                )}
              </section>

              <section className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-stone-950">
                  <Clock3 size={22} className="text-brand-dark" />
                  Opening Hours
                  <span className="rounded-full bg-brand/15 px-2 py-1 text-xs font-black text-brand-dark">
                    Asia/Colombo
                  </span>
                </h2>
                <div className={`gap-2 text-sm text-stone-700 sm:grid-cols-2 ${isSubmittedService ? "hidden" : "grid"}`}>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <p key={day}>
                      <strong>{day}:</strong> 8:00 AM - 10:30 PM
                    </p>
                  ))}
                </div>
              </section>

              <ContentSection title="About">
                <p>{approvedService?.description ?? (isSubmittedService ? "" : "No description added by this service yet.")}</p>
                <button className={`mt-4 items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-black text-stone-950 ${isSubmittedService ? "hidden" : "inline-flex"}`}>
                  <PenLine size={15} />
                  Update Listing
                </button>
              </ContentSection>

              <div className="rounded-lg border border-stone-200 bg-white p-4 text-sm font-semibold leading-6 text-stone-700">
                <span className="font-black text-stone-950">Address:</span> {service.address}
              </div>

              <section className="rounded-lg border border-stone-200 bg-white p-4">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-stone-950">
                  <MapPin size={22} className="text-brand-dark" />
                  Location
                </h2>
                <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-stone-200 bg-brand/10 sm:min-h-[520px]">
                  <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(#d6d3d1_1px,transparent_1px),linear-gradient(90deg,#d6d3d1_1px,transparent_1px)] [background-size:36px_36px]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_45%,rgba(29,203,121,0.42),transparent_18%),radial-gradient(circle_at_70%_62%,rgba(59,130,246,0.18),transparent_14%)]" />
                  <div className="absolute left-4 top-4 max-w-xs rounded-lg bg-white p-4 shadow-sm">
                    <p className="font-black text-stone-950">{service.name}</p>
                    <p className="mt-1 text-xs leading-5 text-stone-600">{service.address}</p>
                    <p className="mt-2 text-sm font-black text-brand-dark">{isSubmittedService ? "" : `${service.rating} rating`}</p>
                  </div>
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <span className="mx-auto grid size-14 place-items-center rounded-full bg-red-600 text-white shadow-xl">
                      <MapPin size={30} fill="currentColor" />
                    </span>
                    <p className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-black text-stone-950 shadow-sm">
                      {service.name}
                    </p>
                  </div>
                </div>
              </section>

              <ContentSection title="Photos" icon={<Camera size={22} className="text-brand-dark" />}>
                <p>No photos added by this service yet.</p>
              </ContentSection>

              <section className="rounded-lg border border-stone-200 bg-white p-4">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="flex items-center gap-2 text-xl font-black text-stone-950">
                    <Star size={22} className="text-brand" fill="currentColor" />
                    Customer Reviews
                  </h2>
                  <button className="rounded-lg bg-brand px-4 py-2 text-sm font-black text-stone-950">Write a Review</button>
                </div>
                <div className={`rounded-lg border border-stone-200 p-4 ${isSubmittedService ? "hidden" : ""}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-black text-stone-950">Google Ratings</p>
                      <p className="mt-2 flex items-center gap-1 text-brand">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star key={index} size={17} fill="currentColor" />
                        ))}
                        <span className="ml-2 text-sm font800 text-stone-600">{service.rating}</span>
                      </p>
                    </div>
                    <span className="text-sm font-medium text-stone-500">26 May 2026</span>
                  </div>
                </div>
              </section>
            </div>

            <aside className="h-fit rounded-lg border border-stone-200 bg-white p-5 shadow-sm xl:sticky xl:top-28">
              <div className={`text-center ${isSubmittedService ? "hidden" : ""}`}>
                <h2 className="text-lg font-black text-stone-950">Scan to View Service Profile</h2>
                <div className="mx-auto mt-4 grid size-56 grid-cols-9 gap-1 rounded-lg bg-white p-3 ring-1 ring-stone-200">
                  {Array.from({ length: 81 }).map((_, index) => (
                    <span
                      key={index}
                      className={`rounded-sm ${
                        index % 2 === 0 || index % 7 === 0 || index % 11 === 0 ? "bg-brand-dark" : "bg-brand/15"
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-3 py-2 text-sm font-black text-stone-950">
                    <Download size={15} />
                    PNG
                  </button>
                  <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm font-black text-stone-700">
                    <QrCode size={15} />
                    SVG
                  </button>
                </div>
                <button className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg border border-stone-200 px-4 py-2 text-sm font-black text-stone-700">
                  <Share2 size={15} />
                  Share
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-stone-500">{label}</p>
      <p className="mt-2 text-sm font800 text-stone-950">{value}</p>
    </div>
  );
}

function ContentSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4">
      <h2 className="mb-3 flex items-center gap-2 text-xl font-black text-stone-950">
        {icon ?? <Wrench size={22} className="text-brand-dark" />}
        {title}
      </h2>
      <div className="text-sm leading-6 text-stone-500">{children}</div>
    </section>
  );
}
