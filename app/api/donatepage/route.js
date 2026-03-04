import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import DonatePage from "@/lib/models/donatepage";

import { corsHeaders } from "../../layout";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET() {
  await dbConnect();

  let data = await DonatePage.findOne({});
  if (!data) {
    data = await DonatePage.create({});
  }

  return NextResponse.json(data, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  const updated = await DonatePage.findOneAndUpdate({}, body, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });

  return NextResponse.json(updated, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function DELETE() {
  await dbConnect();
  await DonatePage.deleteMany({});

  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: corsHeaders,
    }
  );
}
