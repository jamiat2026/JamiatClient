import { NextResponse } from "next/server";
import Category from "@/lib/models/Category";
import { dbConnect } from "@/lib/dbConnect";

import { corsHeaders } from "../../../layout";

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function GET() {
  await dbConnect();

  // fetch categories so that we can include ones with zero projects
  const categories = await Category.find().lean();

  // aggregate project counts by category name
  const Project = (await import("@/lib/models/Project")).default;
  const counts = await Project.aggregate([
    { $unwind: "$category" },
    { $group: { _id: "$category", count: { $sum: 1 } } }
  ]);

  const countMap = counts.reduce((acc, c) => {
    acc[c._id] = c.count;
    return acc;
  }, {});

  const result = {};
  categories.forEach(cat => {
    result[cat.name] = countMap[cat.name] || 0;
  });

  return NextResponse.json(result, { status: 200, headers: corsHeaders });
}