import { NextRequest, NextResponse } from "next/server";

const at = async (path: string, init?: RequestInit) => {
  const BASE = process.env.AIRTABLE_BASE_ID!;
  const API = `https://api.airtable.com/v0/${BASE}/${encodeURIComponent(path)}`;
  const res = await fetch(API, {
    ...(init || {}),
    headers: {
      'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    }
  });
  if (!res.ok) throw new Error(`Airtable ${res.status}: ${await res.text()}`);
  return res.json();
};

async function getRecord(table: string, id: string){
  const data = await at(`${table}/${id}`);
  return data;
}

async function patchRecord(table: string, id: string, fields: Record<string, any>){
  const body = JSON.stringify({ records: [{ id, fields }], typecast: true });
  const data = await at(table, { method: 'PATCH', body });
  return data.records?.[0];
}

async function notifyEmail(to: string, subject: string, html: string){
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/tools/notify/email`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, html })
  });
}

async function notifySlack(text: string){
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/tools/notify/slack`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
}

function h(str: any){ return (str ?? '').toString(); }

export async function POST(req: NextRequest){
  const payload = await req.json();
  const { eventType, table, recordId } = payload;
  if (!table || !recordId) return NextResponse.json({ ok:false, error:'Missing table or recordId' }, { status: 400 });

  const rec = await getRecord(table, recordId);
  const f: Record<string, any> = rec.fields || {};

  try {
    if (table === process.env.AIRTABLE_TBL_PROPOSALS && h(f['Approval Status']) === 'PENDING_SEAN'){
      const approver = process.env.APPROVER_EMAIL || 'sean@nex-a.com.au';
      const subj = `Approval needed — ${h(f['Title'])}`;
      const body = `<p>Proposal awaiting approval.</p><p><b>Title:</b> ${h(f['Title'])}</p><p><b>Scope:</b> ${h(f['Scope Summary']||'')}</p>`;
      await notifyEmail(approver, subj, body);
      await notifySlack(`🟡 Proposal pending approval: ${h(f['Title'])}`);
    }

    if (table === process.env.AIRTABLE_TBL_PROPOSALS && h(f['Approval Status']) === 'APPROVED'){
      await notifySlack(`✅ Proposal approved: ${h(f['Title'])}. Send to client + issue deposit invoice.`);
    }

    if (table === process.env.AIRTABLE_TBL_CONTRACTS && h(f['Status']) === 'SIGNED'){
      await notifySlack(`✍️ Contract signed (${h(f['Type'])}). Next: await payment or schedule.`);
    }

    if (table === process.env.AIRTABLE_TBL_INVOICES && h(f['Status']) === 'PAID'){
      const typ = h(f['Type']);
      if (typ === 'Discovery Prepay'){
        const discLink = (f['Discovery'] as any[]|undefined)?.[0]?.id;
        if (discLink){
          await patchRecord(process.env.AIRTABLE_TBL_DISCOVERIES!, discLink, { 'Status': 'SCHEDULED' });
          await notifySlack(`🗓️ Discovery prepay received. Status → SCHEDULED. PM to book session.`);
        } else {
          await notifySlack(`ℹ️ Discovery prepay paid but no linked Discovery found. Please link and schedule.`);
        }
      }
      if (typ === 'Deposit'){
        await notifySlack(`🚀 Deposit received. Kickoff project.`);
      }
    }

    if (table === process.env.AIRTABLE_TBL_ENQUIRIES && h(f['Status']) === 'ENQUIRY_CAPTURED'){
      const subj = `New enquiry — ${h(f['Subject'])}`;
      const body = `<p>${h(f['Body Snippet']||'')}</p>`;
      const sales = process.env.SALES_EMAIL || 'hello@nex-a.com.au';
      await notifyEmail(sales, subj, body);
      await notifySlack(`📥 New enquiry captured: ${h(f['Subject'])}`);
    }

    return NextResponse.json({ ok:true });
  } catch (e: any){
    return NextResponse.json({ ok:false, error: e.message }, { status: 500 });
  }
}
