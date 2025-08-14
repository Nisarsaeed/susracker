// src/app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '../../../../lib/dbConnect';
import Admin from '../../../../models/Admin';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    await connectDB();
    const user = await Admin.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }
    const sessionToken = { email, loggedIn: true };

    return NextResponse.json(
      { message: "Login successful" },
      { headers: { "Set-Cookie": `session=${JSON.stringify(sessionToken)}; Path=/; HttpOnly;` } }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
