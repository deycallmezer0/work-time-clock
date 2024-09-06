import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import { verifyToken } from '@/app/lib/auth';
import Employee from '@/app/lib/models/Employee';

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

    const updatedEmployee = await Employee.findOneAndUpdate(
      { employeeId: decodedToken.employeeId },
      { hourlyRate },
      { new: true }
    );

    if (!updatedEmployee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Hourly rate updated successfully', employee: updatedEmployee });
  } catch (error) {
    console.error('Error updating hourly rate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
