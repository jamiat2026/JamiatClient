import { dbConnect } from "../../../lib/dbConnect";
import IslamicTools from "../../../lib/models/islamicTools";
import { NextResponse } from "next/server";

import { corsHeaders } from "../../layout";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET() {
  await dbConnect();
  const data = await IslamicTools.findOne({}).sort({ createdAt: -1 });
  return NextResponse.json(data, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  await IslamicTools.deleteMany({});
  const created = await IslamicTools.create(body);
  return NextResponse.json(created, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function DELETE() {
  await dbConnect();
  await IslamicTools.deleteMany({});
  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: corsHeaders,
    }
  );
}
