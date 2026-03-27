import { dbConnect } from "../../../../lib/dbConnect";
import EmergencyFund from "../../../../lib/models/emergencyfund";
import { NextResponse } from "next/server";
import { corsHeaders } from "../../../layout";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET() {
  try {
    await dbConnect();
    const data = await EmergencyFund.findOne({}, "isActive").lean();

    return NextResponse.json({ isActive: data ? data.isActive : true }, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("GET /api/emergency-fund/toggle error:", error);
    return NextResponse.json(
      { error: "Failed to fetch toggle status" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { isActive } = body;

    const updated = await EmergencyFund.findOneAndUpdate(
      {},
      { $set: { isActive } },
      { new: true, upsert: true, select: "isActive" }
    );

    return NextResponse.json(updated, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("POST /api/emergency-fund/toggle error:", err);
    return NextResponse.json(
      { error: "Failed to update toggle status" },
      { status: 500, headers: corsHeaders }
    );
  }
}
