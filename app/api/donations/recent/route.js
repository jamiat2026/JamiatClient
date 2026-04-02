import { dbConnect } from "../../../../lib/dbConnect";
import Donation from "../../../../lib/models/donation";
import "@/lib/models/Project"; // Ensure Project model is registered if we populate it
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
    
    // Find only the top 1 recent donation 
    // and populate the project details for convenience
    const recentDonation = await Donation.findOne()
      .populate("projectId", "title")
      .sort({ createdAt: -1 })
      .lean();

    // Return the single donation object
    return NextResponse.json(recentDonation || null, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("GET /api/donations/recent error:", error);
    return NextResponse.json(
      { error: "Failed to fetch top recent donation" },
      { status: 500, headers: corsHeaders }
    );
  }
}
