import Link from "next/link";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { allSriLankaLocation } from "@/lib/locationData";

const fallbackBrandColor = "#49A619";

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

function isValidHexColor(value?: string) {
  return Boolean(value && /^#[0-9a-fA-F]{6}$/.test(value));
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials = words.length >= 2 ? `${words[0][0]}${words[1][0]}` : name.slice(0, 2);
  return initials.toUpperCase();
}

export function ListingVisitingCard({
  href,
  name,
  address,
  phone,
  whatsapp,
  district,
  brandColor,
}: {
  href: string;
  name: string;
  address: string;
  phone: string;
  whatsapp?: string;
  district?: string;
  brandColor?: string;
}) {
  const color: string = isValidHexColor(brandColor) ? brandColor ?? fallbackBrandColor : fallbackBrandColor;
  const contactNumber = whatsapp || phone;

  return (
    <article className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:border-brand hover:shadow-md">
      <div className="relative min-h-[190px] overflow-hidden bg-white">
        <div className="absolute inset-x-0 top-0 h-[43%] bg-[#EFEFEF]" />
        <div
          className="absolute right-4 top-12 grid size-20 place-items-center rounded-full border-[6px] border-white text-xl font-black text-white sm:size-24 sm:text-2xl"
          style={{ backgroundColor: color }}
        >
          {getInitials(name)}
        </div>

        <div className="relative z-10 p-3.5">
          <div className="inline-flex max-w-full rounded-full bg-white/80 px-3 py-1 text-[11px] font-black backdrop-blur" style={{ color }}>
            <span className="truncate">{district || allSriLankaLocation}</span>
          </div>

          <Link href={href} className="mt-3.5 block max-w-[66%]">
            <h2 className="line-clamp-2 text-lg font-black leading-tight tracking-tight text-stone-950 sm:text-xl">{name}</h2>
          </Link>
        </div>

        <div className="relative z-10 mt-8 space-y-2.5 px-3.5 pb-3.5 pt-1">
          <Link href={href} className="block">
            <p className="flex min-w-0 items-center gap-2 text-xs font800 leading-5 text-stone-600 sm:text-sm">
              <MapPin size={16} className="shrink-0" style={{ color }} />
              <span className="line-clamp-2">{address}</span>
            </p>
          </Link>

          <div className="flex flex-wrap items-center justify-start gap-2 pt-1">
            <a
              href={`https://wa.me/${normalizePhoneForWhatsapp(contactNumber)}`}
              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full bg-[#49A619] px-3 text-xs font-black text-white shadow-sm transition hover:bg-[#3d8d15]"
            >
              <MessageCircle size={14} />
              WhatsApp
            </a>
            <a
              href={`tel:${phone}`}
              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full bg-stone-950 px-3 text-xs font-black text-brand shadow-sm transition hover:bg-stone-800"
            >
              <Phone size={14} />
              Call Us
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
