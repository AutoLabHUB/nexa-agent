import { NextRequest, NextResponse } from "next/server";
import { create } from "../../../lib/airtable";



const TBL_D = process.env.AIRTABLE_TBL_DISCOVERIES!;

export async function POST(req: NextRequest){
  const { enquiryId, hours = 3, rate = 150 } = await req.json();
  const rec = await create(TBL_D, {
    "Enquiry": [enquiryId],
    "Hours (min 3)": hours,
    "Rate": rate,
    "Status": "INVOICE_PENDING"
  });
  return NextResponse.json({ id: rec.id });
}
