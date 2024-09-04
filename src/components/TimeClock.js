// File: src/components/TimeClock.js
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TimeClock() {
  const [status, setStatus] = useState('out')
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      fetchCurrentStatus(JSON.parse(storedUser).id)
    }
  }, [])

  const fetchCurrentStatus = async (userId) => {
    const response = await fetch(`/api/time-entries/status/${userId}`)
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
      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)
      fetchCurrentStatus(data.user.id)
    } else {
      alert('Login failed')
    }
  }

  const handleClockInOut = async () => {
    const type = status === 'out' ? 'in' : 'out'
    const response = await fetch('/api/time-entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, employeeId: user.id })
    })

    if (response.ok) {
      setStatus(type)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    setStatus('out')
    router.push('/')
  }

  if (!user) {
    return (
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Login</button>
      </form>
    )
  }

  return (
    <div className="space-y-4">
      <p>Welcome, {user.name}!</p>
      <button
        onClick={handleClockInOut}
        className={`w-full p-2 text-white rounded ${status === 'out' ? 'bg-green-500' : 'bg-red-500'}`}
      >
        Clock {status === 'out' ? 'In' : 'Out'}
      </button>
      <button onClick={handleLogout} className="w-full p-2 bg-gray-500 text-white rounded">
        Logout
      </button>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TimeClock() {
  const [status, setStatus] = useState('out')
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      fetchCurrentStatus(JSON.parse(storedUser).id)
    }
  }, [])

  const fetchCurrentStatus = async (userId) => {
    const response = await fetch(`/api/time-entries/status/${userId}`)
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
      body: JSON.stringify({ type, employeeId: user.id })
    })

    if (response.ok) {
      setStatus(type)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    setStatus('out')
    router.push('/')
  }

  if (!user) {
    return <p>Please log in to use the time clock.</p>
  }

  return (
    <div className="space-y-4">
      <p>Welcome, {user.name}!</p>
      <button
        onClick={handleClockInOut}
        className={`w-full p-2 text-white rounded ${status === 'out' ? 'bg-green-500' : 'bg-red-500'}`}
      >
        Clock {status === 'out' ? 'In' : 'Out'}
      </button>
      <button onClick={handleLogout} className="w-full p-2 bg-gray-500 text-white rounded">
        Logout
      </button>
    </div>
  )
}
