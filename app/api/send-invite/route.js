import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Invite from "@/lib/models/invite";
import { dbConnect } from "@/lib/dbConnect";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "@/lib/models/user";

import { corsHeaders } from "../../layout";

// Handle preflight requests
export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    console.log("📥 Incoming Invite Payload:", JSON.stringify(body, null, 2));

    const { email, role, access, password, skipEmail } = body;

    if (!email || !role) {
      console.log("❌ Missing email or role");
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(access)) {
      console.log("❌ Access is not an array:", access);
      return NextResponse.json(
        { error: "Access must be an array" },
        { status: 422 }
      );
    }

    const existing = await Invite.findOne({ email });
    if (existing && !password) {
      console.log("⚠️ Email already invited:", email);
      return NextResponse.json(
        { error: "Email already invited" },
        { status: 409 }
      );
    }

    let rawToken = null;
    let passwordSetupTokenHash = null;
    let passwordSetupExpiresAt = null;
    if (!password) {
      rawToken = crypto.randomBytes(32).toString("hex");
      passwordSetupTokenHash = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");
      passwordSetupExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 72); // 72h
    }

    let invite = existing;
    if (!invite) {
      invite = await Invite.create({
        email,
        role,
        access,
        passwordSetupTokenHash,
        passwordSetupExpiresAt,
      });
    } else {
      invite.role = role;
      invite.access = access;
      if (passwordSetupTokenHash && passwordSetupExpiresAt) {
        invite.passwordSetupTokenHash = passwordSetupTokenHash;
        invite.passwordSetupExpiresAt = passwordSetupExpiresAt;
      }
      await invite.save();
    }
    console.log("✅ Invite saved to DB:", invite);

    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      const existingUser = await User.findOne({ email }).select(
        "+passwordHash"
      );
      if (existingUser) {
        existingUser.passwordHash = passwordHash;
        if (!existingUser.role) existingUser.role = role;
        if (!existingUser.access?.length) existingUser.access = access || [];
        await existingUser.save();
      } else {
        await User.create({
          email,
          role,
          access,
          passwordHash,
        });
      }
    }

    if (password || skipEmail) {
      return NextResponse.json(
        {
          success: true,
          invite,
          manualPassword: !!password,
          passwordSetupToken: rawToken || undefined,
        },
        { status: 201, headers: corsHeaders }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const baseUrl = "https://cms.jamiat.org.in";
    const passwordLink = `${baseUrl}/set-password?email=${encodeURIComponent(
      email
    )}&token=${rawToken}`;

    const result = await transporter.sendMail({
      from: '"Jamiat Admin" <info@jamiat.org.in>',
      to: email,
      subject: "You are invited to Jamiat Admin Dashboard",
      html: `
        <h2>You've been invited to Jamiat Admin</h2>
        <p>You were invited to join the admin dashboard with role: <b>${role}</b></p>
        <p><a href="${baseUrl}/login">Click here to sign in</a> using Google.</p>
        <p>Or set your password (valid for 72 hours): <a href="${passwordLink}">Set Password</a></p>
        <p>If your email client hides the link, use this token on the Set Password page:</p>
        <p><code style="font-size:12px;word-break:break-all;">${rawToken}</code></p>
      `,
    });

    console.log("📤 Email sent:", result.messageId);

    return NextResponse.json(
      { success: true, invite },
      { status: 201, headers: corsHeaders }
    );
  } catch (err) {
    console.error("❌ Invite Error:", err.message);
    console.error(err.stack);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
