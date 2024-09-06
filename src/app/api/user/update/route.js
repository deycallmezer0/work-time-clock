import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import { verifyToken } from '@/app/lib/auth';
import User from '@/lib/models/User';

export async function PUT(request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();

    const { hourlyRate } = await request.json();

    const updatedUser = await User.findByIdAndUpdate(
      decodedToken.userId,
      { hourlyRate },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Hourly rate updated successfully' });
  } catch (error) {
    console.error('Error updating hourly rate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
