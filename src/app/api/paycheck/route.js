// app/api/paycheck/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import TimeEntry from '@/app/models/TimeEntry';
import User from '@/app/models/User';
import { verifyToken } from '@/app/lib/auth';

export async function GET(req) {
  await dbConnect();

  const token = req.headers.get('Authorization')?.split(' ')[1];
  const userId = await verifyToken(token);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!startDate || !endDate) {
    return NextResponse.json({ error: 'Start date and end date are required' }, { status: 400 });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const timeEntries = await TimeEntry.find({
      user: userId,
      clockIn: { $gte: new Date(startDate), $lte: new Date(endDate) },
      clockOut: { $ne: null }
    });

    let totalHours = 0;
    let overtimeHours = 0;

    timeEntries.forEach(entry => {
      const hours = (entry.clockOut - entry.clockIn) / (1000 * 60 * 60);
      totalHours += hours;
      if (totalHours > 40) {
        overtimeHours += Math.min(hours, totalHours - 40);
      }
    });

    const regularHours = Math.min(totalHours, 40);
    const regularPay = regularHours * user.hourlyRate;
    const overtimePay = overtimeHours * (user.hourlyRate * 1.5);
    const totalPay = regularPay + overtimePay;

    return NextResponse.json({
      regularHours,
      overtimeHours,
      regularPay,
      overtimePay,
      totalPay
    });
  } catch (error) {
    console.error('Paycheck calculation error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}