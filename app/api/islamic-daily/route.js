import { dbConnect } from "../../../lib/dbConnect";
import IslamicDaily from "../../../lib/models/islamicDaily";
import { NextResponse } from "next/server";

import { corsHeaders } from "../../layout";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// GET — return ALL cards, sorted newest first
export async function GET() {
  await dbConnect();
  const data = await IslamicDaily.find({}).sort({ createdAt: -1 });
  return NextResponse.json(data, {
    status: 200,
    headers: corsHeaders,
  });
}

// POST — create a new card OR update an existing one (if body._id is present)
export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  let result;
  if (body._id) {
    // Update existing card
    result = await IslamicDaily.findByIdAndUpdate(
      body._id,
      {
        dailyHadith: body.dailyHadith,
        quranicVerse: body.quranicVerse,
        dailyQuote: body.dailyQuote,
      },
      { new: true }
    );
  } else {
    // Create new card
    result = await IslamicDaily.create({
      dailyHadith: body.dailyHadith,
      quranicVerse: body.quranicVerse,
      dailyQuote: body.dailyQuote,
    });
  }

  return NextResponse.json(result, {
    status: 200,
    headers: corsHeaders,
  });
}

// DELETE — delete a specific card by id (passed as query param)
export async function DELETE(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    await IslamicDaily.findByIdAndDelete(id);
  } else {
    // Fallback: delete all
    await IslamicDaily.deleteMany({});
  }

  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: corsHeaders,
    }
  );
}
