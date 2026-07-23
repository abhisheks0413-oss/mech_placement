import { redirect } from "next/navigation";
import { getAdminFromCookies } from "@/lib/auth";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default async function AdminPage() {
  const admin = await getAdminFromCookies();
  if (!admin) redirect("/admin/login");
  return <AdminDashboard />;
}
