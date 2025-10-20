import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
  const payload = await req.json();
  return NextResponse.json({ ok: true, message: "Contract creation stub — integrate Acrobat Sign", payload }, { status: 202 });
}
