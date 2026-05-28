import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ServicesOverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string }>;
}) {
  const { location } = await searchParams;
  const query = location ? `?location=${encodeURIComponent(location)}` : "";

  redirect(`/services/home-repair${query}`);
}
