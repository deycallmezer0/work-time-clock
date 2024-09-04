// File: src/components/EmployeeList.js
'use client'

import { useState, useEffect } from 'react'
import TimeClock from './TimeClock'

export default function EmployeeList() {
  const [employees, setEmployees] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', password: '' })

  useEffect(() => {
    fetchEmployees()
  }, [])

  async function fetchEmployees() {
    const token = localStorage.getItem('token')
    const response = await fetch('/api/employees', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await response.json()
    setEmployees(data)
  }

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      fetchEmployees()
    } else {
      alert('Registration failed')
    }
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search employees"
        className="w-full p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <button
        onClick={() => setShowRegisterForm(!showRegisterForm)}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        {showRegisterForm ? 'Cancel' : 'Register New Employee'}
      </button>

      {showRegisterForm && (
        <form onSubmit={handleRegister} className="mb-4">
          <input
            type="text"
            placeholder="Name"
            value={newEmployee.name}
            onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
            required
            className="p-2 mr-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={newEmployee.email}
            onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
            required
            className="p-2 mr-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={newEmployee.password}
            onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
            required
            className="p-2 mr-2 border rounded"
          />
          <button type="submit" className="p-2 bg-green-500 text-white rounded">
            Register
          </button>
        </form>
      )}

      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Name</th>
            <th className="text-left">Email</th>
            <th className="text-left">Employee ID</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.employeeId}</td>
              <td>
                <TimeClock employeeId={employee._id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
