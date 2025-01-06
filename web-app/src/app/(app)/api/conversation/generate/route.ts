import { NextRequest, NextResponse } from "next/server";
import { conversationGenerateResponse } from "@/lib/apis/conversation";
import { getSession } from "@/lib/auth";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const { message, chatId, customerId } = await req.json();

    const result = await conversationGenerateResponse({
      message,
      customerId,
      chatId,
      channel: "web",
    });
    if (!result) {
      throw new Error(`Generate failed`);
    }
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
