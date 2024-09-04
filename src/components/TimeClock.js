// File: src/components/TimeClock.js
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function TimeClock() {
  const { data: session } = useSession()
  const [status, setStatus] = useState('out')

  const handleClockInOut = async () => {
    const type = status === 'out' ? 'in' : 'out'
    const response = await fetch('/api/time-entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type })
    })

    if (response.ok) {
      setStatus(type)
    }
  }

  if (!session) return null

  return (
    <button
      onClick={handleClockInOut}
      className={`p-2 text-white rounded ${status === 'out' ? 'bg-green-500' : 'bg-red-500'}`}
    >
      Clock {status === 'out' ? 'In' : 'Out'}
    </button>
  )
}