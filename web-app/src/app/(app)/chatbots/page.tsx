import { redirect } from "next/navigation";
import { getChatbots } from "../../../lib/apis/chatbot";
import { getSession } from "../../../lib/auth";
import Link from "next/link";
import TitleCard from "../../../components/ui/card/title-card";

export default async function ChatbotPage() {
  const session = await getSession();
  if (!session?.token) {
    redirect("/login");
  }
  const chatbots = await getChatbots();

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Chatbots</h1>
      <div className="p-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {chatbots.map((a: any, k: number) => {
            return (
              <TitleCard key={k} title={a.name} topMargin={"mt-2"}>
                <Link href={`/chatbots/${a.id}`} className="flex">
                  {a.name}
                </Link>
                <div className="mt-6 text-right"></div>
              </TitleCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
