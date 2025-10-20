import { NextRequest, NextResponse } from "next/server";
import { create, findByField, upsertByEmail } from "../../../lib/airtable";
import { extractDomain, nowISO } from "../../../lib/utils";




const TBL_C = process.env.AIRTABLE_TBL_CONTACTS!;
const TBL_O = process.env.AIRTABLE_TBL_ORGS!;
const TBL_E = process.env.AIRTABLE_TBL_ENQUIRIES!;

export async function POST(req: NextRequest){
  const body = await req.json();
  const { name, email, phone, company, subject, body: msgBody, source = "Email", gmailThreadId } = body;

  const contactRec = await upsertByEmail(TBL_C, { name, email, phone });

  let orgId: string | undefined = undefined;
  if (company){
    const orgs = await findByField<any>(TBL_O, "Organization Name", company);
    if (orgs[0]) orgId = orgs[0].id;
    else orgId = (await create(TBL_O, { "Organization Name": company, "Domain": extractDomain(email) })).id;
  }

  const enquiry = await create(TBL_E, {
    "Subject": subject,
    "Body Snippet": (msgBody || "").slice(0, 2000),
    "Source": source,
    "Received At": nowISO(),
    "Contact": [contactRec.id],
    ...(orgId ? { "Organization": [orgId] } : {}),
    "Decision": "Undecided",
    "Status": "ENQUIRY_CAPTURED",
    ...(gmailThreadId ? { "Gmail Thread ID": gmailThreadId } : {})
  });

  return NextResponse.json({ ok: true, enquiryId: enquiry.id, contactId: contactRec.id, orgId });
}
