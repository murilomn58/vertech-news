import DashboardClient from "@/components/admin/DashboardClient";

export const metadata = { title: "Admin Dashboard" };
export const dynamic = "force-dynamic";

export default function AdminPage() {
  return <DashboardClient />;
}
