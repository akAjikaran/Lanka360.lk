export type DirectorySection = "stores" | "services" | "growth";

export type DirectoryItem = {
  label: string;
  slug: string;
  section: DirectorySection;
  singular: string;
  description: string;
  total: number;
  openNow: number;
  image: string;
  names: string[];
};

export type DirectoryListing = {
  name: string;
  slug: string;
  address: string;
  distance: string;
  rating: string;
  reviews: number;
  open: boolean;
  image: string;
  phone: string;
  whatsapp?: string;
  website: string;
};

type SidebarItemTuple = [
  label: string,
  slug: string,
  singular: string,
  description: string,
  total: number,
  openNow: number,
  icon: string,
  color: string,
];

type SidebarGroup = {
  title: string;
  section: DirectorySection;
  items: SidebarItemTuple[];
};

const cafeNames = [
  "Cafe De Mercury - Jaffna",
  "Barista Jaffna",
  "TAKE ME CAFE",
  "Vijitha Cafe & Cool Bar",
  "Gowri Cafe",
  "Groot Cafe",
  "KASUN'S KARMA JAFFNA",
  "Rathna Cafe",
  "Nizhal Cafe And Restaurant",
  "RR CAFE JAFFNA",
  "Karudaa Cafe - Jaffna",
  "Arul Bakery Cafe",
  "INDRA CAFE",
];

