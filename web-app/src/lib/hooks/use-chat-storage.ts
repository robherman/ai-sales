import { useState, useEffect } from "react";
import { Message } from "ai";

export function useChatPersistence(chatId: string) {
  const [persistedMessages, setPersistedMessages] = useState<Message[]>([]);

  useEffect(() => {
    const storedMessages = localStorage.getItem(`chat_${chatId}`);
    if (storedMessages) {
      setPersistedMessages(JSON.parse(storedMessages));
    }
  }, [chatId]);

  const persistMessages = (messages: Message[]) => {
    localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
    setPersistedMessages(messages);
  };

  return { persistedMessages, persistMessages };
}
