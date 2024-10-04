import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import TimeEntry from '@/app/models/TimeEntry';
import User from '@/app/models/User';
import { verifyToken } from '@/app/lib/auth';
import { ObjectId } from 'mongodb';

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
  const employeeName = searchParams.get('employeeName');

  if (!startDate || !endDate) {
    return NextResponse.json({ error: 'Start and end dates are required' }, { status: 400 });
  }

  try {
    let query = {
      clockIn: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    if (employeeName) {
      const users = await User.find({ name: { $regex: employeeName, $options: 'i' } });
      const userIds = users.map(user => new ObjectId(user._id));
      query.user = { $in: userIds };
    }

    const timeEntries = await TimeEntry.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          _id: 1,
          clockIn: 1,
          clockOut: 1,
          userName: '$userDetails.name'
        }
      },
      { $sort: { clockIn: 1 } }
    ]);

    return NextResponse.json(timeEntries);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}