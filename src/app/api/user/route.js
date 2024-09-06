// app/api/user/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import User from '@/app/models/User';
import { verifyToken } from '@/app/lib/auth';

export async function GET(req) {
  try {
    await dbConnect();
    const token = req.headers.get('Authorization')?.split(' ')[1];
    const userId = await verifyToken(token);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database';
import { verifyToken } from '@/lib/auth';
import Employee from '@/lib/models/Employee';

export async function GET(request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();

    const employee = await Employee.findById(decodedToken.userId).select('-password');

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
