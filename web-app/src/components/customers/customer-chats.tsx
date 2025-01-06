import { getChatsByCustomer } from "../../lib/apis/chats";
import { getSession } from "../../lib/auth";
import { AppChat, Session } from "../../lib/types";

export async function CustomerChats({ customerId }: { customerId: string }) {
  const session = (await getSession()) as Session;
  const chats = await getChatsByCustomer(session.token!, customerId);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Recent Chats</h2>
        <ul className="space-y-2">
          {chats?.map((chat: AppChat) => (
            <li key={chat.id} className="flex justify-between">
              <span>{chat.title}</span>
              <span>{new Date(chat.createdAt).toDateString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
