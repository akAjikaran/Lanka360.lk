import { CategoryDetailPage } from "@/components/CategoryDetailPage";
import { getDirectoryItemsBySection } from "@/lib/directoryData";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getDirectoryItemsBySection("stores").map((item) => ({
    category: item.slug,
  }));
}

export default async function StoreCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ location?: string }>;
}) {
  const { category } = await params;
  const { location } = await searchParams;

  return <CategoryDetailPage section="stores" slug={category} location={location} />;
}
