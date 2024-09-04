import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  const { employeeId } = params;

  try {
    const { db } = await connectToDatabase();
    const timeEntries = db.collection('timeEntries');

    // Find the latest time entry for the employee
    const latestEntry = await timeEntries.findOne(
      { employeeId: new ObjectId(employeeId) },
      { sort: { timestamp: -1 } }
    );

    // Determine the current status
    const status = latestEntry && latestEntry.type === 'in' ? 'in' : 'out';

    return NextResponse.json({ status });
  } catch (error) {
    console.error('Error fetching clock status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
