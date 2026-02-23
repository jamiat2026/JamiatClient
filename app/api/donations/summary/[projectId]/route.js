import { dbConnect } from '../../../../../lib/dbConnect'
import Donation from '../../../../../lib/models/donation'
import mongoose from 'mongoose'

import { corsHeaders } from '../../../../layout'

// CORS Preflight
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET(_req, { params }) {
  await dbConnect();

  const { projectId } = (await params) || {};

  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid projectId" }),
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const summary = await Donation.aggregate([
      { $match: { projectId: new mongoose.Types.ObjectId(projectId) } },
      {
        $group: {
          _id: "$projectId",
          totalCollected: { $sum: "$amount" },
          totalDonors: { $addToSet: "$email" }
        }
      },
      {
        $project: {
          _id: 0,
          projectId: "$_id",
          totalCollected: 1,
          totalDonors: { $size: "$totalDonors" }
        }
      }
    ]);

    const result = summary[0] || {
      projectId,
      totalCollected: 0,
      totalDonors: 0
    };

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to get project summary" }),
      { status: 500, headers: corsHeaders }
    );
  }
}
