import { ServiceProfilePage } from "@/components/ServiceProfilePage";
import { buildListings, getDirectoryItemsBySection } from "@/lib/directoryData";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getDirectoryItemsBySection("services").flatMap((category) =>
    buildListings(category).map((listing) => ({
      category: category.slug,
      service: listing.slug,
    }))
  );
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ category: string; service: string }>;
}) {
  const { category, service } = await params;

  return <ServiceProfilePage categorySlug={category} serviceSlug={service} />;
}
