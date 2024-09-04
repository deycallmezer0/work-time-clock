// File: src/app/api/time-entries/route.js
import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../lib/database'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET(request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = await connectToDatabase()
  const timeEntries = await db.collection('timeEntries')
    .find({ userId: session.user.id })
    .sort({ timestamp: -1 })
    .limit(10)
    .toArray()

  return NextResponse.json(timeEntries)
}