import { Message, ToolInvocation as AiToolInvocation } from "ai";

interface ToolInvocationProps {
  message: Message;
  addToolResult: any;
}

export function ToolInvocation({
  message,
  addToolResult,
}: ToolInvocationProps) {
  return (
    <>
      <div className="">
        {message.toolInvocations?.map((toolInvocation: AiToolInvocation) => {
          const toolCallId = toolInvocation.toolCallId;

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
                          addToolResult({
                            toolCallId,
                            result: "Yes, confirmed.",
                          })
                        }
                      >
                        Yes
                      </button>
                      <button
                        className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
                        onClick={() =>
                          addToolResult({
                            toolCallId,
                            result: "No, denied",
                          })
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

          // other tools:
          return "result" in toolInvocation ? (
            toolInvocation.toolName === "getProductCatalog" ? (
              <div
                key={toolCallId}
                className="flex flex-col gap-2 rounded-lg bg-blue-400 p-4"
              >
                <div className="flex flex-row items-center justify-between">
                  <div className="text-4xl font-medium text-blue-50">
                    {toolInvocation.result.value}°
                    {toolInvocation.result.unit === "celsius" ? "C" : "F"}
                  </div>

                  <div className="h-9 w-9 flex-shrink-0 rounded-full bg-amber-400" />
                </div>
                <div className="flex flex-row justify-between gap-2 text-blue-50">
                  {toolInvocation.result.weeklyForecast.map((forecast: any) => (
                    <div
                      key={forecast.day}
                      className="flex flex-col items-center"
                    >
                      <div className="text-xs">{forecast.day}</div>
                      <div>{forecast.value}°</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : toolInvocation.toolName === "getProductsRecommendations" ? (
              <div
                key={toolCallId}
                className="rounded-lg bg-gray-100 p-4 text-gray-500"
              >
                Recommendations: {toolInvocation.result}.
              </div>
            ) : toolInvocation.toolName === "getLocation" ? (
              <div
                key={toolCallId}
                className="rounded-lg bg-gray-100 p-4 text-gray-500"
              >
                User is in {toolInvocation.result}.
              </div>
            ) : (
              <div key={toolCallId} className="text-gray-500">
                Tool call {`${toolInvocation.toolName}: `}
                {toolInvocation.result}
              </div>
            )
          ) : (
            <div key={toolCallId} className="text-gray-500">
              Calling {toolInvocation.toolName}...
            </div>
          );
        })}
      </div>
    </>
  );
}
