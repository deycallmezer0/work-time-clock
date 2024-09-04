// File: src/components/EmployeeList.js
'use client'

import { useState, useEffect } from 'react'
import TimeClock from './TimeClock'

export default function EmployeeList() {
  const [employees, setEmployees] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchEmployees()
  }, [])

  async function fetchEmployees() {
    const response = await fetch('/api/employees')
    const data = await response.json()
    setEmployees(data)
  }

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <input
        type="text"
        placeholder="Search employees"
        className="w-full p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

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
