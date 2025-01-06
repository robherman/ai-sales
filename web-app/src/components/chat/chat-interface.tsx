"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import ChatWindow from "./chat-window";
import ChatInput from "./chat-input";
import VoiceInput from "./voice-input";
import TypingIndicator from "./typing-indicator";
import ExportChat from "./export-chat";
import ClearChat from "./clear-chat";
import DeleteChat from "./delete-chat";
import { AppChat, ChatMessage, Order } from "../../lib/types";
import { getCustomerInfo, getCustomerLastOrders } from "../../lib/app/actions";
import {
  getChat,
  getChatHistoryById,
  getChatsAnalytcsById,
} from "../../lib/chat/actions";
import { CustomerInfo } from "./customer-info";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  InformationCircleIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  LightBulbIcon,
  ArrowPathIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { TabButton } from "./tab-button";
import { ChatContext } from "./chat-context";
import ConversationAnalytics from "./conversation-analytics";
import ConversationFlow from "./conversation-flow";
import SalesAIInsights from "./sales-insights";
import { ChatShoppingCart } from "./chat-shopping-cart";
import LoadingSpinner from "../loading-spinner";

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
  const [aiInsights, setAiInsights] = useState<any | null>(null);
  const [conversationFlow, setConversationFlow] = useState<any | null>(null);
  const [customer, setCustomer] = useState<any | null>(null);
  const [customerLastOrder, setCustomerLastOrder] = useState<Order | null>(
    null,
  );
  const [shoppingCartId, setShoppingCartId] = useState<string | null>(
    chatData.context?.shoppingCart?.id,
  );
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("context");

  const fetchCustomerData = async () => {
    try {
      const response = await getCustomerInfo(chat.customerId!);
      const lastOrders = await getCustomerLastOrders(chat.customerId!);
      setCustomer(response);
      setCustomerLastOrder(lastOrders?.length > 0 ? lastOrders[0] : null);
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
      setShoppingCartId(response.context?.shoppingCart?.id);
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
    fetchChatStats();
  }, []);

  return (
    <div className="flex h-full">
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Chat header */}
        <header className="z-10 bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-lg font-semibold text-gray-900">
              Chat con {customer?.fullContactName}
            </h1>
          </div>
        </header>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <ChatWindow chatId={chatData.id} messages={messages} />
          {isLoading && <TypingIndicator />}
          <div ref={chatEndRef} />
        </div>

        {/* Chat input */}
        <div className="border-t bg-white p-4">
          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
          <VoiceInput onTranscript={handleVoiceInput} />
        </div>

        {/* Chat actions */}
        <div className="flex justify-end space-x-2 p-2">
          <ExportChat chatId={chat.id} />
          <ClearChat onClear={handleClearChat} chatId={chat.id} />
          <DeleteChat onDelete={handleDeleteChat} chatId={chat.id} />
        </div>
      </div>

      {/* Collapsible Sidebar */}
      <div
        className={`w-80 bg-white shadow-lg transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Chat</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="space-y-4">
            <TabButton
              icon={<InformationCircleIcon className="h-5 w-5" />}
              label="Contexto"
              active={activeTab === "context"}
              onClick={() => setActiveTab("context")}
            />
            <TabButton
              icon={<UserIcon className="h-5 w-5" />}
              label="Cliente"
              active={activeTab === "lastOrder"}
              onClick={() => setActiveTab("lastOrder")}
            />
            <TabButton
              icon={<ChartBarIcon className="h-5 w-5" />}
              label="Métricas"
              active={activeTab === "analytics"}
              onClick={() => setActiveTab("analytics")}
            />
            <TabButton
              icon={<LightBulbIcon className="h-5 w-5" />}
              label="AI Insights"
              active={activeTab === "aiInsights"}
              onClick={() => setActiveTab("aiInsights")}
            />
            <TabButton
              icon={<ArrowPathIcon className="h-5 w-5" />}
              label="Flujo Ventas"
              active={activeTab === "flow"}
              onClick={() => setActiveTab("flow")}
            />
            <TabButton
              icon={<ShoppingCartIcon className="h-5 w-5" />}
              label="Carrito"
              active={activeTab === "shoppingCart"}
              onClick={() => setActiveTab("shoppingCart")}
            />
          </div>
        </div>
        <div className="border-t p-4">
          {activeTab === "context" && <ChatContext context={chat.context} />}
          {activeTab === "lastOrder" && (
            <CustomerInfo customer={customer} lastOrder={customerLastOrder} />
          )}
          {activeTab === "analytics" && (
            <ConversationAnalytics analytics={chatAnalytics} />
          )}
          {activeTab === "aiInsights" && (
            <SalesAIInsights insights={aiInsights} />
          )}
          {activeTab === "flow" && <ConversationFlow flow={conversationFlow} />}
          {activeTab === "shoppingCart" && (
            <Suspense fallback={<LoadingSpinner />}>
              <ChatShoppingCart id={shoppingCartId} />
            </Suspense>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="hover:bg-primary-dark fixed bottom-4 right-4 rounded-full bg-primary p-3 text-white shadow-lg transition-colors duration-200"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
