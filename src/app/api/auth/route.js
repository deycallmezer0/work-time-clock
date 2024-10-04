// app/api/auth/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/app/lib/mongodb';
import User from '@/app/models/User';
export async function GET(req) {
    try {
      await dbConnect();
      const token = req.headers.get('Authorization')?.split(' ')[1];
      const userId = await verifyToken(token);
  
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      const timeEntries = await TimeEntry.find({ user: userId }).sort('-clockIn');
      return NextResponse.json(timeEntries);
    } catch (error) {
      console.error('Error fetching time entries:', error);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  }
export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    console.log('Received body:', body);  // Log the received body

    if (!body.email || !body.password) {
      console.log('Missing email or password');
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const { email, password } = body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
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

    console.log('Authentication successful for user:', email);
    return NextResponse.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}