import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const session = await getSession();
  const data = await req.json();

  return NextResponse.json({ success: true });
}
