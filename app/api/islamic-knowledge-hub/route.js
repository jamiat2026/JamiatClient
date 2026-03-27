import { dbConnect } from "../../../lib/dbConnect";
import IslamicKnowledgeHub from "../../../lib/models/islamicKnowledgeHub";
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
  const data = await IslamicKnowledgeHub.findOne({});
  return NextResponse.json(data || {}, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  let result;
  // If no document exists, create it. Otherwise, update it.
  const existingDoc = await IslamicKnowledgeHub.findOne({});
  
  if (existingDoc || body._id) {
    const id = existingDoc?._id || body._id;
    result = await IslamicKnowledgeHub.findByIdAndUpdate(
      id,
      {
        qaTitle: body.qaTitle,
        qaSubtitle: body.qaSubtitle,
        qaItems: body.qaItems,
        button2Text: body.button2Text,
        button2Url: body.button2Url,
        videoSectionTitle: body.videoSectionTitle,
        videoSectionSubtitle: body.videoSectionSubtitle,
        videoTitle: body.videoTitle,
        videoSubtitle: body.videoSubtitle,
        videoUrl: body.videoUrl,
      },
      { new: true, upsert: true }
    );
  } else {
    result = await IslamicKnowledgeHub.create(body);
  }

  return NextResponse.json(result, {
    status: 200,
    headers: corsHeaders,
  });
}
