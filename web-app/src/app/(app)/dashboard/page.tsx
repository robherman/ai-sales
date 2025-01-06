import { getSession } from "@/lib/auth";
import AppDashboard from "@/components/dashboard/app-dashboard";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect(`/login?next=/admin`);
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      <AppDashboard />
    </div>
  );
}