const addresses = [
  "M256+JHW, Jaffna, Sri Lanka",
  "7, Third Floor, Block No. S-2, Hospital Road",
  "420 Hospital Rd, Jaffna 40000, Sri Lanka",
  "Jaffna, Sri Lanka",
  "256 Beach Rd, Jaffna, Sri Lanka",
  "315A Clock Tower Rd, Jaffna, Sri Lanka",
  "716 Hospital St, Jaffna, Sri Lanka",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function toSlug(value: string) {
  return slugify(value);
}

export const sidebarGroups: SidebarGroup[] = [
  {
    title: "Local Stores",
    section: "stores" as const,
    items: [
      ["Cafe", "cafe", "cafe", "Find local cafes, coffee shops, bakeries, and cool bars near Jaffna.", 13, 10, "cup", "text-brand-dark bg-brand/15"],
      ["Fashion & Clothing", "fashion-clothing", "fashion store", "Clothing, tailoring, footwear, and fashion stores around your selected city.", 19, 14, "sparkles", "text-fuchsia-700 bg-fuchsia-100"],
      ["Furniture & Home Decor", "furniture-home-decor", "furniture store", "Furniture, home decor, mattress, and interior shops in your area.", 11, 8, "home", "text-lime-700 bg-lime-100"],
      ["Gift Stores", "gift-stores", "gift store", "Gift shops, greeting cards, hampers, toys, and celebration items near you.", 12, 9, "gift", "text-rose-700 bg-rose-100"],
      ["Jewellery", "jewellery", "jewellery store", "Gold, silver, fashion jewellery, repairs, and custom jewellery stores.", 10, 7, "diamond", "text-cyan-700 bg-cyan-100"],
      ["Mobile & Accessories", "mobile-accessories", "mobile store", "Mobile phones, covers, chargers, repairs, and accessories nearby.", 24, 18, "phone", "text-sky-700 bg-sky-100"],
      ["Pet Shops", "pet-shops", "pet shop", "Pet food, grooming, accessories, and animal care shops in your area.", 8, 6, "heart", "text-orange-700 bg-orange-100"],
      ["Salon & Beauty", "salon-beauty", "salon", "Salons, beauty stores, grooming, bridal makeup, and wellness shops.", 18, 12, "scissors", "text-pink-700 bg-pink-100"],
      ["Street Food & Snacks", "street-food-snacks", "street food shop", "Street food vendors, snack bars, short eats, and quick bites nearby.", 17, 13, "fire", "text-red-700 bg-red-100"],
      ["Sweets & Snacks", "sweets-snacks", "sweet shop", "Sweet shops, snacks, desserts, cakes, and celebration treats.", 14, 10, "cake", "text-purple-700 bg-purple-100"],
      ["Restaurant", "restaurant", "restaurant", "Restaurants, rice shops, family dining, and local food places near you.", 22, 16, "building-storefront", "text-emerald-700 bg-emerald-100"],
      ["Grocery", "grocery", "grocery store", "Daily grocery stores, mini marts, and local food shops near you.", 28, 22, "shopping-bag", "text-green-700 bg-green-100"],
      ["Dairy", "dairy", "dairy shop", "Fresh milk, curd, yoghurt, cheese, and dairy product sellers nearby.", 9, 7, "beaker", "text-brand-dark bg-brand/15"],
      ["Medical", "medical", "medical store", "Medical stores, pharmacies, health products, and wellness shops open near Jaffna.", 16, 13, "heart", "text-teal-700 bg-teal-100"],
      ["General Store", "general-store", "general store", "Everyday essentials, household goods, and neighborhood general stores.", 21, 17, "building-storefront", "text-stone-700 bg-stone-100"],
      ["Bakery", "bakery", "bakery", "Bakeries, cakes, bread, pastries, short eats, and fresh baked goods.", 15, 11, "cake", "text-brand-dark bg-brand/15"],
      ["Hardware", "hardware", "hardware store", "Tools, building materials, paint, and hardware suppliers nearby.", 21, 17, "wrench", "text-slate-700 bg-slate-100"],
      ["Electronics", "electronics", "electronics store", "Mobile, computer, repair, and electronic goods stores nearby.", 24, 18, "bolt", "text-indigo-700 bg-indigo-100"],
    ],
  },
  {
    title: "Local Services",
    section: "services" as const,
    items: [
      ["Home Repair", "home-repair", "home repair service", "Electricians, plumbers, carpenters, and home repair teams.", 15, 11, "wrench", "text-slate-700 bg-slate-100"],
      ["Beauty", "beauty", "beauty service", "Salons, spas, bridal makeup, and grooming services near you.", 18, 12, "sparkles", "text-pink-700 bg-pink-100"],
      ["Vehicle Care", "vehicle-care", "vehicle care service", "Garages, washes, mechanics, tire shops, and vehicle services.", 20, 16, "truck", "text-brand-dark bg-brand/15"],
      ["IT Support", "it-support", "IT support service", "Laptop, network, software, and business IT support providers.", 12, 9, "computer", "text-indigo-700 bg-indigo-100"],
      ["Education", "education", "education service", "Tuition classes, institutes, tutors, and training centers.", 23, 15, "academic-cap", "text-violet-700 bg-violet-100"],
      ["Healthcare", "healthcare", "healthcare service", "Clinics, labs, doctors, and healthcare service providers.", 14, 10, "heart", "text-emerald-700 bg-emerald-100"],
    ],
  },
  {
    title: "Sri Lankan Startups",
    section: "growth" as const,
    items: [
      ["Sri Lankan Startups", "startups", "startup", "New Sri Lankan startups, founders, products, and launch stories.", 8, 6, "rocket", "text-orange-700 bg-orange-100"],
      ["New Business Ideas", "new-business-ideas", "business idea", "Small business ideas, side hustles, and new local opportunities for Sri Lankan founders.", 18, 14, "sparkles", "text-fuchsia-700 bg-fuchsia-100"],
      ["Funding & Investors", "funding-investors", "funding contact", "Local grants, angel investors, business loans, pitch events, and startup funding support.", 9, 5, "tag", "text-emerald-700 bg-emerald-100"],
      ["Co-working & Incubators", "coworking-incubators", "startup space", "Co-working spaces, incubators, accelerators, mentoring hubs, and founder communities.", 7, 5, "building-storefront", "text-sky-700 bg-sky-100"],
      ["Founder Stories", "founder-stories", "founder story", "Stories from Sri Lankan entrepreneurs, makers, small business owners, and startup teams.", 16, 12, "newspaper", "text-stone-700 bg-stone-100"],
    ],
  },
  {
    title: "Tools and Product Hub",
    section: "growth" as const,
    items: [
      ["Tools and Product Hub", "products", "product", "Products from nearby businesses with direct seller contact.", 42, 34, "cube", "text-sky-700 bg-sky-100"],
      ["SaaS Tools", "saas-tools", "SaaS tool", "Cloud software, subscriptions, business apps, booking systems, CRMs, and online tools for Sri Lankan businesses.", 24, 18, "computer", "text-indigo-700 bg-indigo-100"],
      ["AI Tools", "ai-tools", "AI tool", "AI apps, automation tools, chatbots, content tools, and smart services built for local users and businesses.", 19, 15, "sparkles", "text-fuchsia-700 bg-fuchsia-100"],
      ["Digital Products", "digital-products", "digital product", "Templates, ebooks, courses, design assets, software downloads, and digital resources from local creators.", 28, 22, "cube", "text-sky-700 bg-sky-100"],
      ["Innovative Products", "innovative-products", "innovative product", "New inventions, startup products, smart devices, local innovations, and unique product launches.", 17, 12, "bolt", "text-orange-700 bg-orange-100"],
      ["Agri Products", "agri-products", "agri product", "Farm produce, agri tools, seeds, fertilizer, machinery, and products for growers and sellers.", 23, 17, "beaker", "text-green-700 bg-green-100"],
    ],
  },
  {
    title: "Local Events",
    section: "growth" as const,
    items: [
      ["Local Events", "events", "event", "Community events, fairs, meetups, and local activities.", 17, 12, "calendar", "text-purple-700 bg-purple-100"],
      ["Workshops & Classes", "workshops-classes", "workshop", "Skill classes, training programs, weekend workshops, and learning events nearby.", 14, 10, "academic-cap", "text-violet-700 bg-violet-100"],
      ["Job Fairs & Career Events", "job-fairs-career-events", "career event", "Hiring days, job fairs, career guidance, internships, and employment events.", 11, 8, "briefcase", "text-orange-700 bg-orange-100"],
      ["Religious & Cultural Events", "religious-cultural-events", "cultural event", "Temple, church, mosque, kovil, cultural, music, drama, and festival events.", 24, 20, "sparkles", "text-rose-700 bg-rose-100"],
      ["Markets & Exhibitions", "markets-exhibitions", "market event", "Local markets, trade fairs, exhibitions, pop-up sales, and product showcases.", 21, 16, "building-storefront", "text-emerald-700 bg-emerald-100"],
      ["Sports & Community", "sports-community", "community event", "Sports meets, charity events, community programs, clubs, and neighborhood activities.", 18, 13, "heart", "text-teal-700 bg-teal-100"],
    ],
  },
];

const imagesBySlug: Record<string, string> = {
  cafe: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=900&auto=format&fit=crop",
  grocery: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=900&auto=format&fit=crop",
  "fashion-clothing": "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=900&auto=format&fit=crop",
  electronics: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=900&auto=format&fit=crop",
  "furniture-home-decor": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=900&auto=format&fit=crop",
  "gift-stores": "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=900&auto=format&fit=crop",
  jewellery: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=900&auto=format&fit=crop",
  "mobile-accessories": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=900&auto=format&fit=crop",
  "pet-shops": "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?q=80&w=900&auto=format&fit=crop",
  "salon-beauty": "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=900&auto=format&fit=crop",
  "street-food-snacks": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=900&auto=format&fit=crop",
  "sweets-snacks": "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=900&auto=format&fit=crop",
  restaurant: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=900&auto=format&fit=crop",
  dairy: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=900&auto=format&fit=crop",
  medical: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=900&auto=format&fit=crop",
  "general-store": "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=900&auto=format&fit=crop",
  bakery: "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?q=80&w=900&auto=format&fit=crop",
  hardware: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=900&auto=format&fit=crop",
  "book-shops": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=900&auto=format&fit=crop",
  "home-repair": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=900&auto=format&fit=crop",
  beauty: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=900&auto=format&fit=crop",
  "vehicle-care": "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=900&auto=format&fit=crop",
  "it-support": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=900&auto=format&fit=crop",
  education: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=900&auto=format&fit=crop",
  healthcare: "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=900&auto=format&fit=crop",
  jobs: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=900&auto=format&fit=crop",
  startups: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=900&auto=format&fit=crop",
  "new-business-ideas": "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=900&auto=format&fit=crop",
  "funding-investors": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=900&auto=format&fit=crop",
  "coworking-incubators": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=900&auto=format&fit=crop",
  "founder-stories": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=900&auto=format&fit=crop",
  products: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=900&auto=format&fit=crop",
  "saas-tools": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=900&auto=format&fit=crop",
  "ai-tools": "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=900&auto=format&fit=crop",
  "digital-products": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=900&auto=format&fit=crop",
  "innovative-products": "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?q=80&w=900&auto=format&fit=crop",
  "agri-products": "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=900&auto=format&fit=crop",
  events: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=900&auto=format&fit=crop",
  "workshops-classes": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=900&auto=format&fit=crop",
  "job-fairs-career-events": "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=900&auto=format&fit=crop",
  "religious-cultural-events": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop",
  "markets-exhibitions": "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=900&auto=format&fit=crop",
  "sports-community": "https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=900&auto=format&fit=crop",
  news: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=900&auto=format&fit=crop",
  offers: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=900&auto=format&fit=crop",
};

function buildNames(label: string, slug: string) {
  if (slug === "cafe") {
    return cafeNames;
  }

  return [
    `${label} Hub Jaffna`,
    `Northern ${label} Center`,
    `Jaffna ${label} Point`,
    `City ${label} Lanka`,
    `${label} Express`,
    `A9 ${label} House`,
    `New Town ${label}`,
    `Trusted ${label} Service`,
    `Smart ${label} Jaffna`,
    `Royal ${label} Place`,
    `Metro ${label} LK`,
    `Family ${label} Store`,
  ];
}

export const directoryItems: DirectoryItem[] = sidebarGroups.flatMap((group) =>
  group.items.map(([label, slug, singular, description, total, openNow]) => ({
    label,
    slug,
    section: group.section,
    singular,
    description,
    total,
    openNow,
    image: imagesBySlug[slug],
    names: buildNames(label, slug),
  }))
);

export function getDirectoryItem(section: DirectorySection, slug: string) {
  return directoryItems.find((item) => item.section === section && item.slug === slug);
}

export function getDirectoryItemsBySection(section: DirectorySection) {
  return directoryItems.filter((item) => item.section === section);
}

export function buildListings(item: DirectoryItem): DirectoryListing[] {
  return item.names.map((name, index) => ({
    name,
    slug: slugify(name),
    address: addresses[index % addresses.length],
    distance: (0.2 + index * 0.23).toFixed(1),
    rating: (5 - (index % 5) * 0.2).toFixed(1),
    reviews: index + 1,
    open: index < item.openNow,
    image: item.image,
    phone: "+94 77 000 0000",
    whatsapp: "+94 77 000 0000",
    website: `https://lanka360.lk/${item.section}/${item.slug}/${slugify(name)}`,
  }));
}

export function getStoreListing(categorySlug: string, storeSlug: string) {
  const category = getDirectoryItem("stores", categorySlug);

  if (!category) {
    return undefined;
  }

  return buildListings(category).find((listing) => listing.slug === storeSlug);
}

export function getServiceListing(categorySlug: string, serviceSlug: string) {
  const category = getDirectoryItem("services", categorySlug);

  if (!category) {
    return undefined;
  }

  return buildListings(category).find((listing) => listing.slug === serviceSlug);
}

export function findBestSearchMatch(query: string) {
  const normalizedQuery = slugify(query);

  if (!normalizedQuery) {
    return undefined;
  }

  for (const item of directoryItems) {
    if (item.slug === normalizedQuery || slugify(item.label).includes(normalizedQuery)) {
      return {
        href: `/${item.section}/${item.slug}`,
        label: item.label,
      };
    }

    const listing = buildListings(item).find(
      (entry) => entry.slug === normalizedQuery || entry.slug.includes(normalizedQuery)
    );

    if (listing && item.section !== "growth") {
      return {
        href: `/${item.section}/${item.slug}/${listing.slug}`,
        label: listing.name,
      };
    }
  }

  return undefined;
}
