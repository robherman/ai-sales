"use client";

import { Message, ToolInvocation as AiToolInvocation } from "ai";
import { cx } from "class-variance-authority";
import { ProductListToolCall, ProductListToolResult } from "../tools/products";
import {
  RecommendationsToolCall,
  RecommendationsToolResult,
} from "../tools/recommendations";

interface ToolInvocationProps {
  message: Message;
}

export function ToolInvocation({ message }: ToolInvocationProps) {
  return (
    <>
      {message.toolInvocations && message.toolInvocations.length > 0 && (
        <div className="flex flex-col gap-4">
          {message.toolInvocations?.map((toolInvocation: AiToolInvocation) => {
            const { toolName, toolCallId, state, args } = toolInvocation;

            // render confirmation tool (client-side tool with user interaction)
            if (toolInvocation.toolName === "askForConfirmation") {
              return (
                <div
                  key={toolCallId}
                  className="flex flex-col gap-2 text-gray-500"
                >
                  {toolInvocation.args.message}
                  <div className="flex gap-2">
                    {"result" in toolInvocation ? (
                      <b>{toolInvocation.result}</b>
                    ) : (
                      <>
                        <button
                          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                          onClick={() =>
                            // addToolResult({
                            //   toolCallId,
                            //   result: "Yes, confirmed.",
                            // })
                            {}
                          }
                        >
                          Yes
                        </button>
                        <button
                          className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
                          onClick={() =>
                            // addToolResult({
                            //   toolCallId,
                            //   result: "No, denied",
                            // })
                            {}
                          }
                        >
                          No
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            }

            if (state === "result") {
              const { result } = toolInvocation;

              return (
                <div key={toolCallId}>
                  {toolName === "searchProducts" ? (
                    <ProductListToolResult result={result} />
                  ) : toolName === "recommendProducts" ? (
                    <RecommendationsToolResult result={result} />
                  ) : (
                    <pre>{`Usando herramienta: ${toolInvocation.toolName}`}</pre>
                  )}
                </div>
              );
            } else {
              return (
                <div
                  key={toolCallId}
                  className={cx({
                    skeleton: ["getWeather"].includes(toolName),
                  })}
                >
                  {toolName === "searchProducts" ? (
                    <ProductListToolCall args={args} />
                  ) : toolName === "recommendProducts" ? (
                    <RecommendationsToolCall args={args} />
                  ) : null}
                </div>
              );
            }
          })}
        </div>
      )}
    </>
  );
}
