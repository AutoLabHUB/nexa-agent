import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest){
  const { text } = await req.json();
  const hook = process.env.SLACK_WEBHOOK_URL;
  if (!hook) return NextResponse.json({ ok:false, error:'Missing SLACK_WEBHOOK_URL' }, { status: 500 });
  const res = await fetch(hook, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ text })});
  return NextResponse.json({ ok: res.ok });
}
