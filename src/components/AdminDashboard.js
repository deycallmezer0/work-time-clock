// File: src/components/AdminDashboard.js
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [report, setReport] = useState(null)

  if (!session || session.user.role !== 'admin') {
    return <p>Access denied. You must be an admin to view this page.</p>
  }

  const generateReport = async () => {
    const response = await fetch(`/api/reports?start=${startDate}&end=${endDate}`)
    const data = await response.json()
    setReport(data)
  }

  return (
    <div>
      <div className="mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <button
          onClick={generateReport}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Generate Report
        </button>
      </div>

      {report && (
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Name</th>
              <th className="text-left">Email</th>
              <th className="text-left">Regular Hours</th>
              <th className="text-left">Overtime Hours</th>
              <th className="text-left">Regular Pay</th>
              <th className="text-left">Overtime Pay</th>
              <th className="text-left">Total Pay</th>
            </tr>
          </thead>
          <tbody>
            {report.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.regularHours.toFixed(2)}</td>
                <td>{employee.overtimeHours.toFixed(2)}</td>
                <td>${employee.regularPay.toFixed(2)}</td>
                <td>${employee.overtimePay.toFixed(2)}</td>
                <td>${employee.totalPay.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}