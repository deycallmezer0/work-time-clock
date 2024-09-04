// File: src/app/register/page.js
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })

    if (response.ok) {
      router.push('/login')
    } else {
      // Handle error
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">
        Register
      </button>
    </form>
  )
}
