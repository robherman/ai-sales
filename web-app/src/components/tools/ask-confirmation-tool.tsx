"use client";

export const AskConfirmationTool = ({
  toolCallId,
  toolInvocation,
  addToolResult,
}: any) => {
  return (
    <div key={toolCallId} className="flex flex-col gap-2 text-gray-500">
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
};
