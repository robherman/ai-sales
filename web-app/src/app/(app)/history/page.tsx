import Link from "next/link";
import DeleteChat from "../../../components/chat/delete-chat";
import ClearChat from "../../../components/chat/clear-chat";
import { getSession } from "../../../lib/auth";
import { getAllChats } from "../../../lib/apis/chats";
import { AppChat } from "../../../lib/types";

export default async function HistoryPage() {
  const session = await getSession();

  const chats = await getAllChats(session?.token!);

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Chats</h1>
      <ul className="space-y-2">
        {chats?.map((session: AppChat) => (
          <li key={session.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{session.title}</h2>
              <p>{session.lastMessage?.content}</p>
              <p className="text-sm">{session.createdAt.toString()}</p>
              <div className="card-actions justify-end">
                <Link href={`/c/${session.id}`} className="btn btn-primary">
                  Ir al chat
                </Link>
                <ClearChat chatId={session.id} />
                <DeleteChat chatId={session.id} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
