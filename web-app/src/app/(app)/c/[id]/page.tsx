import { notFound, redirect } from "next/navigation";
import { Session } from "@/lib/types";
import { getSession } from "@/lib/auth";
import { getChatById, getChatHistory } from "../../../../lib/apis/chats";
import ChatInterface from "../../../../components/chat/chat-interface";

export interface ChatPageProps {
  params: {
    id: string;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = (await getSession()) as Session;

  if (!session?.user) {
    redirect(`/login?next=/c/${params.id}`);
  }

  const userId = session.user.id as string;
  const chat = await getChatById(params.id);

  if (!chat) {
    redirect("/");
  }

  if (chat?.userId !== session?.user?.id) {
    notFound();
  }
  const history = await getChatHistory(params.id);

  return (
    <div className="flex h-screen flex-1 flex-col p-4">
      <ChatInterface chatData={{ ...chat, messages: history || [] }} />
    </div>
  );
}
