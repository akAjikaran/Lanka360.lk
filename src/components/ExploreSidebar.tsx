"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronDown, ChevronRight, Globe2, Rocket, Store, Tags, Wrench, type LucideIcon } from "lucide-react";
import { sidebarGroups, type DirectorySection } from "@/lib/directoryData";
import { allSriLankaLocation } from "@/lib/locationData";
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

export const groupIcons: Record<string, LucideIcon> = {
  "Local Stores": Store,
  "Local Services": Wrench,
  "Sri Lankan Startups": Rocket,
  "Tools and Product Hub": Tags,
  "Local Events": CalendarDays,
};

type HeroIcon = ComponentType<SVGProps<SVGSVGElement>>;

export const categoryIconMap: Record<string, HeroIcon> = {
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

export function ExploreSidebar({
  activeSection,
  activeSlug,
}: {
  activeSection?: DirectorySection;
  activeSlug?: string;
}) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Local Stores": activeSection ? activeSection === "stores" : true,
    "Local Services": activeSection === "services",
  });
  const [locationQuery, setLocationQuery] = useState("");

  useEffect(() => {
    const updateLocationQuery = (event?: Event) => {
      const locationFromEvent =
        event instanceof CustomEvent && typeof event.detail?.location === "string" ? event.detail.location : undefined;
      const location = locationFromEvent ?? new URLSearchParams(window.location.search).get("location");
      setLocationQuery(location && location !== allSriLankaLocation ? `?location=${encodeURIComponent(location)}` : "");
    };

    updateLocationQuery();
    window.addEventListener("popstate", updateLocationQuery);
    window.addEventListener("lanka360:location-change", updateLocationQuery);

    return () => {
      window.removeEventListener("popstate", updateLocationQuery);
      window.removeEventListener("lanka360:location-change", updateLocationQuery);
    };
  }, []);

  useEffect(() => {
    if (!activeSection) {
      return;
    }

    const activeGroup = sidebarGroups.find(
      (group) => group.section === activeSection && (!activeSlug || group.items.some((item) => item[1] === activeSlug))
    );

    if (!activeGroup) {
      return;
    }

    setOpenGroups((current) => ({
      ...current,
      [activeGroup.title]: true,
    }));
  }, [activeSection]);

  const toggleGroup = (title: string) => {
    setOpenGroups((current) => ({
      ...current,
      [title]: !current[title],
    }));
  };

  return (
    <aside className="hidden rounded-lg border border-stone-200 bg-white p-3 shadow-sm lg:block">
      <div className="mb-3 flex items-center gap-2 px-2 py-2 text-sm font-black uppercase tracking-[0.18em] text-brand-dark">
        <Globe2 size={18} />
        Explore
      </div>
      <div className="space-y-3">
        {sidebarGroups.map((group) => {
          const singleGrowthItem = group.section === "growth" && group.items.length === 1 ? group.items[0] : undefined;
          const isOpen = openGroups[group.title];
          const GroupIcon = groupIcons[group.title];

          if (singleGrowthItem) {
            return (
              <div key={group.title} className="rounded-lg border border-stone-100 bg-stone-50/70 p-2">
                <SidebarItemLink
                  href={`/${group.section}/${singleGrowthItem[1]}${locationQuery}`}
                  item={singleGrowthItem}
                  active={group.section === activeSection && singleGrowthItem[1] === activeSlug}
                  variant="group"
                />
              </div>
            );
          }

          return (
            <div key={group.title} className="rounded-lg border border-stone-100 bg-stone-50/70 p-2">
              <button
                type="button"
                onClick={() => toggleGroup(group.title)}
                className="mb-2 flex w-full items-center justify-between rounded-md bg-white px-3 py-2 text-left text-sm font800 text-stone-900 transition hover:bg-brand/10"
                aria-expanded={isOpen}
              >
                <span className="flex items-center gap-2">
                  <span className="grid size-8 place-items-center bg-brand text-stone-950 [clip-path:polygon(30%_0%,70%_0%,100%_30%,100%_70%,70%_100%,30%_100%,0%_70%,0%_30%)]">
                    <GroupIcon size={17} />
                  </span>
                  {group.title}
                </span>
                {isOpen ? (
                  <ChevronDown size={16} className="text-brand-dark" />
                ) : (
                  <ChevronRight size={16} className="text-stone-400" />
                )}
              </button>

              {isOpen ? (
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <SidebarItemLink
                      key={item[1]}
                      href={`/${group.section}/${item[1]}${locationQuery}`}
                      item={item}
                      active={group.section === activeSection && item[1] === activeSlug}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function SidebarItemLink({
  href,
  item,
  active = false,
  variant = "item",
}: {
  href: string;
  item: (typeof sidebarGroups)[number]["items"][number];
  active?: boolean;
  variant?: "item" | "group";
}) {
  const Icon = categoryIconMap[item[6]] ?? CircleStackIcon;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition hover:bg-brand/15 hover:text-stone-950 ${
        active ? "bg-brand/15 font-black text-stone-950 ring-1 ring-brand/30" : "font-medium text-stone-600"
      } ${variant === "group" ? "bg-white font800 text-stone-900" : ""}`}
    >
      <span
        className={
          variant === "group"
            ? "grid size-8 shrink-0 place-items-center bg-brand text-stone-950 [clip-path:polygon(30%_0%,70%_0%,100%_30%,100%_70%,70%_100%,30%_100%,0%_70%,0%_30%)]"
            : `grid size-7 shrink-0 place-items-center rounded-lg ${item[7]}`
        }
      >
        <Icon className="size-4" />
      </span>
      <span>{item[0]}</span>
    </Link>
  );
}
