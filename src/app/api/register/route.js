// File: src/app/api/register/route.js
import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../lib/database'
import bcrypt from 'bcryptjs'
import { validateEmail, validatePassword } from '../../../lib/validation'

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    if (!validatePassword(password)) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 })
    }

    const db = await connectToDatabase()

    const existingUser = await db.collection('users').findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    const hashedPassword = bcrypt.hashSync(password, 10)
    const result = await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
      role: 'employee'
    })

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}