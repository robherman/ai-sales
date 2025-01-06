import { getSession } from "../../../lib/auth";
import { getChatById, getChatList } from "../../../lib/apis/chats";
import { redirect } from "next/navigation";
import { ChatContent } from "../../../components/chat-sessions/chat-content";
import { ChatSidebar } from "../../../components/chat-sessions/chat-sidebar";

interface Props {
  searchParams?: { [key: string]: string | string[] | undefined };
}
export default async function ChatSessionsPage({ searchParams }: Props) {
  const session = await getSession();
  if (!session?.token) {
    redirect(`/login?next=/chats`);
  }
  const chatId = searchParams?.chatId as string | undefined;
  const chats = await getChatList(session?.token, 1);
  let currentChat;
  if (chatId) {
    currentChat = await getChatById(chatId);
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 bg-white shadow-md">
        <ChatSidebar sessions={chats || []} selectedSessionId={chatId} />
      </div>
      <div className="ml-4 w-2/3 rounded-lg bg-white shadow-md">
        {currentChat ? (
          <ChatContent chat={currentChat} />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            Select a chat to view the conversation
          </div>
        )}
      </div>
    </div>
  );
}
