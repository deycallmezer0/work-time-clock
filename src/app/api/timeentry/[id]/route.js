// app/api/timeentry/[id]/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import TimeEntry from '@/app/models/TimeEntry';
import { verifyToken } from '@/app/lib/auth';

export async function PUT(req, { params }) {
  await dbConnect();

  const token = req.headers.get('Authorization')?.split(' ')[1];
  const userId = await verifyToken(token);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { clockIn, clockOut } = await req.json();
    const updatedEntry = await TimeEntry.findOneAndUpdate(
      { _id: params.id, user: userId },
      { clockIn, clockOut },
      { new: true }
    );

    if (!updatedEntry) {
      return NextResponse.json({ error: 'Time entry not found or you do not have permission to edit it' }, { status: 404 });
    }

    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error('Error updating time entry:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();

  const token = req.headers.get('Authorization')?.split(' ')[1];
  const userId = await verifyToken(token);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const deletedEntry = await TimeEntry.findOneAndDelete({ _id: params.id, user: userId });

    if (!deletedEntry) {
      return NextResponse.json({ error: 'Time entry not found or you do not have permission to delete it' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Time entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting time entry:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}