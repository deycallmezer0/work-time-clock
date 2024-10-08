// app/api/auth/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/app/lib/mongodb';
import User from '@/app/models/User';

export async function POST(req) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    // Create and sign a JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return the token and user info (excluding the password)
    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email,
      hourlyRate: user.hourlyRate
    };

    return NextResponse.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}