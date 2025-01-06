"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useChat } from "ai/react";
import { Attachment } from "ai";
import { useAuth } from "@/lib/providers/auth-context";
import { clearChat } from "../../lib/chat/actions";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";
import { ChatControls } from "./chat-controls";

const AI_MODELS = ["gpt-3.5-turbo", "gpt-4", "claude-v1"];

interface Props {
  chatId: string;
  customerId: string;
  title?: string;
  showIntermediateSteps?: boolean;
  initialMessages?: any[];
  apiUrl?: string;
}

export default function ConversationUI({
  chatId,
  customerId,
  initialMessages,
  apiUrl = "/api/conversation/stream",
}: Props) {
  const {
    messages,
    setMessages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
    error,
    reload,
    stop,
    addToolResult,
  } = useChat({
    api: apiUrl,
    body: { chatId, customerId },
    maxSteps: 5,
    initialMessages: initialMessages,

    onFinish: (data: any) => {
      window.history.replaceState(
        {},
        "",
        `/conversation?customerId=${customerId}&chatId=${chatId}`,
      );
    },
  });

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleClearChat = useCallback(async () => {
    await clearChat(chatId);
    setMessages([]);
  }, [setMessages]);

  const handleExportChat = useCallback(() => {
    const exportData = JSON.stringify(messages, null, 2);
    const blob = new Blob([exportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chat_export.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [messages]);

  const handleReact = useCallback(
    (messageId: string, reaction: string) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, reaction } : msg,
        ),
      );
    },
    [setMessages],
  );

  const handleFileUpload = useCallback(
    (file: File) => {
      // Here you would typically upload the file to your server or cloud storage
      // and get a URL or reference to the uploaded file
      console.log("File uploaded:", file.name);
      // For this example, we'll just add a message with the file name
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now().toString(),
          role: "user",
          content: `Uploaded file: ${file.name}`,
        },
      ]);
    },
    [setMessages],
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col overflow-hidden rounded-lg bg-base-200 shadow-xl">
      <div className="flex items-center justify-between bg-primary p-4 text-primary-content">
        <h1 className="text-2xl font-bold">AI Chatbot</h1>
        <button onClick={toggleTheme} className="btn btn-circle btn-ghost">
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
      <div className="flex-grow overflow-auto p-4">
        <MessageList
          messages={messages}
          isLoading={isLoading}
          error={error || null}
          messagesEndRef={messagesEndRef}
          onReact={handleReact}
          addToolResult={addToolResult}
        />
      </div>
      <div className="border-t border-base-300 bg-base-100 p-4">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleFileUpload={handleFileUpload}
          isLoading={isLoading}
          suggestions={[]}
        />
        <ChatControls
          reload={reload}
          stop={stop}
          clearChat={handleClearChat}
          exportChat={handleExportChat}
          isLoading={isLoading}
          models={AI_MODELS}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />
      </div>
    </div>
  );
}
