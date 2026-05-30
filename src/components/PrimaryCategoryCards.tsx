import Link from "next/link";
import { CalendarDays, Rocket, Store, Tags, Wrench } from "lucide-react";
import type { DirectorySection } from "@/lib/directoryData";

const primaryCategoryCards = [
  {
    label: "Sri Lankan Business",
    href: "/stores/cafe",
    section: "stores",
    icon: Store,
  },
  {
    label: "Sri Lankan Services",
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

function withExploreDrawer(href: string) {
  return `${href}${href.includes("?") ? "&" : "?"}explore=1`;
}

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
    <section className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {primaryCategoryCards.map((card) => {
        const CardIcon = card.icon;
        const active =
          card.section === activeSection && (card.section !== "growth" || card.slug === activeSlug);

        return (
          <Link
            key={card.href}
            href={withExploreDrawer(withLocation(card.href))}
            className={`rounded-xl border p-3 text-center transition hover:border-brand sm:rounded-2xl sm:p-4 ${
              active ? "border-brand bg-brand/10" : "border-stone-200 bg-white"
            }`}
            aria-current={active ? "page" : undefined}
          >
            <span className="mx-auto grid size-11 place-items-center rounded-full bg-canvas-soft text-black">
              <CardIcon size={22} />
            </span>
            <span className="mt-3 block text-xs font-medium leading-4 text-black sm:text-sm">{card.label}</span>
          </Link>
        );
      })}
    </section>
  );
}
