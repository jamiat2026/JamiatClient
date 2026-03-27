import { dbConnect } from "../../../lib/dbConnect";
import { NextResponse } from "next/server";
import AboutLeadershipSection from "@/lib/models/aboutleadershipsection";

import { corsHeaders } from '../../layout';

// CORS preflight handler
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
}

// GET the single leadership section (singleton)
export async function GET() {
  await dbConnect();
  const data = await AboutLeadershipSection.findOne({});
  return NextResponse.json(data || { title: "Leadership", subtitle: "Meet the dedicated individuals guiding our mission forward.", members: [] }, {
    status: 200,
    headers: corsHeaders
  });
}

// UPSERT the single leadership section
export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const updated = await AboutLeadershipSection.findOneAndUpdate({}, body, {
    new: true,
    upsert: true,
  });
  return NextResponse.json(updated, {
    status: 200,
    headers: corsHeaders
  });
}

// DELETE the single leadership section
export async function DELETE() {
  await dbConnect();
  await AboutLeadershipSection.deleteMany({});
  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: corsHeaders
    }
  );
}
