// File: src/app/api/time-entries/route.js
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const employeeId = searchParams.get('employeeId')

  if (!employeeId) {
    return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 })
  }

  const { db } = await connectToDatabase()
  const timeEntries = await db.collection('timeEntries')
    .find({ employeeId: new ObjectId(employeeId) })
    .sort({ timestamp: -1 })
    .limit(10)
    .toArray()

  return NextResponse.json(timeEntries)
}

export async function POST(request) {
  const { type, employeeId } = await request.json()

  if (!type || !employeeId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const { db } = await connectToDatabase()
    const timeEntries = db.collection('timeEntries')

    // Check if the employee is already clocked in when trying to clock in
    if (type === 'in') {
      const lastEntry = await timeEntries.findOne(
        { employeeId: new ObjectId(employeeId) },
        { sort: { timestamp: -1 } }
      )

      if (lastEntry && lastEntry.type === 'in') {
        return NextResponse.json({ error: 'Employee is already clocked in' }, { status: 400 })
      }
    }

    const result = await timeEntries.insertOne({
      type,
      employeeId: new ObjectId(employeeId),
      timestamp: new Date(),
    })

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error('Error creating time entry:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
