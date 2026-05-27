"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Sparkles } from "lucide-react";

type District = {
  name: string;
  count: number;
  image: string;
};

export function DistrictSelector({
  districts,
  section,
  slug,
  location,
}: {
  districts: District[];
  section: string;
  slug: string;
  location: string;
}) {
  const [showAll, setShowAll] = useState(false);

  return (
    <section className="mt-7">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xl font-black text-stone-950">
          <Sparkles size={22} className="text-brand" />
          Sri Lankan Districts
        </h2>
        <button
          type="button"
          onClick={() => setShowAll((current) => !current)}
          className="rounded-full bg-brand px-4 py-2 text-sm font-black text-stone-950 transition hover:bg-brand-dark"
        >
          {showAll ? "Show Less" : "View All"}
        </button>
      </div>

      <div
        className={`-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 transition-[max-height] duration-300 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-hidden sm:px-0 md:grid-cols-6 xl:grid-cols-8 ${
          showAll ? "sm:max-h-[720px]" : "sm:max-h-32"
        }`}
      >
        {districts.map((district) => (
          <Link
            key={district.name}
            href={`/${section}/${slug}?location=${encodeURIComponent(district.name)}`}
            className="min-w-24 text-center sm:min-w-0"
          >
            <span
              className={`relative mx-auto block size-20 overflow-hidden rounded-full border-4 shadow-sm sm:size-24 ${
                district.name === location ? "border-brand" : "border-brand/20"
              }`}
            >
              <Image src={district.image} alt={district.name} fill sizes="120px" className="object-cover" />
            </span>
            <span className="mt-2 block text-sm font-black text-stone-800">{district.name}</span>
            <span className="text-xs font-black text-brand-dark">{district.count}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
