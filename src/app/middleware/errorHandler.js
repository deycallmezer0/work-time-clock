// app/middleware/errorHandler.js
import { NextResponse } from 'next/server';

export function errorHandler(error, req) {
  console.error('Error:', error);

  if (error.name === 'ValidationError') {
    return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
  }

  if (error.name === 'UnauthorizedError') {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  if (error.name === 'NotFoundError') {
    return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
  }

  // Default server error
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}