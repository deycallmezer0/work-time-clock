import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { verifyToken } from '@/app/lib/auth';

export async function PUT(req) {
  try {
    await dbConnect();
    const token = req.headers.get('Authorization')?.split(' ')[1];
    const userId = await verifyToken(token);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { hourlyRate } = await req.json();

    if (typeof hourlyRate !== 'number' || hourlyRate <= 0) {
      return NextResponse.json({ error: 'Invalid hourly rate' }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { hourlyRate: hourlyRate } },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user data:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}