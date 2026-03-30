import { NextResponse } from "next/server";

export const maxDuration = 60; // Applies to Vercel/Next.js hosting

import cloudinary from "@/lib/cloudinary";

import { corsHeaders } from "../../layout";

// Handle CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log(`[Upload API] Starting upload for: ${file.name}, Size: ${file.size}, Type: ${file.type}`);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Using base64 to avoid streaming issues with heavy buffers in serverless/dev environments
    const base64Data = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64Data}`;

    console.log(`[Upload API] Buffer converted to base64. Sending to Cloudinary...`);

    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto",
      timeout: 300000, // 5 minutes timeout
    });

    console.log(`[Upload API] Upload successful: ${uploadResult.secure_url}`);

    return NextResponse.json(
      { url: uploadResult.secure_url },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("[Upload API] Catch Block Error:", error);
    
    // Specific check for Cloudinary timeout or common errors
    const errorMessage = error.message === "Request Timeout" 
      ? "Upload took too long. Check your internet connection or try a smaller file."
      : (error.message || "Upload failed");

    return NextResponse.json(
      { error: errorMessage },
      { status: 500, headers: corsHeaders }
    );
  }
}
