// app/api/timeentry/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import TimeEntry from '@/app/models/TimeEntry';
import { verifyToken } from '@/app/lib/auth';

export async function GET(req) {
  await dbConnect();

  const token = req.headers.get('Authorization')?.split(' ')[1];
  const userId = await verifyToken(token);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const timeEntries = await TimeEntry.find({ user: userId })
      .sort({ clockIn: -1 })
      .limit(10); // Limit to the 10 most recent entries

    return NextResponse.json(timeEntries);
  } catch (error) {
    console.error('Error fetching time entries:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
    await dbConnect();
  
    const token = req.headers.get('Authorization')?.split(' ')[1];
    const userId = await verifyToken(token);
  
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    const { action, clockIn, clockOut } = await req.json();
  
    try {
      if (action === 'clockIn') {
        const newEntry = new TimeEntry({
          user: userId,
          clockIn: new Date(),
        });
        await newEntry.save();
        return NextResponse.json({ message: 'Clocked in successfully', entry: newEntry });
      } else if (action === 'clockOut') {
        const lastEntry = await TimeEntry.findOne({ user: userId, clockOut: null }).sort('-clockIn');
        if (!lastEntry) {
          return NextResponse.json({ error: 'No active clock-in found' }, { status: 400 });
        }
        lastEntry.clockOut = new Date();
        await lastEntry.save();
        return NextResponse.json({ message: 'Clocked out successfully', entry: lastEntry });
      } else if (action === 'manualEntry') {
        const newEntry = new TimeEntry({
          user: userId,
          clockIn: new Date(clockIn),
          clockOut: clockOut ? new Date(clockOut) : null,
        });
        await newEntry.save();
        return NextResponse.json({ message: 'Manual entry added successfully', entry: newEntry });
      } else {
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  }