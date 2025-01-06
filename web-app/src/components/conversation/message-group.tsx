"use client";

import { Message } from "ai";
import { MessageReaction } from "./message-reaction";
import { ToolInvocation } from "./tool-invocation";

interface MessageGroupProps {
  messages: Message[];
  onReact: (messageId: string, reaction: string) => void;
  addToolResult: any;
}
export function MessageGroup({
  messages,
  onReact,
  addToolResult,
}: MessageGroupProps) {
  return (
    <>
      {messages.map((message, index) => {
        const isUser = message.role === "user";
        return (
          <div
            key={message.id}
            className={`chat ${isUser ? "chat-end" : "chat-start"}`}
          >
            <div className="avatar chat-image">
              <div className="w-10 rounded-full">
                {isUser ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M16.5 7.5h-9v9h9v-9z" />
                    <path
                      fillRule="evenodd"
                      d="M8.25 2.25A.75.75 0 019 3v.75h2.25V3a.75.75 0 011.5 0v.75H15V3a.75.75 0 011.5 0v.75h.75a3 3 0 013 3v.75H21A.75.75 0 0121 9h-.75v2.25H21a.75.75 0 010 1.5h-.75V15H21a.75.75 0 010 1.5h-.75v.75a3 3 0 01-3 3h-.75V21a.75.75 0 01-1.5 0v-.75h-2.25V21a.75.75 0 01-1.5 0v-.75H9V21a.75.75 0 01-1.5 0v-.75h-.75a3 3 0 01-3-3v-.75H3A.75.75 0 013 15h.75v-2.25H3a.75.75 0 010-1.5h.75V9H3a.75.75 0 010-1.5h.75v-.75a3 3 0 013-3h.75V3a.75.75 0 01.75-.75zM6 6.75A.75.75 0 016.75 6h10.5a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V6.75z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
            <div
              className={`chat-bubble ${isUser ? "chat-bubble-primary" : "chat-bubble-secondary"}`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              {/* {message.content && (
                <div className="flex flex-col gap-4">
                  <Markdown>{message.content as string}</Markdown>
                </div>
              )} */}

              {/* <ToolInvocation message={message} /> */}
            </div>
            <div className="chat-footer text-xs opacity-50">
              {/* {new Date(message.createdAt || Date.now()).toLocaleTimeString()} */}
            </div>
            <MessageReaction messageId={message.id} onReact={onReact} />
          </div>
        );
      })}
    </>
  );
}
