import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { StreamData, streamText, tool } from "ai";
import { getCustomerById } from "../../../../lib/apis/customers";
import { getOrdersByCustomer } from "../../../../lib/apis/orders";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const dto = await req.json();
    const { messages, chatId, customerId } = dto;
    // const streamingData = new StreamData();

    return new Response();
  } catch (e: any) {
    console.error(`Chat failed`, e);
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
