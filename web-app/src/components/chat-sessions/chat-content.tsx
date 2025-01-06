import { AppChat, ChatMessage } from "@/lib/types";

interface ChatContentProps {
  chat: AppChat;
}

export function ChatContent({ chat }: ChatContentProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b bg-gray-100 p-4">
        <h2 className="text-xl font-semibold">{chat.title}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {chat.messages.map((message: ChatMessage, index: number) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === "human" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block rounded-lg p-2 ${
                message.role === "human"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {message.content}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {new Date(message.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-4">
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full rounded-full border p-2"
        />
      </div>
    </div>
  );
}
