import UserDashboard from "@/components/UserDashboard";

export default async function AdminUserDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ start?: string; end?: string; q?: string; source?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const userId = decodeURIComponent(resolvedParams.userId);

  const dashboardParams = new URLSearchParams();
  if (resolvedSearchParams.start) dashboardParams.set("start", resolvedSearchParams.start);
  if (resolvedSearchParams.end) dashboardParams.set("end", resolvedSearchParams.end);
  if (resolvedSearchParams.q) dashboardParams.set("q", resolvedSearchParams.q);

  const returnHref = dashboardParams.toString()
    ? `/admin/dashboard?${dashboardParams.toString()}`
    : "/admin/dashboard";

  return (
    <section style={{ width: "100%", minHeight: "100vh", backgroundColor: "#111", paddingBottom: "50px" }}>
      <UserDashboard
        targetId={userId}
        isAdmin={true}
        initialStart={resolvedSearchParams.start}
        initialEnd={resolvedSearchParams.end}
        returnHref={returnHref}
      />
    </section>
  );
}
