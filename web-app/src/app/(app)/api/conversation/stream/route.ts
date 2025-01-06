import { NextRequest } from "next/server";
import { conversationStreamResponse } from "@/lib/apis/conversation";
import { getSession } from "@/lib/auth";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const session = await getSession();
  const data = await req.json();
  const lastMessage = data?.messages[data?.messages.length - 1].content;

  const result = await conversationStreamResponse(session?.token, {
    message: lastMessage || "",
    customerId: data?.customerId,
    chatId: data?.chatId,
    channel: "web",
  });

  const stream = new TransformStream();
  result?.body?.pipeTo(stream.writable);

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
