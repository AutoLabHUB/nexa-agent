import { NextRequest, NextResponse } from "next/server";
import { create, update } from "@/lib/airtable";

const TBL_P = process.env.AIRTABLE_TBL_PROPOSALS!;

export async function POST(req: NextRequest){
  const data = await req.json();
  if (data.id){
    const rec = await update(TBL_P, data.id, {
      "Title": data.title,
      "Scope Summary": data.scopeSummary,
      "Payment Schedule": data.paymentSchedule,
      "Approval Status": data.approvalStatus || "DRAFT"
    });
    return NextResponse.json({ id: rec.id });
  }
  const rec = await create(TBL_P, {
    "Enquiry": [data.enquiryId],
    "Title": data.title,
    "Scope Summary": data.scopeSummary,
    "Payment Schedule": data.paymentSchedule,
    "Approval Status": "PENDING_SEAN"
  });
  return NextResponse.json({ id: rec.id });
}
