// File: src/components/TimeClock.js
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TimeClock({ employeeId }) {
  const [status, setStatus] = useState('out')
  const [token, setToken] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
      fetchCurrentStatus(storedToken)
    }
  }, [employeeId])

  const fetchCurrentStatus = async (authToken) => {
    const response = await fetch(`/api/time-entries/status/${employeeId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    })
    if (response.ok) {
      const data = await response.json()
      setStatus(data.status)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (response.ok) {
      const data = await response.json()
      localStorage.setItem('token', data.token)
      setToken(data.token)
      fetchCurrentStatus(data.token)
    } else {
      alert('Login failed')
    }
  }

  const handleClockInOut = async () => {
    const type = status === 'out' ? 'in' : 'out'
    const response = await fetch('/api/time-entries', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ type, employeeId })
    })

    if (response.ok) {
      setStatus(type)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    router.push('/')
  }

  if (!token) {
    return (
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    )
  }

  return (
    <div>
      <button
        onClick={handleClockInOut}
        className={`p-2 text-white rounded ${status === 'out' ? 'bg-green-500' : 'bg-red-500'}`}
      >
        Clock {status === 'out' ? 'In' : 'Out'}
      </button>
      <button onClick={handleLogout} className="ml-2 p-2 bg-gray-500 text-white rounded">
        Logout
      </button>
    </div>
  )
}
