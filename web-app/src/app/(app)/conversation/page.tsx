import ConversationUI from "@/components/conversation/conversation";
import { initializateConversation } from "../../../lib/apis/conversation";
import { getSession } from "../../../lib/auth";
import { notFound, redirect } from "next/navigation";
import { DEFAULT_CHATBOT_ID, DEFAULT_COMPANY_ID } from "../../../lib/constants";
import { getChatById } from "../../../lib/apis/chats";

export default async function ConversationPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await getSession();
  if (!session?.token) {
    redirect(`/login?next=/`);
  }

  const customerId: string | null = searchParams
    ? (searchParams["customerId"] as string)
    : null;
  const chatId: string | null = searchParams
    ? (searchParams["chatId"] as string)
    : null;
  if (!customerId) {
    redirect("/");
  }

  const { chat } = await initializateConversation({
    customerId: customerId!,
    chatbotId: DEFAULT_CHATBOT_ID,
    companyId: DEFAULT_COMPANY_ID,
    channel: "web",
  });
  if (!chat) {
    redirect("/");
  }
  const chatDetails = await getChatById(chat.id);
  if (!chatDetails) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">AI Chatbot</h1>
      <ConversationUI
        chatId={chat.id}
        customerId={customerId!}
        initialMessages={chatDetails?.history || []}
      />
    </div>
  );
}
