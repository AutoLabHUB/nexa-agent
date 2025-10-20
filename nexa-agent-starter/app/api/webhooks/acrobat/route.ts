import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
  const event = await req.json();
  return NextResponse.json({ received: true });
}
