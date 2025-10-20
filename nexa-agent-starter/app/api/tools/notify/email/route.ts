import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest){
  const { to, subject, html } = await req.json();
  if (!to) return NextResponse.json({ ok:false, error:'Missing to' }, { status: 400 });
  console.log('EMAIL →', { to, subject, html: (html||'').slice(0,200) + '…' });
  return NextResponse.json({ ok:true });
}
