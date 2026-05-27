import { StoreProfilePage } from "@/components/StoreProfilePage";
import { buildListings, getDirectoryItemsBySection } from "@/lib/directoryData";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getDirectoryItemsBySection("stores").flatMap((category) =>
    buildListings(category).map((listing) => ({
      category: category.slug,
      store: listing.slug,
    }))
  );
}

export default async function StoreDetailPage({
  params,
}: {
  params: Promise<{ category: string; store: string }>;
}) {
  const { category, store } = await params;

  return <StoreProfilePage categorySlug={category} storeSlug={store} />;
}
