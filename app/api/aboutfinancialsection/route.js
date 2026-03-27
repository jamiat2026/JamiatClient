import { dbConnect } from "../../../lib/dbConnect";
import { NextResponse } from "next/server";
import AboutFinancialSection from "@/lib/models/aboutfinancialsection";
import { corsHeaders } from '../../layout';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
}

export async function GET() {
  await dbConnect();
  const data = await AboutFinancialSection.findOne({});
  return NextResponse.json(data, {
    status: 200,
    headers: corsHeaders
  });
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const updated = await AboutFinancialSection.findOneAndUpdate({}, body, {
    new: true,
    upsert: true,
  });
  return NextResponse.json(updated, {
    status: 200,
    headers: corsHeaders
  });
}

export async function DELETE() {
  await dbConnect();
  await AboutFinancialSection.deleteMany({});
  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: corsHeaders
    }
  );
}
