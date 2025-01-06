import { notFound, redirect } from "next/navigation";
import { Chatbot, Session } from "@/lib/types";
import { getSession } from "@/lib/auth";
import { ChatbotDetails } from "../../../../components/chatbots/chatbot";
import { getChatbot } from "../../../../lib/apis/chatbot";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ChatbotDetailPage({ params }: PageProps) {
  const session = (await getSession()) as Session;

  if (!session?.user) {
    redirect(`/login?next=/chatbots/${params.id}`);
  }

  const chatbot: Chatbot = await getChatbot(params?.id);
  if (!chatbot) {
    notFound();
  }

  return (
    <div className="flex h-full flex-col p-4">
      <h1 className="mb-4 text-2xl font-bold">{`Chatbot Details`}</h1>
      <ChatbotDetails chatbotData={chatbot} />
    </div>
  );
}
