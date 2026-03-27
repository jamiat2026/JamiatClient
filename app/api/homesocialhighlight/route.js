import { dbConnect } from "../../../lib/dbConnect";
import HomeSocialHighlight from "../../../lib/models/homesocialhighlight";
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
  const data = await HomeSocialHighlight.findOne({});
  return NextResponse.json(data, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  // Singleton pattern: remove existing and create new
  await HomeSocialHighlight.deleteMany({});
  const created = await HomeSocialHighlight.create(body);
  return NextResponse.json(created, {
    status: 200,
    headers: corsHeaders,
  });
}
