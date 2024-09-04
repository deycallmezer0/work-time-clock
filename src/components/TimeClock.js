// File: src/components/TimeClock.js
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function TimeClock({ employeeId }) {
  const { data: session } = useSession()
  const [status, setStatus] = useState('out')

  useEffect(() => {
    fetchCurrentStatus()
  }, [employeeId])

  const fetchCurrentStatus = async () => {
    const response = await fetch(`/api/time-entries/status/${employeeId}`)
    if (response.ok) {
      const data = await response.json()
      setStatus(data.status)
    }
  }

  const handleClockInOut = async () => {
    const type = status === 'out' ? 'in' : 'out'
    const response = await fetch('/api/time-entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, employeeId })
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
