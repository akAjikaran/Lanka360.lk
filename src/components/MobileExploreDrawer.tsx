"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Globe2, Menu, X } from "lucide-react";
import { sidebarGroups } from "@/lib/directoryData";
import { categoryIconMap, groupIcons } from "@/components/ExploreSidebar";
import { allSriLankaLocation } from "@/lib/locationData";

export function MobileExploreDrawer() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [, activeSection, activeSlug] = pathname.split("/");
  const [locationQuery, setLocationQuery] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Sri Lankan Business": true,
    "Sri Lankan Services": true,
  });

  useEffect(() => {
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

  const toggleGroup = (title: string) => {
    setOpenGroups((current) => ({
      ...current,
      [title]: !current[title],
    }));
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const currentParams = new URLSearchParams(window.location.search);

    if (currentParams.get("explore") !== "1") {
      return;
    }

    setOpen(true);
    setOpenGroups(
      sidebarGroups.reduce<Record<string, boolean>>((groups, group) => {
        groups[group.title] =
          group.section === activeSection && (!activeSlug || group.items.some((item) => item[1] === activeSlug));
        return groups;
      }, {})
    );

    currentParams.delete("explore");
    const nextQuery = currentParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [activeSection, activeSlug, pathname, router]);

  const drawer = open ? (
    <div className="fixed inset-0 z-[999] lg:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-stone-950/55"
        aria-label="Close explore categories"
        onClick={() => setOpen(false)}
      />

      <aside className="absolute inset-y-0 left-0 z-[1000] flex w-[86vw] max-w-sm flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone-200 px-4 py-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-brand-dark">
              <Globe2 size={18} />
              Explore
            </p>
            <h2 className="mt-1 text-xl font-black text-stone-950">Categories</h2>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="grid size-10 place-items-center rounded-lg border border-stone-200 text-stone-700"
            aria-label="Close explore categories"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {sidebarGroups.map((group) => {
              const singleGrowthItem = group.section === "growth" && group.items.length === 1 ? group.items[0] : undefined;
              const GroupIcon = groupIcons[group.title];
              const isOpen = openGroups[group.title];

              if (singleGrowthItem) {
                return (
                  <section key={group.title} className="rounded-lg border border-stone-200 bg-stone-50 p-2">
                    <MobileCategoryLink
                      href={`/${group.section}/${singleGrowthItem[1]}${locationQuery}`}
                      item={singleGrowthItem}
                      active={group.section === activeSection && singleGrowthItem[1] === activeSlug}
                      onClick={() => setOpen(false)}
                      variant="group"
                    />
                  </section>
                );
              }

              return (
                <section key={group.title} className="rounded-lg border border-stone-200 bg-stone-50 p-2">
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.title)}
                    className="flex w-full items-center justify-between rounded-lg bg-white px-3 py-3 text-left text-sm font-black text-stone-950"
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-center gap-2">
                      <span className="grid size-9 place-items-center bg-brand text-stone-950 [clip-path:polygon(30%_0%,70%_0%,100%_30%,100%_70%,70%_100%,30%_100%,0%_70%,0%_30%)]">
                        <GroupIcon size={19} />
                      </span>
                      {group.title}
                    </span>
                    {isOpen ? (
                      <ChevronDown size={18} className="text-brand-dark" />
                    ) : (
                      <ChevronRight size={18} className="text-stone-400" />
                    )}
                  </button>

                  {isOpen ? (
                    <div className="mt-2 grid gap-1">
                      {group.items.map((item) => (
                        <MobileCategoryLink
                          key={item[1]}
                          href={`/${group.section}/${item[1]}${locationQuery}`}
                          item={item}
                          active={group.section === activeSection && item[1] === activeSlug}
                          onClick={() => setOpen(false)}
                        />
                      ))}
                    </div>
                  ) : null}
                </section>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="grid size-10 place-items-center rounded-lg border border-stone-200 bg-brand text-stone-950 lg:hidden"
        aria-label="Open explore categories"
      >
        <Menu size={22} />
      </button>

      {mounted && drawer ? createPortal(drawer, document.body) : null}
      {false && open ? (
        <div className="fixed inset-0 z-[200] lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-stone-950/55"
            aria-label="Close explore categories"
            onClick={() => setOpen(false)}
          />

          <aside className="absolute inset-y-0 left-0 z-[201] flex w-[86vw] max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 px-4 py-4">
              <div>
                <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-brand-dark">
                  <Globe2 size={18} />
                  Explore
                </p>
                <h2 className="mt-1 text-xl font-black text-stone-950">Categories</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-10 place-items-center rounded-lg border border-stone-200 text-stone-700"
                aria-label="Close explore categories"
              >
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {sidebarGroups.map((group) => {
                  const GroupIcon = groupIcons[group.title];
                  const isOpen = openGroups[group.title];

                  return (
                    <section key={group.title} className="rounded-lg border border-stone-200 bg-stone-50 p-2">
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.title)}
                        className="flex w-full items-center justify-between rounded-lg bg-white px-3 py-3 text-left text-sm font-black text-stone-950"
                        aria-expanded={isOpen}
                      >
                        <span className="flex items-center gap-2">
                          <span className="grid size-9 place-items-center bg-brand text-stone-950 [clip-path:polygon(30%_0%,70%_0%,100%_30%,100%_70%,70%_100%,30%_100%,0%_70%,0%_30%)]">
                            <GroupIcon size={19} />
                          </span>
                          {group.title}
                        </span>
                        {isOpen ? (
                          <ChevronDown size={18} className="text-brand-dark" />
                        ) : (
                          <ChevronRight size={18} className="text-stone-400" />
                        )}
                      </button>

                      {isOpen ? (
                        <div className="mt-2 grid gap-1">
                          {group.items.map((item) => (
                            <MobileCategoryLink
                              key={item[1]}
                              href={`/${group.section}/${item[1]}${locationQuery}`}
                              item={item}
                              active={group.section === activeSection && item[1] === activeSlug}
                              onClick={() => setOpen(false)}
                            />
                          ))}
                        </div>
                      ) : null}
                    </section>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}

function MobileCategoryLink({
  href,
  item,
  active = false,
  onClick,
  variant = "item",
}: {
  href: string;
  item: (typeof sidebarGroups)[number]["items"][number];
  active?: boolean;
  onClick: () => void;
  variant?: "item" | "group";
}) {
  const Icon = categoryIconMap[item[6]];

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm transition hover:bg-brand/15 hover:text-stone-950 ${
        active ? "bg-brand/15 font-black text-stone-950 ring-1 ring-brand/30" : "font-semibold text-stone-700"
      }`}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span
          className={
            variant === "group"
              ? "grid size-9 shrink-0 place-items-center bg-brand text-stone-950 [clip-path:polygon(30%_0%,70%_0%,100%_30%,100%_70%,70%_100%,30%_100%,0%_70%,0%_30%)]"
              : `grid size-9 shrink-0 place-items-center rounded-lg ${item[7]}`
          }
        >
          <Icon className="size-5" />
        </span>
        <span className="truncate">{item[0]}</span>
      </span>
      <ChevronRight size={16} className="shrink-0 text-stone-400" />
    </Link>
  );
}
