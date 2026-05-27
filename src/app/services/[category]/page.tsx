import { CategoryDetailPage } from "@/components/CategoryDetailPage";
import { getDirectoryItemsBySection } from "@/lib/directoryData";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getDirectoryItemsBySection("services").map((item) => ({
    category: item.slug,
  }));
}

export default async function ServiceCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ location?: string }>;
}) {
  const { category } = await params;
  const { location } = await searchParams;

  return <CategoryDetailPage section="services" slug={category} location={location} />;
}
