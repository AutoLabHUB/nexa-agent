import { NextRequest, NextResponse } from "next/server";
import { update } from "../../../../../lib/airtable";



const TBL_P = process.env.AIRTABLE_TBL_PROPOSALS!;

export async function POST(_: NextRequest, { params }: { params: { id: string } }){
  const rec = await update(TBL_P, params.id, { "Approval Status": "APPROVED" });
  return NextResponse.json({ id: rec.id, status: "APPROVED" });
}
