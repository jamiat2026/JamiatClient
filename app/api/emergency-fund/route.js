import { dbConnect } from "../../../lib/dbConnect";
import EmergencyFund from "../../../lib/models/emergencyfund";
import Project from "../../../lib/models/Project";
import Donation from "../../../lib/models/donation";
import { NextResponse } from "next/server";
import { corsHeaders } from '../../layout';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET() {
  try {
    await dbConnect();
    // Populate the linked projects so the client has full project data (title, collected amount, etc.)
    const data = await EmergencyFund.findOne({})
      .populate({ path: "linkedProjects", strictPopulate: false })
      .lean();
      
    if (data && data.linkedProjects && data.linkedProjects.length > 0) {
      // Extract array of project IDs from linkedProjects
      const projectIds = data.linkedProjects.map(p => p._id || p);
      
      // Fetch recent donations for these projects
      const recentDonors = await Donation.find({ projectId: { $in: projectIds } })
        .sort({ createdAt: -1 }) // get the newest first
        .limit(3) // limited to 3 recent donors
        .select("name amount createdAt dedicatedTo message")
        .lean();
        
      data.recentDonors = recentDonors;
    }

    return NextResponse.json(data, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("GET /api/emergency-fund error:", error);
    return NextResponse.json(
      { error: "Failed to fetch emergency fund data" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const updated = await EmergencyFund.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
    });

    return NextResponse.json(updated, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("POST /api/emergency-fund error:", err);
    return NextResponse.json(
      { error: "Failed to save emergency fund data" },
      { status: 500, headers: corsHeaders }
    );
  }
}
