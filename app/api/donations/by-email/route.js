import { dbConnect } from "@/lib/dbConnect";
import Donation from "@/lib/models/donation";
import "@/lib/models/Project";
import { corsHeaders } from "../../../layout";

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

function normalizeEmail(email) {
  if (!email || typeof email !== "string") return "";
  return email.trim().toLowerCase();
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function handleRequest(email) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    return new Response(JSON.stringify({ message: "Email is required" }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  await dbConnect();

  const donations = await Donation.find({
    email: new RegExp(`^${escapeRegex(normalizedEmail)}$`, "i"),
  })
    .populate("projectId", "title")
    .sort({ createdAt: -1 });

  const donationItems = donations.map((donation) => {
    const projectTitle = donation.projectId?.title || "General Donation";
    return {
      _id: donation._id,
      amount: donation.amount,
      donationType: donation.donationType,
      donationFrequency: donation.donationFrequency,
      paymentId: donation.paymentId,
      projectId: donation.projectId?._id || null,
      projectTitle,
      createdAt: donation.createdAt,
    };
  });

  const projectMap = new Map();
  let totalAmount = 0;

  for (const item of donationItems) {
    totalAmount += item.amount || 0;
    const key = item.projectId ? item.projectId.toString() : "general";
    const existing = projectMap.get(key);
    if (existing) {
      existing.amount += item.amount || 0;
      existing.donationsCount += 1;
    } else {
      projectMap.set(key, {
        projectId: item.projectId,
        projectTitle: item.projectTitle,
        amount: item.amount || 0,
        donationsCount: 1,
      });
    }
  }

  return new Response(
    JSON.stringify({
      email: normalizedEmail,
      totalDonations: donationItems.length,
      totalAmount,
      donations: donationItems,
      projects: Array.from(projectMap.values()),
    }),
    { status: 200, headers: corsHeaders }
  );
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    return await handleRequest(email);
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    return await handleRequest(body?.email);
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
