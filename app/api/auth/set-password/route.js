import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import Invite from "@/lib/models/invite";
import User from "@/lib/models/user";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(req) {
  try {
    await dbConnect();

    const { email, token, password } = await req.json();
    const normalizedEmail = email?.toLowerCase()?.trim();

    if (!normalizedEmail || !token || !password) {
      return NextResponse.json(
        { error: "Email, token, and password are required" },
        { status: 400 }
      );
    }

    const invite = await Invite.findOne({ email: normalizedEmail });
    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    if (
      !invite.passwordSetupTokenHash ||
      !invite.passwordSetupExpiresAt ||
      invite.passwordSetupExpiresAt < new Date()
    ) {
      return NextResponse.json(
        { error: "Password setup link expired or invalid" },
        { status: 410 }
      );
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    if (tokenHash !== invite.passwordSetupTokenHash) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const existingUser = await User.findOne({ email: normalizedEmail }).select(
      "+passwordHash"
    );
    if (existingUser?.passwordHash) {
      return NextResponse.json(
        { error: "Password already set" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    if (existingUser) {
      existingUser.passwordHash = passwordHash;
      if (!existingUser.role) existingUser.role = invite.role;
      if (!existingUser.access?.length) existingUser.access = invite.access || [];
      await existingUser.save();
    } else {
      await User.create({
        email: normalizedEmail,
        name: "",
        role: invite.role,
        access: invite.access || [],
        passwordHash,
      });
    }

    invite.accepted = true;
    invite.passwordSetupTokenHash = undefined;
    invite.passwordSetupExpiresAt = undefined;
    await invite.save();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("❌ Set password error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
