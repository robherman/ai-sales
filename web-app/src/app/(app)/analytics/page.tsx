import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ConversationAnalytics } from "../../../components/analytics/analytics";

export default async function AdminPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect(`/login?next=/admin`);
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Admin</h1>

      <ConversationAnalytics />
    </div>
  );
}
