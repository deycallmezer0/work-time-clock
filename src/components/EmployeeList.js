// File: src/components/EmployeeList.js
'use client'

import { useState } from 'react'
import TimeClock from './TimeClock'

export default function EmployeeList() {
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', password: '' })

  const handleRegister = async (e) => {
    e.preventDefault()
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEmployee)
    })

    if (response.ok) {
      alert('Employee registered successfully')
      setShowRegisterForm(false)
      setNewEmployee({ name: '', email: '', password: '' })
    } else {
      alert('Registration failed')
    }
  }

  return (
    <div className="space-y-8">
      <TimeClock />

      <div>
        <button
          onClick={() => setShowRegisterForm(!showRegisterForm)}
          className="mb-4 p-2 bg-blue-500 text-white rounded"
        >
          {showRegisterForm ? 'Cancel' : 'Register New Employee'}
        </button>

        {showRegisterForm && (
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={newEmployee.password}
              onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
              required
              className="w-full p-2 border rounded"
            />
            <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
