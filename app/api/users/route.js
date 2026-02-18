// app/api/users/route.js
import { dbConnect } from '@/lib/dbConnect';
import User from '@/lib/models/user';
import bcrypt from "bcryptjs";

import { corsHeaders } from '../../layout';

// Handle preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// GET /api/users → list all users
export async function GET() {
  await dbConnect();

  try {
    const users = await User.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Failed to fetch users' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// POST /api/users → create a new user
export async function POST(req) {
  await dbConnect();

  try {
    const { email, name, role = 'admin', access = [], password } = await req.json();

    const existing = await User.findOne({ email });
    if (existing) {
      return new Response(JSON.stringify({ message: 'User already exists' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;
    const user = await User.create({ email, name, role, access, passwordHash });
    const userObj = user.toObject();
    delete userObj.passwordHash;
    return new Response(JSON.stringify(userObj), {
      status: 201,
      headers: corsHeaders,
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Failed to create user' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
