// app/api/report/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import TimeEntry from '@/app/models/TimeEntry';
import User from '@/app/models/User';
import { verifyToken } from '@/app/lib/auth';

export async function POST(req) {
  await dbConnect();

  const token = req.headers.get('Authorization')?.split(' ')[1];
  const userId = await verifyToken(token);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { startDate, endDate, reportTitle } = await req.json();

    const users = await User.find();
    const reportData = [];

    for (const user of users) {
      const timeEntries = await TimeEntry.find({
        user: user._id,
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

      reportData.push({
        userName: user.name,
        totalHours,
        regularHours,
        overtimeHours,
        totalPay
      });
    }

    return NextResponse.json({
      title: reportTitle,
      data: reportData
    });
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}