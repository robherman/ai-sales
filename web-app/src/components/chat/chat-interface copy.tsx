"use client";

import { useState, useRef, useEffect, useCallback, FormEvent } from "react";
import { toast } from "sonner";
import Cog6ToothIcon from "@heroicons/react/24/outline/Cog6ToothIcon";
import InformationCircleIcon from "@heroicons/react/24/outline/InformationCircleIcon";
import { v4 as uuidv4 } from "uuid";
import ChatWindow from "./chat-window";
import ChatInput from "./chat-input";
import VoiceInput from "./voice-input";
import TypingIndicator from "./typing-indicator";
import ExportChat from "./export-chat";
import ClearChat from "./clear-chat";
import DeleteChat from "./delete-chat";
import { AppChat, ChatMessage } from "../../lib/types";
import { getCustomerInfo } from "../../lib/app/actions";
import {
  getChat,
  getChatHistoryById,
  getChatsAnalytcsById,
} from "../../lib/chat/actions";
import { CustomerInfo } from "./customer-info";
import { ChatInfo } from "./chat-info";

interface Props {
  chatData: AppChat;
  showIntermediateSteps?: boolean;
}

export default function ChatInterface({ chatData }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(chatData.messages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<AppChat>(chatData);
  const [chatAnalytics, setChatAnalytics] = useState<any | null>(null);
  const [customer, setCustomer] = useState<any | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchCustomerData = async () => {
    try {
      const response = await getCustomerInfo(chat.customerId!);
      setCustomer(response);
    } catch (err) {
      toast.error("Error al cargar los datos del cliente");
    }
  };

  const fetchChat = async () => {
    try {
      const response = await getChat(chat.id);
      if (!response) {
        throw new Error(`No chat`);
      }
      const history = await getChatHistoryById(chat.id);
      setChat(response);
      const filtered = history
        // ?.filter((m: ChatMessage) => ["human", "ai"].includes(m.role))
        ?.filter((m: ChatMessage) => !m.metadata?.hidden);
      setMessages(filtered || []);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar los datos del chat");
    }
  };

  const fetchChatStats = async () => {
    try {
      const response = await getChatsAnalytcsById(chat.id);
      setChatAnalytics(response);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar estadisticas");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleVoiceInput = (transcript: string) => {
    setInput(transcript);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      content: input.trim(),
      role: "human",
      metadata: {},
      createdAt: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/conversation/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: chat.id,
          customerId: chat.customerId,
          message: input,
        }),
      });

      if (!response) {
        throw new Error(`Failed generate response`);
      }
      const json = await response.json();
      // setMessages((prevMessages) => [
      //   ...prevMessages,
      //   {
      //     role: "assistant",
      //     content: json.aiResponse,
      //     id: uuidv4(),
      //     metadata: {},
      //     createdAt: new Date(),
      //   },
      // ]);
      fetchChat();
      fetchChatStats();
    } catch (error) {
      console.error(error);
      toast.error("Error al procesar el mensaje");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = useCallback(() => {
    fetchChat();
  }, []);

  const handleDeleteChat = useCallback(() => {}, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetchCustomerData();
    // fetchChat();
    fetchChatStats();
  }, []);

  return (
    <div className="flex h-full flex-1 flex-col">
      <header className="flex items-center justify-between bg-white p-4 shadow-md">
        <h2 className="text-xl font-semibold text-primary">
          {"Chatbot Ventas"}
        </h2>
        <h3 className="text-lg font-medium text-gray-600">{chat.title}</h3>
        <div className="flex items-center space-x-4">
          <button className="btn btn-circle btn-ghost btn-sm hover:bg-gray-100">
            <InformationCircleIcon className="h-6 w-6 text-gray-600" />
          </button>
          <ExportChat chatId={chat.id} />
          <ClearChat chatId={chat.id} onClear={handleClearChat} />
          <DeleteChat chatId={chat.id} onDelete={handleDeleteChat} />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
            <ChatWindow chatId={chat.id} messages={messages} />
            {isLoading && <TypingIndicator />}
            <div ref={chatEndRef} />
          </div>

          <div className="border-t bg-white p-4">
            <VoiceInput onTranscript={handleVoiceInput} />
            <ChatInput
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>

        <div className="w-80 overflow-y-auto border-l bg-white p-4">
          <CustomerInfo customer={customer} />
          {chat && <ChatInfo stats={chatAnalytics} />}
          {/* {chat && <SalesInfo chatbotState={chatbotState} />} */}
        </div>
      </div>
    </div>
  );
}
