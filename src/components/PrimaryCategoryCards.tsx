import Link from "next/link";
import { CalendarDays, Rocket, Store, Tags, Wrench } from "lucide-react";
import type { DirectorySection } from "@/lib/directoryData";

const primaryCategoryCards = [
  {
    label: "Local Store Discovery",
    href: "/stores/cafe",
    section: "stores",
    icon: Store,
  },
  {
    label: "Local Service Providers",
    href: "/services/home-repair",
    section: "services",
    icon: Wrench,
  },
  {
    label: "Sri Lankan Startups",
    href: "/growth/startups",
    section: "growth",
    slug: "startups",
    icon: Rocket,
  },
  {
    label: "Tools and Product Hub",
    href: "/growth/products",
    section: "growth",
    slug: "products",
    icon: Tags,
  },
  {
    label: "Local Events",
    href: "/growth/events",
    section: "growth",
    slug: "events",
    icon: CalendarDays,
  },
] satisfies {
  label: string;
  href: string;
  section: DirectorySection;
  slug?: string;
  icon: typeof Store;
}[];

export function PrimaryCategoryCards({
  activeSection,
  activeSlug,
  withLocation = (href) => href,
}: {
  activeSection?: DirectorySection;
  activeSlug?: string;
  withLocation?: (href: string) => string;
}) {
  return (
    <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {primaryCategoryCards.map((card) => {
        const CardIcon = card.icon;
        const active =
          card.section === activeSection && (card.section !== "growth" || card.slug === activeSlug);

        return (
          <Link
            key={card.href}
            href={withLocation(card.href)}
            className={`rounded-2xl border p-4 text-center transition hover:border-brand ${
              active ? "border-brand bg-brand/10" : "border-stone-200 bg-white"
            }`}
            aria-current={active ? "page" : undefined}
          >
            <span className="mx-auto grid size-11 place-items-center rounded-full bg-canvas-soft text-black">
              <CardIcon size={22} />
            </span>
            <span className="mt-3 block text-sm font-medium text-black">{card.label}</span>
          </Link>
        );
      })}
    </section>
  );
}
