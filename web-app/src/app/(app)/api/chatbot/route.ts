import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/auth";

export const maxDuration = 30;

export interface StreamResponse {
  response: string;
}

export async function GET(req: NextRequest) {
  try {
    console.log(`API Chatbot STREAM...`);

    const session = await getSession();
    const searchParams = req.nextUrl.searchParams;
    const chatId = searchParams.get("c");
    const response: any = null;

    if (!response?.ok || !response?.body) {
      return NextResponse.json(
        { error: "server error", response: response?.body },
        { status: 500 },
      );
    }

    const rStream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            const lines = chunk.split("\n");
            for (const line of lines) {
              if (line.startsWith("data:")) {
                const data = line.slice(6);
                if (data !== "") {
                  controller.enqueue(data);
                } else {
                  controller.enqueue(`\n\n`);
                }
              }
            }
          }
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(rStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
